document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. TYPEWRITER ANIMATION (HERO)
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Veri Bilimi Tutkunu",
        "Full Stack Web Geliştirici",
        "Mobil Geliştirme Meraklısı",
        "Bilgisayar Mühendisi Adayı"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       2. STICKY NAVBAR & SCROLL DETECT
       ========================================================================== */
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       3. ACTIVE NAV LINK TRACKING (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       4. MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const menuIcon = mobileToggle.querySelector('.menu-icon');
    const closeIcon = mobileToggle.querySelector('.close-icon');

    function toggleMenu() {
        navMenu.classList.toggle('open');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       5. SKILL BARS LOADING ANIMATION
       ========================================================================== */
    const skillProgresses = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');

    skillProgresses.forEach(prog => {
        prog.dataset.width = prog.style.width;
        prog.style.width = '0%';
    });

    const skillsObserverOptions = {
        root: null,
        threshold: 0.15
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillProgresses.forEach(prog => {
                    prog.style.width = prog.dataset.width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, skillsObserverOptions);

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       6. PROJECT CARD CURSOR GLOW EFFECT
       ========================================================================== */
    const glowCards = document.querySelectorAll('.project-card[data-glow]');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--glow-x', `${x}px`);
            card.style.setProperty('--glow-y', `${y}px`);
        });
    });

    /* ==========================================================================
       7. CONTACT FORM SUBMISSION HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Gönderiliyor...</span> <div class="spinner"></div>';

            const formData = new FormData(contactForm);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    formFeedback.classList.remove('hidden');
                } else {
                    alert("Mesaj gönderilirken bir hata oluştu: " + json.message);
                }
            })
            .catch((error) => {
                alert("Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            contactForm.reset();
            formFeedback.classList.add('hidden');
        });
    }
});
