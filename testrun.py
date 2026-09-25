import sys

import requests

import config
from knowledge import chunk_text, extract_pdf_text


API_KEY = None

MODEL = config.REASONING_MODEL

OPENROUTER_URL = config.OPENROUTER_URL


SYSTEM_PROMPT = """
You are the AI agent inside a private enterprise AI workbench.

ROLE:
You are a senior software engineer, technical analyst and
enterprise knowledge assistant.

CORE BEHAVIOR:
1. Analyze the user's requirement before answering.
2. Break complex problems into logical steps.
3. Produce accurate, practical and production-quality solutions.
4. Never invent APIs, libraries, company policies or facts.
5. Clearly identify assumptions.
6. If information is missing, say so instead of hallucinating.
7. Prefer secure and maintainable engineering practices.
8. When company documentation is provided, treat it as the
   primary source of truth.
9. Do not contradict company documentation without explaining
   the conflict.
10. Treat all uploaded organizational information as confidential.

DOCUMENT HANDLING:
- Use the supplied organization knowledge when answering.
- Distinguish between information found in the documents and
  your general knowledge.
- Do not claim that information exists in the documents if it
  does not.
- If the documents do not contain enough information, explicitly
  state that additional information is required.

SOFTWARE ENGINEERING:
- Write clean and maintainable code.
- Explain important architectural decisions.
- Check for syntax and logical errors.
- Mention dependencies when required.
- Prefer secure implementations.
- Do not blindly follow technically incorrect requirements.

OUTPUT:
Give a direct answer first.
Then provide reasoning, implementation details or relevant
references when necessary.
"""


def check_api_key():

    global API_KEY

    try:
        API_KEY = config.openrouter_api_key_alt()

    except RuntimeError as error:
        print(f"\n[ERROR] {error}")
        sys.exit(1)


def build_document_context(text):

    print("\n[2/4] Processing organization knowledge...")

    chunks = chunk_text(text)

    print(f"      Extracted {len(text):,} characters")

    print(f"      Created {len(chunks)} knowledge chunks")

    max_context_chars = 30000

    context = text[:max_context_chars]

    return context


def call_model(messages):

    headers = {

        "Authorization": f"Bearer {API_KEY}",

        "Content-Type": "application/json",

        "HTTP-Referer": "http://localhost",

        "X-Title": "Sovereign AI Workbench"
    }

    payload = {

        "model": MODEL,

        "messages": messages,

        "temperature": 0.2
    }

    try:

        response = requests.post(

            OPENROUTER_URL,

            headers=headers,

            json=payload,

            timeout=180
        )

        if response.status_code != 200:

            print("\n[ERROR] OpenRouter request failed.")

            print(response.text)

            return None

        data = response.json()

        return data["choices"][0]["message"]["content"]

    except requests.exceptions.Timeout:

        print("[ERROR] Request timed out.")

        return None

    except Exception as error:

        print(f"[ERROR] API request failed: {error}")

        return None


def initialize_ai(document_context):

    print("\n[3/4] Initializing AI workbench...")

    organization_prompt = f"""
ORGANIZATION KNOWLEDGE BASE
============================

The following information was extracted from documents
provided by the organization.

Use this information as organization-specific context.

IMPORTANT:
- Do not treat this as universally true knowledge.
- Use it only when relevant.
- If the answer cannot be found here, say that it is not
  available in the provided organization knowledge.

--- BEGIN ORGANIZATION DATA ---

{document_context}

--- END ORGANIZATION DATA ---
"""

    messages = [

        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },

        {
            "role": "system",
            "content": organization_prompt
        }
    ]

    test_message = {

        "role": "user",

        "content": """
Confirm that the AI workbench has been initialized.

Respond with:
1. Model status
2. Organization knowledge status
3. Your role
4. Whether you are ready for tasks
"""
    }

    messages.append(test_message)

    response = call_model(messages)

    if response:

        print("\n================ AI INITIALIZED ================\n")

        print(response)

        print("\n=================================================\n")

        messages.pop()

        return messages

    return None


def chat_loop(messages):

    print("\n[4/4] Workbench ready.")

    print("\nCommands:")
    print("  /exit   → Exit")
    print("  /clear  → Clear conversation")
    print("\n")

    while True:

        try:

            user_input = input("You: ").strip()

        except KeyboardInterrupt:

            print("\n\nExiting...")

            break

        if not user_input:

            continue

        if user_input.lower() == "/exit":

            print("\nAI Workbench stopped.")

            break

        if user_input.lower() == "/clear":
            messages = messages[:2]

            print("\nConversation cleared.\n")

            continue

        messages.append({

            "role": "user",

            "content": user_input
        })

        print("\nAI: ", end="", flush=True)

        response = call_model(messages)

        if response:

            print(response)

            messages.append({

                "role": "assistant",

                "content": response
            })

        else:

            print("Unable to get a response.")

            messages.pop()


def main():

    print("\n")
    print("==============================================")
    print("       SOVEREIGN AI WORKBENCH")
    print("==============================================")
    print(f"Model: {MODEL}")
    print("Provider: OpenRouter")
    print("==============================================")

    check_api_key()

    print("\nUpload your organization knowledge.")

    pdf_path = input(
        "Enter PDF file path: "
    ).strip()

    if not pdf_path:

        print("[ERROR] No PDF path provided.")

        return

    print("\n[1/4] Reading PDF...")

    try:
        document_text = extract_pdf_text(pdf_path)

    except ValueError as error:
        print(f"\n[ERROR] {error}")

        return

    if not document_text:

        print(
            "\n[ERROR] Could not extract any information "
            "from the PDF."
        )

        return

    organization_context = build_document_context(
        document_text
    )

    messages = initialize_ai(
        organization_context
    )

    if messages is None:

        print(
            "\n[ERROR] Could not initialize AI."
        )

        return

    chat_loop(messages)


if __name__ == "__main__":

    main()
