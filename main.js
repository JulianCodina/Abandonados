document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const contactForm = document.getElementById("contactForm");
  const modal = document.getElementById("videoModal");
  const modalClose = modal ? modal.querySelector(".close") : null;
  const backToTop = document.getElementById("backToTop");
  const audioPlayer = document.getElementById("bgAudio");
  const musicToggle = document.getElementById("musicToggle");
  const floatingButtons = document.getElementById("floatingButtons");

  // ==========================================
  // VARIABLES GLOBALES
  // ==========================================
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  let lastScroll = 0;
  let audioStarted = false;

  // ==========================================
  // FUNCIONES AUXILIARES
  // ==========================================
  function getNavOffset() {
    if (!navbar) return 0;
    if (window.innerWidth <= 768) return 56;
    return navbar.offsetHeight;
  }

  function setBodyPadding() {
    if (window.innerWidth <= 768) {
      document.body.style.paddingTop = `${getNavOffset()}px`;
    } else {
      document.body.style.paddingTop = "";
    }
  }

  function isModalOpen() {
    if (!modal) return false;
    const style = window.getComputedStyle(modal);
    return style && style.display !== "none";
  }

  // ==========================================
  // GESTIÓN DE AUDIO
  // ==========================================
  function initAudio() {
    if (!audioPlayer || !musicToggle) return;

    const startAudio = () => {
      if (!audioStarted) {
        audioPlayer.volume = 0.2;
        audioPlayer
          .play()
          .then(() => {
            audioStarted = true;
            musicToggle.querySelector(".volume-on").style.display = "block";
            musicToggle.querySelector(".volume-off").style.display = "none";
            musicToggle.setAttribute("aria-pressed", "true");
            musicToggle.title = "Pausar música";
          })
          .catch((error) => {
            console.log("Audio bloqueado por el navegador:", error);
          });
      }
    };

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const startOnInteraction = () => {
        if (!audioStarted) {
          startAudio();
          window.removeEventListener("touchstart", startOnInteraction);
          window.removeEventListener("click", startOnInteraction);
          window.removeEventListener("scroll", startOnScroll, {
            passive: true,
          });
        }
      };

      const startOnScroll = () => {
        if (!audioStarted && window.scrollY > 50) {
          startAudio();
          window.removeEventListener("scroll", startOnScroll, {
            passive: true,
          });
        }
      };

      window.addEventListener("touchstart", startOnInteraction, { once: true });
      window.addEventListener("click", startOnInteraction, { once: true });

      window.addEventListener("scroll", startOnScroll, { passive: true });

      setTimeout(() => {
        if (!audioStarted) {
          startAudio();
        }
      }, 3000);
    }

    musicToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!audioStarted) {
        startAudio();
        return;
      }

      if (audioPlayer.paused) {
        audioPlayer
          .play()
          .then(() => {
            musicToggle.querySelector(".volume-on").style.display = "block";
            musicToggle.querySelector(".volume-off").style.display = "none";
            musicToggle.setAttribute("aria-pressed", "true");
            musicToggle.title = "Pausar música";
          })
          .catch((error) => {
            console.error("Error al reproducir:", error);
          });
      } else {
        audioPlayer.pause();
        musicToggle.querySelector(".volume-on").style.display = "none";
        musicToggle.querySelector(".volume-off").style.display = "block";
        musicToggle.setAttribute("aria-pressed", "false");
        musicToggle.title = "Reproducir música";
      }
    });

    const enableAudio = (e) => {
      if (e.target !== musicToggle) {
        startAudio();
      }
    };

    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });
    document.addEventListener("touchstart", enableAudio, {
      once: true,
      passive: true,
    });
  }

  // ==========================================
  // GESTIÓN DE SCROLL
  // ==========================================
  function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Mostrar/ocultar header
    if (currentScroll <= 10) {
      header.classList.remove("hide-header");
    } else {
      header.classList.add("hide-header");
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;

    highlightNavLink();
    animateOnScroll();
  }

  function highlightNavLink() {
    const offset = getNavOffset();
    const scrollPosition = window.scrollY + offset;

    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
          }
        });
      }
    });
  }

  // ==========================================
  // ANIMACIONES
  // ==========================================
  function animateOnScroll() {
    if (reduceMotion) return;

    const elements = document.querySelectorAll(
      ".character-card, .team-member, .achievement, .synopsis-content, .simbologia-content, .team-section"
    );

    elements.forEach((element) => {
      if (element.classList.contains("animate-fade-in")) return;
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("animate-fade-in");
        element.classList.remove("reveal");
      }
    });
  }

  function prepareReveal() {
    if (reduceMotion) return;

    const elements = document.querySelectorAll(
      ".character-card, .team-member, .achievement, .synopsis-content, .simbologia-content, .team-section"
    );

    elements.forEach((el) => {
      if (!el.classList.contains("animate-fade-in")) {
        el.classList.add("reveal");
      }
    });
  }

  // ==========================================
  // NAVEGACIÓN SUAVE
  // ==========================================
  function setupSmoothScroll() {
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        const isMobile = window.innerWidth <= 768;

        // Cerrar menú móvil si está abierto
        if (isMobile && navbar && navbar.classList.contains("open")) {
          navbar.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }

        // Scroll suave al elemento
        requestAnimationFrame(() => {
          const navHeight = isMobile
            ? navbar
              ? navbar.getBoundingClientRect().height
              : 56
            : getNavOffset();
          const cushion = isMobile ? 6 : 0;
          const targetTop =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight -
            cushion;

          window.scrollTo({
            top: targetTop,
            behavior: reduceMotion ? "auto" : "smooth",
          });
        });
      });
    });
  }

  // ==========================================
  // MENÚ MÓVIL
  // ==========================================
  function initMobileMenu() {
    if (!navToggle || !navbar) return;

    // Toggle del menú
    navToggle.addEventListener("click", function () {
      const isOpen = navbar.classList.toggle("open");
      this.setAttribute("aria-expanded", String(isOpen));
    });

    // Cerrar menú al hacer clic en un link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && navbar.classList.contains("open")) {
          navbar.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile || !navbar) return;

      const clickedInsideNavbar =
        navbar.contains(e.target) ||
        (navToggle && navToggle.contains(e.target));

      if (!clickedInsideNavbar && navbar.classList.contains("open")) {
        navbar.classList.remove("open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ==========================================
  // MODAL
  // ==========================================
  function initModal() {
    if (!modal) return;

    modal.style.display = "none";

    function closeModal() {
      const videoIframe = document.getElementById("modalVideo");
      if (videoIframe) {
        const videoSrc = videoIframe.src;
        videoIframe.src = videoSrc;
      }

      modal.style.display = "none";
      if (floatingButtons) {
        floatingButtons.style.display = "flex";
      }
    }

    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    // Cerrar al hacer clic en el fondo
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });

    // Mostrar modal en desktop al cargar
    if (window.innerWidth >= 768) {
      modal.style.display = "flex";
      if (floatingButtons) {
        floatingButtons.style.display = "none";
      }
    }
  }

  // ==========================================
  // BOTÓN VOLVER ARRIBA
  // ==========================================
  function initBackToTop() {
    if (!backToTop) return;

    function updateBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    window.addEventListener("scroll", updateBackToTop);
    updateBackToTop();
  }

  // ==========================================
  // FORMULARIO DE CONTACTO
  // ==========================================
  function initContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener("submit", handleContactForm);
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  function init() {
    // Configurar padding del body
    setBodyPadding();

    // Mostrar navbar con animación
    setTimeout(() => {
      if (navbar) navbar.classList.add("visible");
    }, 100);

    // Mostrar botones flotantes
    if (floatingButtons) {
      floatingButtons.style.display = "flex";
    }

    // Inicializar header
    header.classList.add("scroll-up");

    // Activar primer link de navegación
    if (navLinks.length > 0) {
      navLinks[0].classList.add("active");
      navLinks[0].setAttribute("aria-current", "page");
    }

    // Inicializar módulos
    initAudio();
    initMobileMenu();
    initModal();
    initBackToTop();
    initContactForm();
    setupSmoothScroll();
    prepareReveal();
    animateOnScroll();
  }

  // ==========================================
  // EVENT LISTENERS GLOBALES
  // ==========================================
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", setBodyPadding);

  // ==========================================
  // EJECUTAR INICIALIZACIÓN
  // ==========================================
  init();
});
