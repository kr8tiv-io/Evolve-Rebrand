document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches && window.matchMedia("(pointer: fine)").matches;
    const HERO_SELECTOR = ".home-hero, .comm-hero, .ind-hero, .res-hero";
    const isHeroElement = (el) => !!el.closest(HERO_SELECTOR);

    // === 1. UNIFIED SMART HEADER ===
    const header = document.querySelector(".site-header");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50 && currentScroll > lastScroll) {
            // Scrolling Down -> Hide
            header.classList.add("is-hidden");
        } else {
            // Scrolling Up -> Show
            header.classList.remove("is-hidden");
        }
        lastScroll = currentScroll;
    });

    // === 2. CINEMATIC TEXT REVEALS ===
    // Apply class="reveal-text" to any paragraph or header you want to animate
    const revealElements = document.querySelectorAll(".reveal-text, .hero-title-unified");
    
    revealElements.forEach(element => {
        if (isMobile && !isHeroElement(element)) return;
        // Split text logic could go here (SplitType), but for now, we fade/slide up
        gsap.fromTo(element, 
            { y: 50, opacity: 0, rotateX: 10 },
            {
                y: 0, 
                opacity: 1, 
                rotateX: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Starts when top of element hits 85% of viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // === 3. IMAGE PARALLAX ===
    // Apply class="parallax-img" to your images
    gsap.utils.toArray('.parallax-img').forEach(container => {
        gsap.to(container, {
            yPercent: 20, // Moves the image slightly slower than scroll
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // === MOUSE TRACKING GLOW FOR CARDS ===
    if (canHover) {
        const glowTargets = document.querySelectorAll(
            '.eng-card-unified, .kr8-img-card, .kr8-panel-card, .eh-card'
        );
        glowTargets.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // === MAGNETIC BUTTONS (Physics) ===
    if (canHover) {
        const magneticButtons = document.querySelectorAll('.btn-magnetic:not(.header-cta)');
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // === VIDEO PLAYBACK SPEED ===
    const slowVideos = document.querySelectorAll('video.video-half-speed');
    slowVideos.forEach(video => {
        const setRate = () => { video.playbackRate = 0.5; };
        if (video.readyState >= 1) {
            setRate();
        } else {
            video.addEventListener('loadedmetadata', setRate, { once: true });
        }
    });

    // === CURSOR AURA ===
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && canHover) {
        const cursorEffect = document.createElement('div');
        cursorEffect.className = 'cursor-effect';
        document.body.appendChild(cursorEffect);

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;
        let size = cursorEffect.offsetWidth || 220;
        let isActive = false;

        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
        const update = () => {
            currentX = lerp(currentX, targetX, 0.12);
            currentY = lerp(currentY, targetY, 0.12);
            cursorEffect.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0)`;
            requestAnimationFrame(update);
        };

        const onMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!isActive) {
                cursorEffect.classList.add('is-active');
                isActive = true;
            }
        };
        const onLeave = () => {
            cursorEffect.classList.remove('is-active');
            isActive = false;
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseout', onLeave);
        window.addEventListener('blur', onLeave);
        window.addEventListener('resize', () => {
            size = cursorEffect.offsetWidth || size;
        });

        update();
    }
    
    // === 2. MOBILE MENU LOGIC ===
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-links');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    const initServiceInterface = () => {
        const triggers = document.querySelectorAll('.kr8-service-item');
        const panels = document.querySelectorAll('.kr8-content-panel');
        const summaryP = document.querySelector('.kr8-summary-box p');

        if (summaryP) summaryP.classList.add('kr8-backlight-hover');

        const switchPanel = (trigger) => {
            triggers.forEach((t) => t.classList.remove('active'));
            panels.forEach((p) => p.classList.remove('active'));

            trigger.classList.add('active');
            const targetId = trigger.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        };

        triggers.forEach((trigger) => {
            trigger.addEventListener('click', () => switchPanel(trigger));
            trigger.addEventListener('mouseenter', () => switchPanel(trigger));
        });
    };

    const initBeforeAfter = () => {
        const sliders = document.querySelectorAll('.kr8-split-frame.kr8-interactive');
        sliders.forEach((slider) => {
            let isDown = false;
            const layerOne = slider.querySelector('.kr8-split-layer.one');
            const handle = slider.querySelector('.kr8-split-handle');

            const move = (e) => {
                if (!isDown) return;
                const rect = slider.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                let x = clientX - rect.left;
                x = Math.max(0, Math.min(x, rect.width));
                const percentage = (x / rect.width) * 100;
                layerOne.style.width = `${percentage}%`;
                handle.style.left = `${percentage}%`;
            };

            const start = (e) => {
                isDown = true;
                move(e);
            };

            const end = () => { isDown = false; };

            slider.addEventListener('mousedown', start);
            slider.addEventListener('touchstart', start);
            window.addEventListener('mouseup', end);
            window.addEventListener('touchend', end);
            window.addEventListener('mousemove', move);
            window.addEventListener('touchmove', move);

            layerOne.style.width = '50%';
            handle.style.left = '50%';
        });
    };

    const initHorizonScroller = () => {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        const wrapper = document.querySelector(".evolve-horizon-wrap");
        const track = document.querySelector(".eh-track");

        if (!wrapper || !track) return;

        const getScrollDistance = () => track.scrollWidth - wrapper.offsetWidth;

        const setup = () => {
            if (window.innerWidth < 769) return;
            ScrollTrigger.getById('eh-scroll')?.kill();
            gsap.set(track, { x: 0 });

            gsap.to(track, {
                id: 'eh-scroll',
                x: () => -getScrollDistance(),
                ease: "none",
                scrollTrigger: {
                    trigger: ".eh-pin-spacer",
                    pin: true,
                    scrub: 1,
                    start: "center center",
                    end: () => "+=" + (getScrollDistance() + 500),
                    invalidateOnRefresh: true
                }
            });
        };

        if (typeof ScrollTrigger.matchMedia === "function") {
            const mm = ScrollTrigger.matchMedia();
            mm.add("(min-width: 769px)", () => {
                const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
                if (isTouch && typeof ScrollTrigger.normalizeScroll === "function") {
                    if (!window.__ehScrollNormalized) {
                        ScrollTrigger.normalizeScroll(true);
                        window.__ehScrollNormalized = true;
                    }
                }
                setup();
                ScrollTrigger.addEventListener("refreshInit", setup);
                return () => {
                    ScrollTrigger.getById('eh-scroll')?.kill();
                    ScrollTrigger.removeEventListener("refreshInit", setup);
                };
            });
        } else if (window.innerWidth >= 769) {
            setup();
            ScrollTrigger.addEventListener("refreshInit", setup);
        }
    };

    const initCTAAnimations = () => {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.kr8-anim-item').forEach((el) => {
            if (isMobile && !isHeroElement(el)) return;
            gsap.fromTo(
                el,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        });

        if (isMobile) return;

        gsap.utils.toArray('.kr8-anim-grid').forEach((container) => {
            const children = container.children;

            gsap.fromTo(
                children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 90%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        });

        gsap.utils.toArray('.kr8-anim').forEach((el) => {
            gsap.fromTo(
                el,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        });

        gsap.utils.toArray('.kr8-ba-anim').forEach((el) => {
            gsap.fromTo(
                el,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        const menuItems = document.querySelectorAll('.kr8-menu-stagger .kr8-service-item');
        if (menuItems.length) {
            gsap.fromTo(
                menuItems,
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".kr8-menu-stagger",
                        start: "top 80%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        }
    };

    const initAnimations = () => {
        initCTAAnimations();
        initHorizonScroller();
    };

    initServiceInterface();
    initBeforeAfter();

    if (document.readyState === "complete") initAnimations();
    else window.addEventListener("load", initAnimations);

    // === 3. FAILSAFE ===
    window.addEventListener("load", () => {
        const deferredVideos = document.querySelectorAll('video[data-preload="defer"]');
        deferredVideos.forEach((video) => {
            video.preload = "auto";
            video.load();
        });
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('scroll'));
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        }, 1000);
    });
});
