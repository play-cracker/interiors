
document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".counter");
    let observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCount(entry.target);
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        },
        { threshold: 0.5 } // Trigger when 50% in view
    );

    counters.forEach(counter => observer.observe(counter));

    function startCount(counter) {
        let target = +counter.getAttribute("data-target");
        let count = 0;
        let speed = Math.ceil(target / 100); // Adjust speed dynamically

        let updateCount = setInterval(() => {
            count += speed;
            if (count >= target) {
                counter.innerText = target;
                clearInterval(updateCount);
            } else {
                counter.innerText = count;
            }
        }, 20);
    }
});


if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init();
}


const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}





const images = Array.from({ length: 24 }, (_, i) => `./portfolio-images/portfolio-${i + 1}.jpg`);

let isRandomizingImages = false;

function randomizeImages() {
    if (isRandomizingImages) return;
    isRandomizingImages = true;

    const portfolioImages = document.querySelectorAll(".portfolio-grid img");
    const totalImages = portfolioImages.length;

    if (totalImages === 0) {
        isRandomizingImages = false;
        return;
    }

    function changeRandomImage() {
        let randomIndex;
        let img;

        // Keep selecting a random image until we find one that is NOT being hovered
        do {
            randomIndex = Math.floor(Math.random() * totalImages);
            img = portfolioImages[randomIndex];
        } while (img.matches(":hover")); // Skip images that are hovered

        img.classList.add("blink");
        setTimeout(() => {
            img.src = images[Math.floor(Math.random() * images.length)];
            img.classList.remove("blink");
        }, 1200);
    }

    let changes = 0;
    const interval = setInterval(() => {
        if (changes >= totalImages) {
            clearInterval(interval); // Stop after all images have changed once
            isRandomizingImages = false;
            return;
        }

        changeRandomImage();
        changes++;
    }, 1500); // Change one image every 1500ms
}

// Start changing images every 3 seconds
setInterval(randomizeImages, 3000);


/* ===== Reveal-on-scroll ===== */
(function () {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;
    const revObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    revealEls.forEach((el) => revObserver.observe(el));
})();


/* ===== Navbar shadow on scroll ===== */
(function () {
    const nav = document.querySelector("nav");
    if (!nav) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            nav.classList.add("shadow-xl");
        } else {
            nav.classList.remove("shadow-xl");
        }
    });
})();


/* ===== Price Calculator ===== */
(function () {
    const calc = document.getElementById("calculator");
    if (!calc) return;

    const propertyTypes = document.getElementById("propertyTypes");
    const packages = document.getElementById("packages");
    const addons = document.getElementById("addons");
    const areaRange = document.getElementById("areaRange");
    const areaValue = document.getElementById("areaValue");

    const totalPriceEl = document.getElementById("totalPrice");
    const priceRangeEl = document.getElementById("priceRange");
    const sumBaseEl = document.getElementById("sumBase");
    const sumMultEl = document.getElementById("sumMult");
    const sumAddonsEl = document.getElementById("sumAddons");

    const fmt = (n) =>
        "₹" + Math.round(n).toLocaleString("en-IN");

    // single-select helper for option groups
    function setupSingleSelect(container) {
        container.addEventListener("click", (e) => {
            const card = e.target.closest(".opt-card");
            if (!card) return;
            container.querySelectorAll(".opt-card").forEach((c) =>
                c.classList.remove("selected")
            );
            card.classList.add("selected");
            update();
        });
    }
    setupSingleSelect(propertyTypes);
    setupSingleSelect(packages);

    // multi-select add-ons
    addons.addEventListener("click", (e) => {
        const chip = e.target.closest(".addon-chip");
        if (!chip) return;
        chip.classList.toggle("selected");
        update();
    });

    // slider with dynamic fill
    function paintRange() {
        const min = +areaRange.min;
        const max = +areaRange.max;
        const pct = ((+areaRange.value - min) / (max - min)) * 100;
        areaRange.style.background =
            `linear-gradient(90deg, var(--primary) ${pct}%, #e2e8f0 ${pct}%)`;
        areaValue.textContent = (+areaRange.value).toLocaleString("en-IN");
    }
    areaRange.addEventListener("input", () => {
        paintRange();
        update();
    });

    // animated number count-up
    let animFrame;
    let displayed = 0;
    function animateTo(target) {
        cancelAnimationFrame(animFrame);
        const start = displayed;
        const duration = 500;
        const startTime = performance.now();
        function step(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            displayed = start + (target - start) * eased;
            totalPriceEl.textContent = fmt(displayed);
            if (t < 1) {
                animFrame = requestAnimationFrame(step);
            } else {
                displayed = target;
            }
        }
        totalPriceEl.classList.remove("price-pop");
        void totalPriceEl.offsetWidth; // reflow to restart animation
        totalPriceEl.classList.add("price-pop");
        animFrame = requestAnimationFrame(step);
    }

    function update() {
        const area = +areaRange.value;
        const rate = +packages.querySelector(".opt-card.selected").dataset.rate;
        const mult = +propertyTypes.querySelector(".opt-card.selected").dataset.mult;

        const base = area * rate;
        const baseWithMult = base * mult;

        let addonTotal = 0;
        addons.querySelectorAll(".addon-chip.selected").forEach((chip) => {
            addonTotal += +chip.dataset.cost;
        });

        const total = baseWithMult + addonTotal;

        sumBaseEl.textContent = fmt(base);
        sumMultEl.textContent = "×" + mult.toFixed(2);
        sumAddonsEl.textContent = fmt(addonTotal);
        priceRangeEl.textContent = `${fmt(total * 0.9)} – ${fmt(total * 1.1)}`;

        animateTo(total);
    }

    paintRange();
    update();
})();


/* ===== Auto-update copyright year ===== */
(function () {
    const yearEl = document.getElementById("copyrightYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ===== Contact form ===== */
(function () {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const success = document.getElementById("contactSuccess");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (success) success.classList.remove("hidden");
        form.reset();
        setTimeout(() => success && success.classList.add("hidden"), 5000);
    });
})();
