// =============================
// RESET POSISI SCROLL SAAT LOAD
// =============================

window.history.scrollRestoration = "manual";

window.addEventListener("load", function () {
  if (window.location.hash) {
    history.replaceState(
      null,
      null,
      window.location.pathname + window.location.search,
    );
  }

  window.scrollTo(0, 0);

  setTimeout(function () {
    window.scrollTo(0, 0);

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, 150);
});

// =============================
// PERSONALISASI NAMA TAMU
// Contoh link:
// index.html?to=Ustadz%20Ahmad
// =============================

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
const guestName = document.getElementById("guestName");

if (guestName) {
  guestName.style.whiteSpace = "pre-line";

  guestName.textContent =
    guest && guest.trim() !== "" ? guest : "Bapak/Ibu/Saudara/i";
}

// =============================
// COVER MODAL / TOMBOL BUKA UNDANGAN + AUDIO
// =============================

const coverModal = document.getElementById("coverModal");
const openInvitation = document.getElementById("openInvitation");

const invitationAudio = document.getElementById("invitationAudio");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

let isMusicPlaying = false;

const iconMusicNote = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note" viewBox="0 0 16 16">
    <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2"/>
    <path fill-rule="evenodd" d="M9 3v10H8V3z"/>
    <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5z"/>
  </svg>
`;

const iconPause = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
  </svg>
`;

function updateMusicButton() {
  if (!musicToggle || !musicIcon) return;

  if (isMusicPlaying) {
    musicToggle.classList.add("is-playing");
    musicToggle.classList.remove("is-muted");
    musicIcon.innerHTML = iconPause;
    musicToggle.setAttribute("aria-label", "Matikan musik");
  } else {
    musicToggle.classList.remove("is-playing");
    musicToggle.classList.add("is-muted");
    musicIcon.innerHTML = iconMusicNote;
    musicToggle.setAttribute("aria-label", "Nyalakan musik");
  }
}

updateMusicButton();

async function playInvitationMusic() {
  if (!invitationAudio) return;

  try {
    invitationAudio.volume = 0.45;
    await invitationAudio.play();
    isMusicPlaying = true;
  } catch (error) {
    isMusicPlaying = false;
    console.warn("Audio belum bisa diputar otomatis:", error);
  }

  updateMusicButton();
}

function pauseInvitationMusic() {
  if (!invitationAudio) return;

  invitationAudio.pause();
  isMusicPlaying = false;
  updateMusicButton();
}

if (coverModal && openInvitation) {
  openInvitation.addEventListener("click", function () {
    coverModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");

    if (musicToggle) {
      musicToggle.classList.remove("is-hidden");
    }

    if (musicToggle && typeof gsap !== "undefined") {
      gsap.fromTo(
        musicToggle,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.2,
        },
      );
    }

    playInvitationMusic();

    setTimeout(function () {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 300);
  });
}

if (musicToggle && invitationAudio) {
  musicToggle.addEventListener("click", function () {
    if (invitationAudio.paused) {
      playInvitationMusic();
    } else {
      pauseInvitationMusic();
    }
  });
}

// =============================
// FUNGSI KEAMANAN TEKS
// Masih disimpan kalau nanti dibutuhkan.
// Untuk tabel dan form di atas, kita sudah pakai textContent.
// =============================

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =============================
// ANIMASI SCROLL DENGAN GSAP
// =============================

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  // =============================
  // ANIMASI COVER MODAL
  // =============================

  document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".falling-celebration");

    if (!container) {
      console.warn("Elemen .falling-celebration tidak ditemukan");
      return;
    }

    function createConfetti() {
      const confetti = document.createElement("span");

      const colors = ["gold", "soft-gold", "ivory"];
      const directions = ["drift-left", "drift-right"];

      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      const driftClass =
        directions[Math.floor(Math.random() * directions.length)];

      confetti.className = `confetti ${colorClass} ${driftClass}`;

      const width = 7 + Math.random() * 7;
      const height = 12 + Math.random() * 12;
      const left = Math.random() * 100;
      const duration = 7 + Math.random() * 6;
      const delay = Math.random() * 1.5;

      confetti.style.left = left + "vw";
      confetti.style.width = width + "px";
      confetti.style.height = height + "px";
      confetti.style.animationDuration = duration + "s, " + duration + "s";
      confetti.style.animationDelay = delay + "s, " + delay + "s";

      container.appendChild(confetti);

      setTimeout(
        function () {
          confetti.remove();
        },
        (duration + delay) * 1000,
      );
    }

    function createStreamer() {
      const streamer = document.createElement("span");

      const driftClass = Math.random() > 0.5 ? "drift-left" : "drift-right";

      streamer.className = `streamer ${driftClass}`;

      const sizeRatio = 0.65 + Math.random() * 0.3;
      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 5;
      const delay = Math.random() * 2;

      streamer.style.left = left + "vw";
      streamer.style.width = 22 * sizeRatio + "px";
      streamer.style.height = 105 * sizeRatio + "px";
      streamer.style.animationDuration = duration + "s, " + duration + "s";
      streamer.style.animationDelay = delay + "s, " + delay + "s";

      container.appendChild(streamer);

      setTimeout(
        function () {
          streamer.remove();
        },
        (duration + delay) * 1000,
      );
    }

    createConfetti();
    createConfetti();

    const confettiTimer = setInterval(createConfetti, 520);
    const streamerTimer = setInterval(createStreamer, 2600);

    if (openInvitation) {
      openInvitation.addEventListener(
        "click",
        function () {
          clearInterval(confettiTimer);
          clearInterval(streamerTimer);
          container.textContent = "";
        },
        { once: true },
      );
    }
  });

  // =============================
  // ANIMASI COVER ORNAMENT
  // =============================

  gsap.from(".cover-curtain-top", {
    opacity: 0,
    y: -26,
    scaleY: 0.92,
    scaleX: 1.04,
    transformOrigin: "top center",
    duration: 1.25,
    delay: 0.05,
    ease: "power3.out",
  });

  gsap.to(".cover-curtain-top", {
    y: "+=4",
    scaleY: 1.015,
    rotation: 0.25,
    transformOrigin: "top center",
    duration: 3.8,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  gsap.from(".cover-ornament:not(.cover-curtain-top)", {
    opacity: 0,
    scale: 0.94,
    duration: 1.1,
    stagger: 0.12,
    delay: 0.1,
    ease: "power3.out",
  });

  gsap.from(".cover-inner", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(
    ".cover-image, .guest-label, #guestName, .intro-text, .cover-content h2, .school-name, .main-button",
    {
      opacity: 0,
      y: 12,
      duration: 0.72,
      stagger: 0.09,
      delay: 0.28,
      ease: "power3.out",
    },
  );

  gsap.to(".side-bottom", {
    x: 6,
    y: -10,
    rotation: 1.2,
    duration: 5.8,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    stagger: {
      each: 0.35,
      from: "center",
    },
  });

  // ======================================================
  // STORY FLOW TIMELINE
  // memory book -> zoom in -> swipe flipbook pages
  // -> album closing -> cinematic stage reveal
  // ======================================================

  const storyFlowSection = document.querySelector("#story-flow");
  const memoryBookScene = document.querySelector(".memory-book-scene");
  const flowStoryTrack = document.querySelector(".flow-story-track");
  const allFlowStoryPanels = gsap.utils.toArray(".flow-story-panel");
  const puncakPanel = document.querySelector("#puncak.peak-story-panel");

  /* Panel kegiatan saja, tidak termasuk panel puncak */
  const flowStoryPanels = allFlowStoryPanels.filter(function (panel) {
    return panel !== puncakPanel;
  });

  /* Elemen kontrol album, opsional tapi disarankan ada di HTML */
  const storyPrevButton = document.querySelector(".story-nav-prev");
  const storyNextButton = document.querySelector(".story-nav-next");
  const storyProgress = document.querySelector(".story-progress");

  /* Elemen Puncak Acara / Stage Reveal */
  const stageBridge = document.querySelector(".story-to-stage-bridge");
  const stageBridgeGlow = document.querySelector(".story-bridge-glow");
  const stageBg = document.querySelector(".stage-bg img");
  const stageOverlay = document.querySelector(".stage-overlay");
  const stageGlow = document.querySelector(".stage-glow");
  const stageContent = document.querySelector(".stage-content");
  const stageLights = gsap.utils.toArray(".stage-light-beam");

  if (
    storyFlowSection &&
    memoryBookScene &&
    flowStoryTrack &&
    flowStoryPanels.length > 0
  ) {
    const mobileMediaQuery = window.matchMedia("(max-width: 600px)");

    flowStoryTrack.classList.add("is-flipbook");

    const panelCount = flowStoryPanels.length;
    const lastPanel = flowStoryPanels[panelCount - 1];

    const lastJournalPage = lastPanel
      ? lastPanel.querySelector(".activity-journal-page")
      : null;

    const lastPhoto = lastPanel
      ? lastPanel.querySelector(".activity-photo-card")
      : null;

    const lastCopy = lastPanel
      ? lastPanel.querySelector(".activity-copy")
      : null;

    const lastHint = lastPanel
      ? lastPanel.querySelector(".activity-page-hint")
      : null;

    const lastHandLabel = lastPanel
      ? lastPanel.querySelector(".activity-hand-label")
      : null;

    let currentStoryIndex = 0;
    let isStoryAnimating = false;
    let storyInteractionEnabled = false;
    let stageRevealPrepared = false;

    const getStoryEndDistance = function () {
      /*
        Versi baru dibuat lebih pendek karena cerita 01-17
        tidak lagi digerakkan oleh scroll, melainkan swipe.
      */
      const distanceMultiplier = mobileMediaQuery.matches ? 3.6 : 6.2;
      return `+=${window.innerHeight * distanceMultiplier}`;
    };

    // =============================
    // INITIAL STATE - MEMORY BOOK
    // =============================

    gsap.set(".memory-book-scene", {
      autoAlpha: 1,
      filter: "blur(0px)",
    });

    gsap.set(".memory-book-shell", {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transformOrigin: "center center",
    });

    gsap.set(".memory-book-intro", {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transformOrigin: "center center",
    });

    gsap.set(".book-ambient-glow", {
      autoAlpha: 1,
      scale: 1,
    });

    gsap.set(".flow-transition-veil", {
      opacity: 0,
      backdropFilter: "blur(3px)",
    });

    // =============================
    // INITIAL STATE - FLIPBOOK
    // =============================

    gsap.set(flowStoryTrack, {
      opacity: 0,
      x: 0,
      xPercent: 0,
    });

    gsap.set(flowStoryPanels, {
      autoAlpha: 0,
      rotationY: 0,
      xPercent: 0,
      scale: 1,
      z: 0,
      filter: "brightness(1) blur(0px)",
      transformPerspective: mobileMediaQuery.matches ? 1300 : 1800,
      transformOrigin: "left center",
    });

    flowStoryPanels.forEach(function (panel, index) {
      gsap.set(panel, {
        zIndex: flowStoryPanels.length - index,
      });
    });

    gsap.set(flowStoryPanels[0], {
      autoAlpha: 1,
      zIndex: flowStoryPanels.length + 10,
    });

    gsap.set(".flow-story-bg img", {
      scale: 1.08,
      filter: "brightness(1.04) saturate(0.98) blur(0px)",
    });

    if (puncakPanel) {
      gsap.set(puncakPanel, {
        autoAlpha: 0,
        zIndex: flowStoryPanels.length + 100,
        rotationY: 0,
        xPercent: 0,
        scale: 1,
        filter: "brightness(1) blur(0px)",
        transformPerspective: 1800,
        transformOrigin: "center center",
      });
    }

    // =============================
    // INITIAL STATE - STAGE REVEAL
    // =============================

    if (stageBridge) {
      gsap.set(stageBridge, {
        autoAlpha: 1,
        opacity: 1,
      });
    }

    if (stageBridgeGlow) {
      gsap.set(stageBridgeGlow, {
        autoAlpha: 0,
        scale: 0.72,
      });
    }

    if (stageBg) {
      gsap.set(stageBg, {
        yPercent: mobileMediaQuery.matches ? 12 : 10,
        scale: mobileMediaQuery.matches ? 1.12 : 1.08,
        filter: "brightness(0.42) saturate(0.94) contrast(1.08)",
        transformOrigin: "center bottom",
      });
    }

    if (stageOverlay) {
      gsap.set(stageOverlay, {
        autoAlpha: 1,
      });
    }

    if (stageGlow) {
      gsap.set(stageGlow, {
        autoAlpha: 0,
        scale: 0.68,
      });
    }

    if (stageLights.length > 0) {
      gsap.set(stageLights, {
        autoAlpha: 0,
      });
    }

    if (stageContent) {
      gsap.set(stageContent, {
        autoAlpha: 1,
        filter: "blur(0px)",
      });
    }

    // =============================
    // ANIMASI MASUK PANEL
    // =============================

    function animatePanelIn(timeline, panel, position) {
      const bgImage = panel.querySelector(".flow-story-bg img");
      const activityPage = panel.querySelector(".activity-journal-page");

      const normalTextItems = panel.querySelectorAll(
        ".flow-story-text:not(.activity-journal-page) .section-number, .flow-story-text:not(.activity-journal-page) h2, .flow-story-text:not(.activity-journal-page) p",
      );

      const activityTextItems = panel.querySelectorAll(
        ".activity-copy h2, .activity-subtitle, .activity-description, .activity-page-hint",
      );

      const activityDecorItems = panel.querySelectorAll(
        ".activity-chapter, .activity-mini-note-paper, .activity-photo-card, .activity-hand-label",
      );

      if (bgImage) {
        timeline.fromTo(
          bgImage,
          {
            scale: 1.18,
            filter: "brightness(1.1) saturate(0.95) blur(2px)",
          },
          {
            scale: 1.08,
            filter: "brightness(1.04) saturate(0.98) blur(0px)",
            duration: mobileMediaQuery.matches ? 0.72 : 0.9,
            ease: "none",
          },
          position,
        );
      }

      if (activityPage) {
        if (activityDecorItems.length > 0) {
          timeline.set(
            activityDecorItems,
            {
              clearProps: "transform",
            },
            position,
          );

          timeline.fromTo(
            activityDecorItems,
            {
              autoAlpha: 0,
              filter: "blur(5px)",
            },
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              stagger: mobileMediaQuery.matches ? 0.045 : 0.055,
              duration: mobileMediaQuery.matches ? 0.55 : 0.7,
              ease: "none",
            },
            position,
          );
        }

        if (activityTextItems.length > 0) {
          timeline.fromTo(
            activityTextItems,
            {
              autoAlpha: 0,
              y: mobileMediaQuery.matches ? 12 : 18,
              filter: "blur(5px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: mobileMediaQuery.matches ? 0.045 : 0.055,
              duration: mobileMediaQuery.matches ? 0.55 : 0.7,
              ease: "none",
            },
            position,
          );
        }
      }

      if (normalTextItems.length > 0) {
        timeline.fromTo(
          normalTextItems,
          {
            autoAlpha: 0,
            y: 22,
            filter: "blur(5px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.75,
            ease: "none",
          },
          position,
        );
      }
    }

    // =============================
    // STORY UI / INTERACTION
    // =============================

    function updateStoryControls() {
      if (storyProgress) {
        storyProgress.textContent =
          String(currentStoryIndex + 1).padStart(2, "0") +
          " / " +
          String(panelCount).padStart(2, "0");
      }

      if (storyPrevButton) {
        const disabled = currentStoryIndex <= 0;
        storyPrevButton.disabled = disabled;
        storyPrevButton.classList.toggle("is-disabled", disabled);
      }

      if (storyNextButton) {
        const disabled = currentStoryIndex >= panelCount - 1;
        storyNextButton.disabled = disabled;
        storyNextButton.classList.toggle("is-disabled", disabled);
      }

      flowStoryPanels.forEach(function (panel, index) {
        const hint = panel.querySelector(".activity-page-hint");
        if (!hint) return;

        const currentNumber = String(index + 1).padStart(2, "0");
        const totalNumber = String(panelCount).padStart(2, "0");

        if (index === panelCount - 1) {
          hint.textContent =
            currentNumber +
            " / " +
            totalNumber +
            " · Scroll untuk menuju Puncak Acara";
        } else if (index === 0) {
          hint.textContent =
            currentNumber +
            " / " +
            totalNumber +
            " · Geser kiri untuk membuka cerita berikutnya";
        } else {
          hint.textContent =
            currentNumber +
            " / " +
            totalNumber +
            " · Geser kiri/kanan untuk lanjut atau kembali";
        }
      });
    }

    function enableStoryInteraction() {
      if (storyInteractionEnabled) return;

      storyInteractionEnabled = true;
      flowStoryTrack.classList.add("is-story-interactive");
      flowStoryTrack.classList.remove("is-stage-reveal");
      updateStoryControls();
    }

    function disableStoryInteraction() {
      if (!storyInteractionEnabled) return;

      storyInteractionEnabled = false;
      flowStoryTrack.classList.remove("is-story-interactive");
      flowStoryTrack.classList.remove("is-story-dragging");
      updateStoryControls();
    }

    function showStoryInstant(index) {
      if (index < 0 || index >= panelCount) return;

      currentStoryIndex = index;

      flowStoryPanels.forEach(function (panel, panelIndex) {
        panel.classList.remove("is-flipping");

        gsap.set(panel, {
          autoAlpha: panelIndex === index ? 1 : 0,
          rotationY: 0,
          xPercent: 0,
          scale: 1,
          z: 0,
          filter: "brightness(1) blur(0px)",
          transformOrigin: "left center",
          zIndex:
            panelIndex === index ? panelCount + 20 : panelCount - panelIndex,
        });
      });

      updateStoryControls();
    }

    function goToStory(nextIndex) {
      if (!storyInteractionEnabled) return;
      if (isStoryAnimating) return;
      if (nextIndex < 0 || nextIndex >= panelCount) return;
      if (nextIndex === currentStoryIndex) return;

      isStoryAnimating = true;

      const currentPanel = flowStoryPanels[currentStoryIndex];
      const nextPanel = flowStoryPanels[nextIndex];
      const isNext = nextIndex > currentStoryIndex;

      const flipRotation = isNext
        ? mobileMediaQuery.matches
          ? -94
          : -84
        : mobileMediaQuery.matches
          ? 86
          : 84;

      const flipX = isNext
        ? mobileMediaQuery.matches
          ? -1.4
          : -1.6
        : mobileMediaQuery.matches
          ? 1.4
          : 1.6;

      const flipZ = mobileMediaQuery.matches ? 38 : 42;
      const flipDuration = mobileMediaQuery.matches ? 0.46 : 0.42;
      const currentOrigin = isNext ? "left center" : "right center";

      const tl = gsap.timeline({
        onComplete: function () {
          currentPanel.classList.remove("is-flipping");

          gsap.set(currentPanel, {
            autoAlpha: 0,
            rotationY: 0,
            xPercent: 0,
            z: 0,
            scale: 1,
            filter: "brightness(1) blur(0px)",
            transformOrigin: "left center",
          });

          gsap.set(nextPanel, {
            autoAlpha: 1,
            rotationY: 0,
            xPercent: 0,
            z: 0,
            scale: 1,
            filter: "brightness(1) blur(0px)",
            transformOrigin: "left center",
            zIndex: panelCount + 20,
          });

          currentStoryIndex = nextIndex;
          isStoryAnimating = false;
          updateStoryControls();
        },
      });

      gsap.set(nextPanel, {
        autoAlpha: 1,
        rotationY: 0,
        xPercent: 0,
        scale: mobileMediaQuery.matches ? 1.01 : 1.015,
        z: 0,
        zIndex: panelCount + 19,
        filter: "brightness(0.92) blur(2px)",
        transformOrigin: "left center",
      });

      gsap.set(currentPanel, {
        zIndex: panelCount + 22,
        transformOrigin: currentOrigin,
      });

      tl.to(".flow-transition-veil", {
        opacity: mobileMediaQuery.matches ? 0.16 : 0.12,
        duration: mobileMediaQuery.matches ? 0.12 : 0.08,
        ease: "none",
      })
        .to(
          currentPanel,
          {
            rotationY: flipRotation,
            xPercent: flipX,
            z: flipZ,
            filter: "brightness(0.78) blur(1.3px)",
            duration: flipDuration,
            ease: "power2.inOut",
            onStart: function () {
              currentPanel.classList.add("is-flipping");
            },
          },
          "<",
        )
        .to(
          nextPanel,
          {
            scale: 1,
            filter: "brightness(1) blur(0px)",
            duration: flipDuration,
            ease: "power2.inOut",
          },
          "<",
        );

      animatePanelIn(tl, nextPanel, "<+=0.12");

      tl.to(
        ".flow-transition-veil",
        {
          opacity: 0,
          duration: mobileMediaQuery.matches ? 0.18 : 0.1,
          ease: "none",
        },
        ">-=0.08",
      );
    }

    function prepareStageRevealState() {
      if (stageRevealPrepared) return;

      stageRevealPrepared = true;
      disableStoryInteraction();
      flowStoryTrack.classList.add("is-stage-reveal");

      /*
        Saat user scroll menuju panggung, halaman album dikunci ke panel 17
        agar transisi penutup album selalu konsisten.
      */
      showStoryInstant(panelCount - 1);
    }

    function resetStageRevealState() {
      if (!stageRevealPrepared) return;

      stageRevealPrepared = false;
      flowStoryTrack.classList.remove("is-stage-reveal");
      enableStoryInteraction();
    }

    // =============================
    // SWIPE / DRAG / BUTTON / KEYBOARD EVENTS
    // Pointer Events dipakai agar jalan di HP, mouse desktop,
    // trackpad, dan DevTools mobile emulator.
    // =============================

    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let isPointerDown = false;
    let hasTriggeredSwipe = false;

    function handleStorySwipe(deltaX, deltaY, elapsed) {
      if (!storyInteractionEnabled) return;
      if (isStoryAnimating) return;

      const isHorizontalSwipe =
        Math.abs(deltaX) > 44 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2 &&
        elapsed < 1200;

      if (!isHorizontalSwipe) return;

      if (deltaX < 0) {
        goToStory(currentStoryIndex + 1);
      } else {
        goToStory(currentStoryIndex - 1);
      }
    }

    flowStoryTrack.addEventListener("pointerdown", function (event) {
      if (!storyInteractionEnabled) return;
      if (isStoryAnimating) return;

      isPointerDown = true;
      hasTriggeredSwipe = false;

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerStartTime = Date.now();

      flowStoryTrack.classList.add("is-story-dragging");

      if (flowStoryTrack.setPointerCapture) {
        flowStoryTrack.setPointerCapture(event.pointerId);
      }
    });

    flowStoryTrack.addEventListener("pointermove", function (event) {
      if (!storyInteractionEnabled) return;
      if (!isPointerDown) return;
      if (hasTriggeredSwipe) return;
      if (isStoryAnimating) return;

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;

      const isHorizontalSwipe =
        Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;

      if (!isHorizontalSwipe) return;

      hasTriggeredSwipe = true;
      isPointerDown = false;

      flowStoryTrack.classList.remove("is-story-dragging");

      if (deltaX < 0) {
        goToStory(currentStoryIndex + 1);
      } else {
        goToStory(currentStoryIndex - 1);
      }
    });

    flowStoryTrack.addEventListener("pointerup", function (event) {
      if (!storyInteractionEnabled) return;
      if (!isPointerDown) return;
      if (hasTriggeredSwipe) return;

      isPointerDown = false;

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      const elapsed = Date.now() - pointerStartTime;

      flowStoryTrack.classList.remove("is-story-dragging");

      handleStorySwipe(deltaX, deltaY, elapsed);

      if (flowStoryTrack.releasePointerCapture) {
        try {
          flowStoryTrack.releasePointerCapture(event.pointerId);
        } catch (error) {
          // Abaikan kalau pointer capture sudah dilepas browser.
        }
      }
    });

    flowStoryTrack.addEventListener("pointercancel", function () {
      isPointerDown = false;
      flowStoryTrack.classList.remove("is-story-dragging");
    });

    flowStoryTrack.addEventListener("pointerleave", function (event) {
      if (!isPointerDown) return;
      if (event.pointerType === "touch") return;

      isPointerDown = false;
      flowStoryTrack.classList.remove("is-story-dragging");
    });

    // Fallback khusus mobile.
    // Ini membuat swipe HP tetap jalan meskipun Pointer Events tidak menangkap gesture dengan stabil.
    flowStoryTrack.addEventListener(
      "touchstart",
      function (event) {
        if (!storyInteractionEnabled) return;

        const touch = event.touches[0];
        pointerStartX = touch.clientX;
        pointerStartY = touch.clientY;
        pointerStartTime = Date.now();

        flowStoryTrack.classList.add("is-story-dragging");
      },
      { passive: true },
    );

    flowStoryTrack.addEventListener(
      "touchend",
      function (event) {
        if (!storyInteractionEnabled) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - pointerStartX;
        const deltaY = touch.clientY - pointerStartY;
        const elapsed = Date.now() - pointerStartTime;

        flowStoryTrack.classList.remove("is-story-dragging");

        handleStorySwipe(deltaX, deltaY, elapsed);
      },
      { passive: true },
    );

    flowStoryTrack.addEventListener(
      "touchcancel",
      function () {
        flowStoryTrack.classList.remove("is-story-dragging");
      },
      { passive: true },
    );

    if (storyPrevButton) {
      storyPrevButton.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
      });

      storyPrevButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        goToStory(currentStoryIndex - 1);
      });
    }

    if (storyNextButton) {
      storyNextButton.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
      });

      storyNextButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        goToStory(currentStoryIndex + 1);
      });
    }

    window.addEventListener("keydown", function (event) {
      if (!storyInteractionEnabled) return;

      if (event.key === "ArrowLeft") {
        goToStory(currentStoryIndex - 1);
      }

      if (event.key === "ArrowRight") {
        goToStory(currentStoryIndex + 1);
      }
    });

    updateStoryControls();

    // =============================
    // MAIN STORY FLOW TIMELINE
    // =============================

    const storyFlowTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#story-flow",
        start: "top top",
        end: getStoryEndDistance,
        scrub: mobileMediaQuery.matches ? 0.38 : 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    storyFlowTimeline
      /* 01. Memory book hold. */
      .to(".memory-book-shell", {
        scale: 1,
        duration: 0.85,
        ease: "none",
      })

      .to(
        ".memory-book-intro",
        {
          scale: 1.025,
          duration: 0.72,
          ease: "none",
        },
        "<+=0.15",
      )

      /* 02. Zoom masuk ke cover buku. */
      .to(".memory-book-shell", {
        scale: mobileMediaQuery.matches ? 1.42 : 1.72,
        filter: "blur(1px)",
        duration: 1.12,
        ease: "none",
      })

      .to(
        ".memory-book-intro",
        {
          autoAlpha: 0,
          y: mobileMediaQuery.matches ? -16 : -24,
          scale: 1.06,
          filter: "blur(4px)",
          duration: 0.68,
          ease: "none",
        },
        "<",
      )

      .to(
        ".book-ambient-glow",
        {
          scale: 1.35,
          autoAlpha: 0.9,
          duration: 1,
          ease: "none",
        },
        "<",
      )

      /* 03. Veil masuk, buku hilang, album pages muncul. */
      .to(".flow-transition-veil", {
        opacity: 0.68,
        duration: 0.42,
        ease: "none",
      })

      .to(
        ".memory-book-scene",
        {
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 0.55,
          ease: "none",
        },
        "<",
      )

      .to(
        flowStoryTrack,
        {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        },
        "<",
      )

      .fromTo(
        flowStoryPanels[0],
        {
          autoAlpha: 0,
          scale: 1.025,
          filter: "brightness(1.08) blur(3px)",
        },
        {
          autoAlpha: 1,
          scale: 1,
          filter: "brightness(1) blur(0px)",
          duration: 0.72,
          ease: "none",
        },
        "<",
      );

    animatePanelIn(storyFlowTimeline, flowStoryPanels[0], "<+=0.05");

    storyFlowTimeline
      /*
    Swipe mulai aktif lebih cepat:
    begitu cerita 01 sudah terlihat, user tidak perlu menunggu veil selesai total.
  */
      .addLabel("album-open")

      .to(".flow-transition-veil", {
        opacity: 0,
        duration: 0.32,
        ease: "none",
      })

      /* Hold area: user berhenti sejenak untuk swipe cerita 01-17. */
      .to(flowStoryPanels[0], {
        duration: mobileMediaQuery.matches ? 2.8 : 5.6,
        ease: "none",
      })

      .addLabel("album-closing-to-stage");

    /* 04. Album closing menuju panggung. */
    storyFlowTimeline.set(".flow-transition-veil", {
      background:
        "radial-gradient(circle at 50% 54%, rgba(216, 180, 95, 0.28) 0%, rgba(42, 28, 12, 0.68) 42%, rgba(7, 6, 4, 0.96) 100%)",
      backdropFilter: "blur(5px)",
    });

    storyFlowTimeline.to(".flow-transition-veil", {
      opacity: 0.92,
      duration: 0.45,
      ease: "none",
    });

    storyFlowTimeline.call(prepareStageRevealState, null, ">-=0.18");

    if (lastJournalPage) {
      storyFlowTimeline.to(lastJournalPage, {
        scale: mobileMediaQuery.matches ? 0.925 : 0.91,
        y: mobileMediaQuery.matches ? -6 : -12,
        filter: "blur(1.5px)",
        duration: 0.45,
        ease: "power1.inOut",
      });
    }

    if (lastPhoto) {
      storyFlowTimeline.to(
        lastPhoto,
        {
          autoAlpha: 0,
          y: mobileMediaQuery.matches ? 14 : 24,
          filter: "blur(8px)",
          duration: 0.5,
          ease: "power1.inOut",
        },
        "<+=0.12",
      );
    }

    if (lastCopy) {
      storyFlowTimeline.to(
        lastCopy,
        {
          autoAlpha: 0,
          y: mobileMediaQuery.matches ? -14 : -24,
          filter: "blur(8px)",
          duration: 0.5,
          ease: "power1.inOut",
        },
        "<",
      );
    }

    if (lastHint) {
      storyFlowTimeline.to(
        lastHint,
        {
          autoAlpha: 0,
          duration: 0.22,
          ease: "none",
        },
        "<",
      );
    }

    if (lastHandLabel) {
      storyFlowTimeline.to(
        lastHandLabel,
        {
          autoAlpha: 0,
          y: -12,
          filter: "blur(7px)",
          duration: 0.45,
          ease: "power1.inOut",
        },
        "<",
      );
    }

    storyFlowTimeline.to(
      lastPanel,
      {
        autoAlpha: 0.18,
        filter: "brightness(0.42) blur(10px)",
        duration: 0.5,
        ease: "none",
      },
      "<+=0.18",
    );

    /* Tampilkan panel puncak di balik veil, masih di dalam Story Flow. */
    if (puncakPanel) {
      storyFlowTimeline.to(
        puncakPanel,
        {
          autoAlpha: 1,
          duration: 0.2,
          ease: "none",
        },
        "<+=0.12",
      );
    }

    /* Panggung muncul dari dalam: gelap/blur/dekat -> jelas. */
    if (stageBg) {
      storyFlowTimeline.to(
        stageBg,
        {
          scale: mobileMediaQuery.matches ? 1.06 : 1.02,
          filter: "brightness(0.62) saturate(0.98) contrast(1.05) blur(0px)",
          duration: 0.9,
          ease: "power1.out",
        },
        "<",
      );
    }

    if (stageGlow) {
      storyFlowTimeline.to(
        stageGlow,
        {
          autoAlpha: 0.86,
          scale: 1,
          duration: 0.8,
          ease: "power1.out",
        },
        "<+=0.1",
      );
    }

    if (stageLights.length > 0) {
      storyFlowTimeline.to(
        stageLights,
        {
          autoAlpha: mobileMediaQuery.matches ? 0.16 : 0.3,
          duration: 0.7,
          stagger: 0.04,
          ease: "none",
        },
        "<+=0.1",
      );
    }

    if (stageBridge) {
      storyFlowTimeline.to(
        stageBridge,
        {
          autoAlpha: 0,
          duration: 0.55,
          ease: "none",
        },
        "<+=0.2",
      );
    }

    storyFlowTimeline.to(
      ".flow-transition-veil",
      {
        opacity: 0,
        duration: 0.5,
        ease: "none",
      },
      "<+=0.1",
    );

    storyFlowTimeline.to(puncakPanel || {}, {
      duration: mobileMediaQuery.matches ? 0.25 : 0.65,
      ease: "none",
    });

    storyFlowTimeline.to(
      {},
      {
        duration: mobileMediaQuery.matches ? 0.72 : 0.95,
        ease: "none",
      },
    );

    storyFlowTimeline.eventCallback("onUpdate", function () {
      const albumOpenTime = storyFlowTimeline.labels["album-open"] || 0;
      const stageStartTime =
        storyFlowTimeline.labels["album-closing-to-stage"] || 0;
      const currentTime = storyFlowTimeline.time();

      if (currentTime >= stageStartTime - 0.05) {
        prepareStageRevealState();
        return;
      }

      if (currentTime >= albumOpenTime && currentTime < stageStartTime - 0.05) {
        if (stageRevealPrepared) {
          resetStageRevealState();
        } else {
          enableStoryInteraction();
        }
        return;
      }

      disableStoryInteraction();
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  }

  // =============================
  // ANIMASI SECTION DETAIL UNDANGAN
  // =============================

  if (document.querySelector("#detail")) {
    gsap.set(".detail-card", {
      transformPerspective: 1000,
      transformOrigin: "center bottom",
    });

    const detailTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#detail",
        start: "top 62%",
        end: "bottom top",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    detailTimeline
      .fromTo(
        "#detail .section-heading",
        {
          y: 34,
          autoAlpha: 0,
          filter: "blur(7px)",
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power2.out",
        },
      )

      .fromTo(
        ".detail-card",
        {
          y: 42,
          scale: 0.96,
          rotateX: 5,
          autoAlpha: 0,
          filter: "blur(6px)",
        },
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.35",
      )

      .fromTo(
        ".detail-card > div",
        {
          y: 26,
          autoAlpha: 0,
          scale: 0.96,
          filter: "blur(4px)",
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.42",
      )

      .fromTo(
        "#detail .button-group",
        {
          y: 22,
          autoAlpha: 0,
          scale: 0.96,
          filter: "blur(4px)",
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.2",
      );
  }

  // =============================
  // ANIMASI SECTION SUSUNAN ACARA
  // =============================

  if (document.querySelector("#agenda")) {
    if (document.querySelector(".timeline-line")) {
      gsap.fromTo(
        ".timeline-line",
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%",
            end: "bottom 70%",
            scrub: 1,
          },
        },
      );
    }

    gsap.utils.toArray(".timeline-item").forEach(function (item, index) {
      gsap.fromTo(
        item,
        {
          x: index % 2 === 0 ? -48 : 48,
          y: 24,
          autoAlpha: 0,
          scale: 0.96,
          filter: "blur(6px)",
        },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            end: "top 68%",
            scrub: 1,
          },
        },
      );
    });

    gsap.utils.toArray(".timeline-item").forEach(function (item) {
      ScrollTrigger.create({
        trigger: item,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: function () {
          item.classList.add("is-active");
        },
        onEnterBack: function () {
          item.classList.add("is-active");
        },
        onLeave: function () {
          item.classList.remove("is-active");
        },
        onLeaveBack: function () {
          item.classList.remove("is-active");
        },
      });
    });
  }

  // =============================
  // ANIMASI SECTION DOA
  // =============================

  function initDoaSectionAnimation() {
    if (!document.querySelector("#doa")) return;

    const doaSection = document.querySelector("#doa");
    const headingItems = doaSection.querySelectorAll(
      ".section-number, .section-heading h2, .section-heading p",
    );
    const doaForm = doaSection.querySelector(".doa-form");
    const formItems = doaSection.querySelectorAll(
      ".doa-form input, .doa-form textarea, .doa-form button",
    );

    gsap.fromTo(
      headingItems,
      {
        y: 34,
        autoAlpha: 0,
        filter: "blur(8px)",
      },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: doaSection,
          start: "top 88%",
          end: "top 52%",
          scrub: 1,
        },
      },
    );

    if (doaForm) {
      gsap.fromTo(
        doaForm,
        {
          y: 70,
          scale: 0.96,
          autoAlpha: 0,
          filter: "blur(8px)",
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: doaForm,
            start: "top 92%",
            end: "top 58%",
            scrub: 1,
          },
        },
      );
    }

    if (formItems.length > 0 && doaForm) {
      gsap.fromTo(
        formItems,
        {
          y: 18,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: doaForm,
            start: "top 82%",
            end: "top 52%",
            scrub: 1,
          },
        },
      );
    }
  }

  function animateDoaCountText() {
    if (!doaCountText) return;
    if (doaCountText.hidden) return;
    if (typeof gsap === "undefined") return;

    gsap.killTweensOf(doaCountText);

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        doaCountText,
        {
          y: 18,
          autoAlpha: 0,
          filter: "blur(5px)",
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: doaCountText,
            start: "top 90%",
            toggleActions: "play none none reset",
          },
        },
      );

      ScrollTrigger.refresh();
      return;
    }

    gsap.fromTo(
      doaCountText,
      {
        y: 16,
        autoAlpha: 0,
        filter: "blur(4px)",
      },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
      },
    );
  }

  initDoaSectionAnimation();

  // =============================
  // ANIMASI CLOSING SECTION
  // =============================

  function initClosingSectionAnimation() {
    if (!document.querySelector("#closing")) return;

    const closingSection = document.querySelector("#closing");
    const closingLogo = closingSection.querySelector(
      ".closing-logo, .closing-content img",
    );
    const closingItems = closingSection.querySelectorAll(
      ".section-number, h2, .closing-content > p, .closing-dua, .closing-signature",
    );

    if (closingLogo) {
      gsap.set(closingLogo, {
        y: 24,
        scale: 0.9,
        autoAlpha: 0,
        filter: "blur(8px)",
      });
    }

    if (closingItems.length > 0) {
      gsap.set(closingItems, {
        y: 28,
        autoAlpha: 0,
        filter: "blur(8px)",
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: closingSection,
        start: "top 76%",
        end: "top 38%",
        scrub: 1,
      },
    });

    if (closingLogo) {
      tl.to(closingLogo, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        ease: "none",
      });
    }

    if (closingItems.length > 0) {
      tl.to(
        closingItems,
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          stagger: 0.12,
          ease: "none",
        },
        "-=0.35",
      );
    }
  }

  initClosingSectionAnimation();

  // =============================
  // ANIMASI HEADING SECTION BAWAH
  // =============================

  gsap.utils.toArray(".section-heading").forEach(function (heading) {
    if (heading.closest("#detail")) return;
    if (heading.closest("#doa")) return;
    if (heading.closest("#closing")) return;

    gsap.from(heading, {
      scrollTrigger: {
        trigger: heading,
        start: "top 80%",
      },
      opacity: 0,
      y: 36,
      duration: 0.9,
      ease: "power3.out",
    });
  });

  // =============================
  // ANIMASI PESAN DOA CONTOH
  // =============================

  if (document.querySelector(".message-card")) {
    gsap.from(".message-card", {
      scrollTrigger: {
        trigger: ".message-list",
        start: "top 85%",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  // =============================
  // REFRESH SCROLLTRIGGER
  // =============================

  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  let refreshTimer;
  let lastWindowWidth = window.innerWidth;

  window.addEventListener("resize", function () {
    const currentWidth = window.innerWidth;

    if (Math.abs(currentWidth - lastWindowWidth) < 20) return;

    lastWindowWidth = currentWidth;

    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      ScrollTrigger.refresh();
    }, 200);
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 300);
  });
}
