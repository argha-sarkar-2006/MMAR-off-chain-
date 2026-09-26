/**
 * 3rd-Route / MMAR Sovereign AI Workbench - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navbar Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navRight = document.getElementById('navRight');

  if (mobileToggle && navRight) {
    mobileToggle.addEventListener('click', () => {
      navRight.classList.toggle('open');
      const isExpanded = navRight.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking any nav link
    navRight.querySelectorAll('.nav-link, .nav-btn-download').forEach(link => {
      link.addEventListener('click', () => {
        navRight.classList.remove('open');
      });
    });
  }

  // 2. Interactive Accordions (Explore More Section)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isActive = item.classList.contains('active');

      // Optional: close other accordions for clean single-view accordion
      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // 3. Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update browser history hash
          if (history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            location.hash = targetId;
          }
        }
      }
    });
  });

  // 4. Copy Code Snippet Handler
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeBlock = btn.closest('.code-block');
      const codeElement = codeBlock ? codeBlock.querySelector('pre code') : null;
      if (codeElement) {
        const textToCopy = codeElement.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style="color: #22c55e;">Copied!</span>
          `;
          btn.style.borderColor = 'rgba(34, 197, 94, 0.4)';

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code: ', err);
        }
      }
    });
  });

  // 5. Docs Sidebar Navigation & Search (for docs.html)
  const docsNavItems = document.querySelectorAll('.docs-nav-item');
  const docsSearchInput = document.getElementById('docsSearchInput');
  const btnToggleDocs = document.getElementById('btnToggleDocs');
  const docsSidebar = document.getElementById('docsSidebar');

  // Mobile Docs Drawer Toggle
  if (btnToggleDocs && docsSidebar) {
    btnToggleDocs.addEventListener('click', () => {
      docsSidebar.classList.toggle('open');
    });
  }

  // Docs Sidebar Item Click
  if (docsNavItems.length > 0) {
    docsNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        if (targetId) {
          const section = document.getElementById(targetId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            docsNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (docsSidebar && docsSidebar.classList.contains('open')) {
              docsSidebar.classList.remove('open');
            }
          }
        }
      });
    });

    // IntersectionObserver to highlight docs sidebar on scroll
    const docSections = document.querySelectorAll('.doc-section');
    if ('IntersectionObserver' in window && docSections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            docsNavItems.forEach(item => {
              if (item.getAttribute('data-target') === currentId) {
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            });
          }
        });
      }, {
        rootMargin: '-20% 0px -70% 0px'
      });

      docSections.forEach(sec => observer.observe(sec));
    }
  }

  // Docs Filter Search
  if (docsSearchInput) {
    docsSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      docsNavItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });

      // Show/Hide category headings if no children visible
      document.querySelectorAll('.docs-nav-group').forEach(group => {
        const visibleItems = group.querySelectorAll('.docs-nav-item:not([style*="display: none"])');
        const title = group.querySelector('.docs-group-title');
        if (title) {
          title.style.display = visibleItems.length === 0 ? 'none' : 'block';
        }
      });
    });
  }

  // 6. Home Page Scrollspy for active nav items
  const homeSections = document.querySelectorAll('section[id]');
  if (homeSections.length > 0 && 'IntersectionObserver' in window) {
    const homeNavObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    homeSections.forEach(section => homeNavObserver.observe(section));
  }
});
