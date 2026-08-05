// Faizan Ali — Portfolio JavaScript
// Features: Sticky Navbar, Mobile Menu, Back-to-Top, Active Nav Link,
//           Typewriter Effect, Scroll Reveal (IntersectionObserver), EmailJS Contact Form

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // ELEMENT REFERENCES
    // =============================================
    const navbar         = document.getElementById('navbar');
    const navLinks       = document.querySelectorAll('.nav-link');
    const mobileToggle   = document.getElementById('mobile-toggle');
    const navLinksMenu   = document.getElementById('nav-links');
    const backToTopBtn   = document.getElementById('back-to-top');
    const contactForm    = document.getElementById('contact-form');
    const formStatus     = document.getElementById('form-status');
    const typewriterEl   = document.getElementById('typewriter');

    // =============================================
    // 1. STICKY NAVBAR + BACK-TO-TOP VISIBILITY
    // =============================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Navbar state
                navbar.classList.toggle('scrolled', scrollY > 60);

                // Back-to-top button
                if (backToTopBtn) {
                    backToTopBtn.classList.toggle('visible', scrollY > 500);
                }

                // Active nav link highlight
                highlightActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // =============================================
    // 2. ACTIVE NAV LINK ON SCROLL
    // =============================================
    function highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 140;

        sections.forEach(section => {
            const sTop = section.offsetTop;
            const sH   = section.offsetHeight;
            const sId  = section.getAttribute('id');

            if (scrollPos >= sTop && scrollPos < sTop + sH) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    highlightActiveLink();

    // =============================================
    // 3. MOBILE MENU TOGGLE
    // =============================================
    function closeMobileMenu() {
        navLinksMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-controls', 'nav-links');

        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinksMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (isOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                document.body.style.overflow = 'hidden';
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                closeMobileMenu();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => closeMobileMenu());
        });

        document.addEventListener('click', (e) => {
            if (
                navLinksMenu.classList.contains('active') &&
                !navLinksMenu.contains(e.target) &&
                !mobileToggle.contains(e.target)
            ) {
                closeMobileMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinksMenu.classList.contains('active')) {
                closeMobileMenu();
                mobileToggle.focus();
            }
        });
    }

    // =============================================
    // 4. BACK TO TOP
    // =============================================
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // 5. TYPEWRITER EFFECT
    // =============================================
    if (typewriterEl) {
        const roles = [
            'Java Developer',
            'Web Developer',
            'MCA Student',
            'Software Engineer',
            'GenAI Enthusiast',
        ];

        let roleIndex  = 0;
        let charIndex  = 0;
        let isDeleting = false;
        let typeTimer  = null;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                charIndex--;
                typewriterEl.textContent = currentRole.substring(0, charIndex);
            } else {
                charIndex++;
                typewriterEl.textContent = currentRole.substring(0, charIndex);
            }

            let speed = isDeleting ? 55 : 95;

            if (!isDeleting && charIndex === currentRole.length) {
                speed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex  = (roleIndex + 1) % roles.length;
                speed = 450;
            }

            typeTimer = setTimeout(type, speed);
        }

        // Pause typewriter when tab is hidden (performance)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearTimeout(typeTimer);
            } else {
                typeTimer = setTimeout(type, 300);
            }
        });

        // Respect reduced motion preference
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
            setTimeout(type, 600);
        } else {
            typewriterEl.textContent = roles[0];
        }
    }

    // =============================================
    // 6. SCROLL REVEAL — INTERSECTION OBSERVER
    // =============================================
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && reveals.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver support
        reveals.forEach(el => el.classList.add('visible'));
    }

    // =============================================
    // 7. EMAILJS — CONTACT FORM
    // =============================================
    const EMAILJS_PUBLIC_KEY  = '43TsqjoiCvqkTClw8';
    const EMAILJS_SERVICE_ID  = 'service_hrw5veq';
    const EMAILJS_TEMPLATE_ID = 'template_935e2od';

    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        } catch (e) {
            console.warn('EmailJS init failed:', e);
        }
    }

    let statusTimer = null;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameEl    = document.getElementById('name');
            const emailEl   = document.getElementById('email');
            const subjectEl = document.getElementById('subject');
            const messageEl = document.getElementById('message');
            const submitBtn = document.getElementById('submit-btn');

            const name    = nameEl?.value.trim()    || '';
            const email   = emailEl?.value.trim()   || '';
            const subject = subjectEl?.value.trim() || '';
            const message = messageEl?.value.trim() || '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                showStatus('error', 'Please fill in all fields before submitting.');
                return;
            }

            if (!emailRegex.test(email)) {
                showStatus('error', 'Please enter a valid email address.');
                return;
            }

            if (typeof emailjs === 'undefined') {
                showStatus('error', 'Email service unavailable. Please email me directly at git.faizanali@gmail.com');
                return;
            }

            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
            submitBtn.disabled = true;
            clearStatus();

            const templateParams = {
                from_name:  name,
                from_email: email,
                subject:    subject,
                message:    message,
            };

            try {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                showStatus('success', '✓ Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
                scheduleStatusClear(7000);
            } catch (err) {
                console.error('EmailJS Error:', err);
                showStatus('error', '✕ Failed to send. Please email me directly at git.faizanali@gmail.com');
                scheduleStatusClear(9000);
            } finally {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled  = false;
            }
        });
    }

    function showStatus(type, msg) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.className   = `form-status ${type}`;
    }

    function clearStatus() {
        if (!formStatus) return;
        formStatus.textContent = '';
        formStatus.className   = 'form-status';
    }

    function scheduleStatusClear(delay) {
        clearTimeout(statusTimer);
        statusTimer = setTimeout(clearStatus, delay);
    }

    // =============================================
    // 8. SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight + 16 : 80;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // 9. GITHUB STATS — IMAGE LOAD ERROR GUARD
    // =============================================
    // The onerror attributes on img tags handle individual failures.
    // This adds a global check for any missed fallbacks.
    document.querySelectorAll('.github-stat-img').forEach(img => {
        if (img.complete && img.naturalWidth === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });

});
