const gallerySection = document.querySelector(".gallery");

if (gallerySection) {
    if (typeof PROJECTS_DATA !== "undefined" && PROJECTS_DATA.length) {
        renderProjectGallery(PROJECTS_DATA, gallerySection);
        initializeProjectCards();
    } else {
        console.error("PROJECTS_DATA not found. Make sure json.js is loaded before app.js.");
    }
}

function renderProjectGallery(projects, container) {
    container.innerHTML = projects.map(project => {
        const booksHtml = project.books.map((src, index) => `
            <div class="book b${index + 1}">
                <img src="${src}" alt="${project.title} image ${index + 1}" />
            </div>
        `).join("");

        return `
            <div class="folder-wrapper">
                <div class="books">${booksHtml}</div>
                <div class="folder folder-2">
                    <div class="folder-top"></div>
                    <div class="folder-content">
                        <div class="blur"></div>
                        <h2 class="title top-title">${project.title}</h2>
                        <h2 class="title bottom-title">${project.subtitle}</h2>
                        <div class="lines">
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function initializeProjectCards() {
    const projectCards = Array.from(document.querySelectorAll(".gallery .folder-wrapper"));
    if (projectCards.length === 0) return;

    let activeProjectCard = null;
    const PROJECTS_HOVER_LIFT = -82;
    const PROJECTS_ACTIVE_LIFT = PROJECTS_HOVER_LIFT * 0.5;
    const PROJECTS_EASE_OUT = "power3.out";
    const PROJECTS_EASE_ELASTIC = "elastic.out(1, 0.6)";

    gsap.from(projectCards, {
        opacity: 0,
        x: 80,
        rotate: 8,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
    });

    gsap.to(".gallery .book", {
        y: -4,
        stagger: 0.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
    });

    projectCards.forEach((card, index) => {
        const folder = card.querySelector(".folder");
        const books = card.querySelector(".books");
        const folderContent = card.querySelector(".folder-content");
        const titles = card.querySelectorAll(".title");

        folder.addEventListener("mouseenter", () => {
            gsap.to(books, {
                y: PROJECTS_HOVER_LIFT,
                scale: 1.08,
                rotation: -3,
                duration: 0.25,
                ease: PROJECTS_EASE_OUT,
            });

            gsap.to(folderContent, {
                scaleY: 1.03,
                duration: 0.2,
                ease: PROJECTS_EASE_OUT,
                transformOrigin: "bottom center",
            });

            gsap.to(titles, {
                y: -6,
                stagger: 0.05,
                duration: 0.25,
                ease: "back.out(2)",
            });
        });

        folder.addEventListener("mouseleave", () => {
            const isActive = index === activeProjectCard;

            gsap.to(books, {
                y: isActive ? PROJECTS_ACTIVE_LIFT : 0,
                scale: isActive ? 1.05 : 1,
                rotation: 0,
                duration: 0.3,
                ease: PROJECTS_EASE_ELASTIC,
            });

            gsap.to(folderContent, {
                scaleY: 1,
                duration: 0.25,
                ease: PROJECTS_EASE_OUT,
                transformOrigin: "bottom center",
            });

            gsap.to(titles, {
                y: 0,
                duration: 0.25,
                ease: PROJECTS_EASE_OUT,
            });
        });

        folder.addEventListener("click", () => {
            window.location.href = 'project_1.html?project=' + index;
        });
    });
}

const HOVER_LIFT = -30;
const HOVER_SCALE = 1.08;
const HOVER_ROT = -3;
const REST_Y = 0;
const REST_SCALE = 1;
const REST_ROT = 0;
const CLICK_SCALE = 0.96;

const EASE_OUT = "power3.out";
const EASE_IN = "power2.in";
const EASE_ELASTIC = "elastic.out(1, 0.6)";

let activeIndex = 0;
const urlParams = new URLSearchParams(window.location.search);
const projectParam = urlParams.get('project');
if (projectParam !== null) {
    activeIndex = parseInt(projectParam);
}
const folders = Array.from(document.querySelectorAll('.folder-item'));
const contentPanel = document.getElementById('contentPanel');
const slides = Array.from(document.querySelectorAll('.project-slide'));
const hasProjectFolders = folders.length > 0 && contentPanel && slides.length > 0;

function introAnimation() {
    if (!hasProjectFolders) return;

    gsap.from(folders, {
        x: -60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: EASE_OUT,
        delay: 0.1,
    });

    gsap.from(slides, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: EASE_OUT,
        delay: 0.25,
    });

    const activePreview = folders[activeIndex].querySelector('.folder-preview');
    gsap.to(activePreview, {
        y: HOVER_LIFT * 0.5,
        scale: 1.05,
        duration: 0.8,
        ease: EASE_ELASTIC,
        delay: 0.7,
    });
}

function bindHover(folder) {
    const preview = folder.querySelector('.folder-preview');
    const index = parseInt(folder.dataset.index);

    folder.addEventListener('mouseenter', () => {
        gsap.to(preview, {
            y: HOVER_LIFT,
            scale: HOVER_SCALE,
            rotation: HOVER_ROT,
            duration: 0.38,
            ease: EASE_OUT,
        });
        gsap.to(folder.querySelector('.folder-body'), {
            scaleY: 1.03,
            duration: 0.3,
            ease: EASE_OUT,
            transformOrigin: 'bottom center',
        });
    });

    folder.addEventListener('mouseleave', () => {
        const targetY = (index === activeIndex) ? HOVER_LIFT * 0.5 : REST_Y;
        gsap.to(preview, {
            y: targetY,
            scale: (index === activeIndex) ? 1.05 : REST_SCALE,
            rotation: REST_ROT,
            duration: 0.5,
            ease: EASE_ELASTIC,
        });
        gsap.to(folder.querySelector('.folder-body'), {
            scaleY: 1,
            duration: 0.4,
            ease: EASE_OUT,
            transformOrigin: 'bottom center',
        });
    });
}

function bindClick(folder) {
    const preview = folder.querySelector('.folder-preview');
    const index = parseInt(folder.dataset.index);

    folder.addEventListener('click', () => {
        if (index === activeIndex) return;

        const prevFolder = folders[activeIndex];
        const prevPreview = prevFolder.querySelector('.folder-preview');
        prevFolder.classList.remove('is-active');
        gsap.to(prevPreview, {
            y: REST_Y,
            scale: REST_SCALE,
            rotation: REST_ROT,
            duration: 0.45,
            ease: EASE_OUT,
        });

        activeIndex = index;
        folder.classList.add('is-active');

        gsap.timeline()
            .to(preview, {
                scale: CLICK_SCALE,
                duration: 0.1,
                ease: EASE_IN,
            })
            .to(preview, {
                y: HOVER_LIFT * 0.5,
                scale: 1.08,
                rotation: 0,
                duration: 0.55,
                ease: EASE_ELASTIC,
            });

        gsap.fromTo(folder.querySelector('.folder-body'), {
            boxShadow: '0 4px 16px rgba(0,80,40,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
        }, {
            boxShadow: '0 8px 28px rgba(0,100,50,0.32), inset 0 1px 0 rgba(255,255,255,0.5)',
            duration: 0.3,
            yoyo: true,
            repeat: 1,
        });

        scrollToSlide(index);
    });
}

function scrollToSlide(index) {
    const slide = slides[index];
    if (!slide) return;

    slides.forEach(s => s.classList.remove('highlighted'));

    const panelScrollTop = contentPanel.scrollTop;
    const slideTop = slide.offsetTop;

    gsap.to(contentPanel, {
        scrollTop: slideTop - 20,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
            slide.classList.add('highlighted');
            gsap.fromTo(slide, {
                outline: '3px solid rgba(120,200,150,0)',
                outlineOffset: '0px',
            }, {
                outline: '3px solid rgba(120,200,150,0.7)',
                outlineOffset: '-3px',
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                onComplete: () => slide.classList.remove('highlighted'),
            });
        }
    });
}

function bindPanelScroll() {
    if (!hasProjectFolders) return;

    let ticking = false;
    contentPanel.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollMid = contentPanel.scrollTop + contentPanel.clientHeight / 2;
                let closest = 0;
                let minDist = Infinity;
                slides.forEach((slide, i) => {
                    const slideMid = slide.offsetTop + slide.offsetHeight / 2;
                    const dist = Math.abs(scrollMid - slideMid);
                    if (dist < minDist) { minDist = dist; closest = i; }
                });
                if (closest !== activeIndex) syncActiveFolder(closest);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function syncActiveFolder(index) {
    if (!hasProjectFolders || !folders[activeIndex] || !folders[index]) return;

    const prevPreview = folders[activeIndex].querySelector('.folder-preview');
    folders[activeIndex].classList.remove('is-active');
    gsap.to(prevPreview, {
        y: REST_Y, scale: REST_SCALE, rotation: REST_ROT,
        duration: 0.4, ease: EASE_OUT,
    });

    activeIndex = index;
    folders[index].classList.add('is-active');
    const newPreview = folders[index].querySelector('.folder-preview');
    gsap.to(newPreview, {
        y: HOVER_LIFT * 0.5, scale: 1.05, rotation: 0,
        duration: 0.5, ease: EASE_ELASTIC,
    });

    const folderEl = folders[index];
    folderEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

if (hasProjectFolders) {
    folders.forEach(folder => {
        bindHover(folder);
        bindClick(folder);
    });

    bindPanelScroll();
    introAnimation();
    folders[activeIndex].classList.add('is-active');
    scrollToSlide(activeIndex);
}

if (document.getElementById('infoPanel')) {

const folders = Array.from(document.querySelectorAll('.folder-item'));
const panel = document.getElementById('infoPanel');
const sections = {};
document.querySelectorAll('.info-section').forEach(s => {
    sections[s.id.replace('sec-', '')] = s;
});

let activeTarget = 'education';
let panelOpen = true;
let animating = false;

function openPanel(target, clickedFolder) {
    Object.values(sections).forEach(s => s.classList.remove('active'));
    sections[target].classList.add('active');
    activeTarget = target;

    gsap.to(clickedFolder.querySelector('.folder-visual'), {
        y: 10,
        duration: 0.35,
        ease: 'back.out(2)',
    });

    gsap.to(panel, {
        height: 'auto',
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out',
        onComplete: () => {
            animateBars(target);
            animating = false;
        }
    });
}

function switchSection(target, clickedFolder) {
    gsap.to(panel.querySelector('.info-panel-inner'), {
        opacity: 0,
        y: -8,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
            Object.values(sections).forEach(s => s.classList.remove('active'));
            sections[target].classList.add('active');
            activeTarget = target;

            gsap.fromTo(panel.querySelector('.info-panel-inner'),
                { opacity: 0, y: 8 },
                {
                    opacity: 1, y: 0,
                    duration: 0.28,
                    ease: 'power2.out',
                    onComplete: () => {
                        animateBars(target);
                        animating = false;
                    }
                }
            );
        }
    });
}

function closePanel(cb) {
    gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: cb,
    });
}

function animateBars(target) {
    const bars = sections[target].querySelectorAll('.ability-bar, .lang-bar');
    bars.forEach(bar => {
        bar.style.width = '0%';
        gsap.to(bar, {
            width: bar.dataset.pct + '%',
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1,
        });
    });
}

function resetFolders(exceptIndex) {
    folders.forEach((f, i) => {
        f.classList.remove('is-active');
        if (i !== exceptIndex) {
            gsap.to(f.querySelector('.folder-visual'), {
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    });
}

folders.forEach((folder, idx) => {
    folder.addEventListener('click', () => {
        if (animating) return;
        const target = folder.dataset.target;

        if (folder.classList.contains('is-active') && panelOpen) {
            animating = true;
            folder.classList.remove('is-active');
            gsap.to(folder.querySelector('.folder-visual'), {
                y: 0, duration: 0.3, ease: 'power2.out',
            });
            closePanel(() => {
                panelOpen = false;
                animating = false;
            });
            return;
        }

        animating = true;
        resetFolders(idx);
        folder.classList.add('is-active');

        if (!panelOpen) {
            panelOpen = true;
            openPanel(target, folder);
        } else {
            gsap.to(folder.querySelector('.folder-visual'), {
                y: 10, duration: 0.35, ease: 'back.out(2)',
            });
            switchSection(target, folder);
        }
    });
});

(function init() {
    gsap.from(folders, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        delay: 0.1,
    });

    gsap.set(panel, { height: 0, opacity: 0 });
    gsap.to(panel, {
        height: 'auto',
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        delay: 0.55,
        onComplete: () => {
            animateBars('education');
            gsap.to(folders[0].querySelector('.folder-visual'), {
                y: 10, duration: 0.4, ease: 'back.out(2)', delay: 0.05,
            });
        }
    });
})();

}

function initializeMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!toggle || !navMenu) return;

    const setOpenState = (open) => {
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
        setOpenState(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            setOpenState(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setOpenState(false);
        }
    });
}

initializeMobileMenu();
