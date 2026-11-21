document.addEventListener("DOMContentLoaded", () => {
    // 1. Generate Soft Floating Hearts in Background
    const floatingBg = document.getElementById("floatingBg");
    const heartSVG = `<svg width="24" height="24" viewBox="0 0 100 90" fill="#ff8fa3"><path d="M50 85 C50 85 5 55 5 27.5 C5 12 17 2 30 2 C40 2 47 8 50 15 C53 8 60 2 70 2 C83 2 95 12 95 27.5 C95 55 50 85 50 85 Z"/></svg>`;

    for (let i = 0; i < 16; i++) {
        const particle = document.createElement("div");
        particle.classList.add("bg-particle");
        particle.innerHTML = heartSVG;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${8 + Math.random() * 10}s`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.transform = `scale(${0.5 + Math.random() * 0.8})`;
        floatingBg.appendChild(particle);
    }

    // 2. Smooth Page Transition Helper
    function showPage(pageId) {
        const currentActive = document.querySelector(".page.active");
        const nextTarget = document.getElementById(pageId);

        if (!nextTarget) return;

        if (currentActive) {
            currentActive.classList.remove("visible");
            setTimeout(() => {
                currentActive.classList.remove("active");
                activateNext(nextTarget, pageId);
            }, 300);
        } else {
            activateNext(nextTarget, pageId);
        }
    }

    function activateNext(nextTarget, pageId) {
        nextTarget.classList.add("active");
        // Trigger reflow so CSS transition plays smoothly
        void nextTarget.offsetWidth;
        nextTarget.classList.add("visible");

        // Trigger special animations depending on page
        if (pageId === "page-flowers") {
            playBouquetAnimation();
        }
        if (pageId === "page-song") {
            triggerSpotifyAutoplay();
        }
    }

    // Initialize first page visibility
    const startPage = document.getElementById("page-start");
    if (startPage) {
        startPage.classList.add("visible");
    }

    // 3. Page 1 -> Page 2 (Click This Heart)
    const startHeartBtn = document.getElementById("startHeartBtn");
    startHeartBtn.addEventListener("click", () => {
        showPage("page-passcode");
    });

    // 4. Page 2: Heart Keypad Logic (Answer: 24)
    let enteredCode = "";
    const CORRECT_DATE = "24";
    const codeDisplay = document.getElementById("codeDisplay");
    const errorMsg = document.getElementById("errorMsg");
    const keypadBox = document.querySelector(".keypad-box");

    function updateDisplay() {
        codeDisplay.textContent = enteredCode.length > 0 ? enteredCode : "\u00A0";
    }

    document.querySelectorAll(".heart-key[data-num]").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (enteredCode.length < 4) {
                enteredCode += btn.getAttribute("data-num");
                errorMsg.textContent = "";
                updateDisplay();
            }
        });
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
        enteredCode = "";
        errorMsg.textContent = "";
        updateDisplay();
    });

    document.getElementById("backspaceBtn").addEventListener("click", () => {
        enteredCode = enteredCode.slice(0, -1);
        errorMsg.textContent = "";
        updateDisplay();
    });

    document.getElementById("submitCodeBtn").addEventListener("click", () => {
        if (enteredCode === CORRECT_DATE) {
            errorMsg.textContent = "";
            showPage("page-menu");
        } else {
            errorMsg.textContent = "di mo talaga ako love";
            keypadBox.classList.remove("shake");
            void keypadBox.offsetWidth;
            keypadBox.classList.add("shake");
            enteredCode = "";
            updateDisplay();
        }
    });

    // 5. Menu Buttons & Back Buttons Navigation
    document.querySelectorAll("[data-target]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            showPage(target);
        });
    });

    // 6. Bouquet Sequential Animation (Lily -> Sunflower -> Gerbera -> Ribbon + "I Love You")
    let flowerTimers = [];

    function playBouquetAnimation() {
        // Clear any running timers
        flowerTimers.forEach(clearTimeout);
        flowerTimers = [];

        const f1 = document.getElementById("flower1");
        const f2 = document.getElementById("flower2");
        const f3 = document.getElementById("flower3");
        const ribbon = document.getElementById("bouquetRibbon");
        const phrase = document.getElementById("bouquetPhrase");

        // Reset states first
        [f1, f2, f3].forEach((el) => el.classList.remove("bloom"));
        ribbon.classList.remove("show");
        phrase.classList.remove("show");

        // Step 1: Lily ("I")
        flowerTimers.push(setTimeout(() => {
            f1.classList.add("bloom");
        }, 300));

        // Step 2: Sunflower ("Love")
        flowerTimers.push(setTimeout(() => {
            f2.classList.add("bloom");
        }, 1000));

        // Step 3: Gerbera ("You")
        flowerTimers.push(setTimeout(() => {
            f3.classList.add("bloom");
        }, 1700));

        // Step 4: Tie them into a bouquet with ribbon & show full phrase
        flowerTimers.push(setTimeout(() => {
            ribbon.classList.add("show");
            phrase.classList.add("show");
        }, 2350));
    }

    document.getElementById("replayFlowersBtn").addEventListener("click", () => {
        playBouquetAnimation();
    });

    // 7. Song Page Play Button & Spotify Embed Trigger
    const playSongBtn = document.getElementById("playSongBtn");
    const spotifyEmbed = document.getElementById("spotifyEmbed");
    const baseSpotifyUrl = "https://open.spotify.com/embed/track/55eWkBMyr3bAHVVE1SLmDE?utm_source=generator&theme=0";

    function triggerSpotifyAutoplay() {
        // Reloads iframe with autoplay parameter when user clicks into the song page
        spotifyEmbed.src = `${baseSpotifyUrl}&autoplay=1`;
    }

    playSongBtn.addEventListener("click", () => {
        triggerSpotifyAutoplay();
        playSongBtn.innerHTML = `<span class="play-triangle">&#9835;</span> Playing Our Song...`;
    });
});