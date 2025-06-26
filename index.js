
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


AOS.init();


const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});





const images = Array.from({ length: 24 }, (_, i) => `./portfolio-images/portfolio-${i + 1}.jpg`);

function randomizeImages() {
    const portfolioImages = document.querySelectorAll(".portfolio-grid img");
    const totalImages = portfolioImages.length;

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
            return;
        }

        changeRandomImage();
        changes++;
    }, 1500); // Change one image every 1500ms
}

// Start changing images every 3 seconds
setInterval(randomizeImages, 3000);
