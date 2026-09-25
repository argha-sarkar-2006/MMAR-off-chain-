"""HTTP API server for 3rd-Route.

Exposes the existing MMAR Python pipeline to the React frontend
without modifying any underlying pipeline modules.
"""

import os
import shutil
import tempfile
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, File, Form, HTTPException, Header, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

import config
import coding
import knowledge
import modelrouter
import reasoning
import vision

app = FastAPI(
    title="3rd-Route AI Workbench API",
    description="Local HTTP API bridging the 3rd-Route frontend to the MMAR backend",
    version="1.0.0",
)

# Enable CORS for local frontend development and distribution
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path(tempfile.gettempdir()) / "3rd-route-uploads"
TEMP_DIR.mkdir(parents=True, exist_ok=True)


class ChatRequest(BaseModel):
    prompt: str
    use_web: bool = True
    image_path: Optional[str] = None


class SearchRequest(BaseModel):
    query: str
    limit: int = 5


class CodingChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = None


@app.get("/api/status")
def get_status(
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None),
):
    """Return backend status, configured models, and account-specific knowledge base stats."""
    active_user = x_user_id or user_id or None
    doc_count = 0
    try:
        doc_count = knowledge.document_count(user_id=active_user)
    except Exception:
        pass

    return {
        "status": "online",
        "app_name": "3rd-Route",
        "user_id": active_user,
        "models": {
            "vision": config.VISION_OPENROUTER_MODELS,
            "reasoning": config.REASONING_MODEL,
            "coding": config.CODING_MODEL,
        },
        "knowledge_documents": doc_count,
        "endpoints": {
            "openrouter": config.OPENROUTER_URL,
            "ollama": config.OLLAMA_HOST,
        },
    }


@app.post("/api/chat")
async def chat_endpoint(
    prompt: str = Form(""),
    use_web: bool = Form(True),
    image: Optional[UploadFile] = File(None),
    user_id: Optional[str] = Form(None),
    x_user_id: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
):
    """Execute the multi-model pipeline via modelrouter.run().

    Accepts text queries, optional image attachments, and account user_id.
    """
    active_user = x_user_id or user_id or None
    image_temp_path = None
    try:
        if image and image.filename:
            suffix = Path(image.filename).suffix or ".png"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=TEMP_DIR) as tmp:
                shutil.copyfileobj(image.file, tmp)
                image_temp_path = tmp.name

        if not prompt and not image_temp_path:
            raise HTTPException(
                status_code=400,
                detail="Provide a text prompt, an image, or both.",
            )

        logs = []

        def collector_log(msg: str):
            logs.append(str(msg))

        result = modelrouter.run(
            image_path=image_temp_path,
            prompt=prompt,
            use_web=use_web,
            user_id=active_user,
            log=collector_log,
        )

        return {
            "success": True,
            "result": result,
            "logs": logs,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    finally:
        if image_temp_path and os.path.exists(image_temp_path):
            try:
                os.remove(image_temp_path)
            except OSError:
                pass


@app.post("/api/chat/json")
async def chat_json_endpoint(
    payload: ChatRequest,
    authorization: Optional[str] = Header(None),
):
    """Alternative JSON endpoint for text-only queries or pre-uploaded images."""
    try:
        logs = []

        def collector_log(msg: str):
            logs.append(str(msg))

        result = modelrouter.run(
            image_path=payload.image_path,
            prompt=payload.prompt,
            use_web=payload.use_web,
            log=collector_log,
        )

        return {
            "success": True,
            "result": result,
            "logs": logs,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/coding/chat")
async def coding_chat_endpoint(
    payload: CodingChatRequest,
    authorization: Optional[str] = Header(None),
):
    """Direct conversation with Ollama Cloud coding model."""
    try:
        messages = payload.history or []
        answer = coding.chat(payload.message, messages=messages)
        return {
            "success": True,
            "answer": answer,
            "history": messages,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/knowledge/documents")
def get_documents_count(
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None),
):
    """Get the current count of indexed knowledge documents for the active account."""
    active_user = x_user_id or user_id or None
    try:
        return {"count": knowledge.document_count(user_id=active_user)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/knowledge/search")
def search_knowledge(
    payload: SearchRequest,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None),
):
    """Search the local knowledge base using FTS5 for the active account."""
    active_user = x_user_id or user_id or None
    try:
        hits = knowledge.search(payload.query, limit=payload.limit, user_id=active_user)
        return {"query": payload.query, "hits": hits}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/knowledge/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    x_user_id: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
):
    """Upload and ingest a PDF document into the active account's knowledge base."""
    active_user = x_user_id or user_id or None
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for ingestion.")

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", dir=TEMP_DIR) as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        ids = knowledge.ingest_pdf(temp_path, title=title or file.filename, user_id=active_user)
        return {
            "success": True,
            "filename": file.filename,
            "chunks_stored": len(ids),
            "total_documents": knowledge.document_count(user_id=active_user),
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"Starting 3rd-Route API Server on http://{host}:{port}")
    uvicorn.run("server:app", host=host, port=port, reload=False)
