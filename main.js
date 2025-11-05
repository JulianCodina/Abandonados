document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const playButton = document.querySelector(".play-button");
  const videoContainer = document.querySelector(".video-container");
  const trailerVideo = document.querySelector("#trailer-video");
  const contactForm = document.getElementById("contactForm");
  const modal = document.getElementById("videoModal");
  const modalClose = modal ? modal.querySelector(".close") : null;
  const modalIframe = document.getElementById("modalVideo");
  let lastScroll = 0;

  if (modal) {
    modal.style.display = "none";
  }

  function getNavOffset() {
    if (!navbar) return 0;
    // Keep a constant offset on mobile so opening the menu doesn't move content
    if (window.innerWidth <= 768) return 56; // ~40px button + 8px*2 padding
    return navbar.offsetHeight;
  }

  function setBodyPadding() {
    if (window.innerWidth <= 768) {
      document.body.style.paddingTop = `${getNavOffset()}px`;
    } else {
      document.body.style.paddingTop = ""; // use CSS default (e.g., 70px)
    }
  }

  setTimeout(() => {
    if (navbar) navbar.classList.add("visible");
  }, 100);

  function handleScroll() {
    const currentScroll = window.pageYOffset;

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
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  function animateOnScroll() {
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
    const elements = document.querySelectorAll(
      ".character-card, .team-member, .achievement, .synopsis-content, .simbologia-content, .team-section"
    );
    elements.forEach((el) => {
      if (!el.classList.contains("animate-fade-in")) {
        el.classList.add("reveal");
      }
    });
  }

  function setupSmoothScroll() {
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        const isMobile = window.innerWidth <= 768;

        // If on mobile and menu is open, close it first so we measure the closed height
        if (isMobile && navbar && navbar.classList.contains("open")) {
          navbar.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }

        // Wait a frame for layout to settle, then measure and scroll
        requestAnimationFrame(() => {
          const navHeight = isMobile
            ? navbar
              ? navbar.getBoundingClientRect().height
              : 56
            : getNavOffset();
          const cushion = isMobile ? 6 : 0; // small cushion to avoid overshooting
          const targetTop =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight -
            cushion;
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        });
      });
    });
  }

  function preloadImages() {
    const images = [
      "imgs/header.jpg",
      "imgs/placeholder-character.jpg",
      "imgs/placeholder-team.jpg",
      "imgs/play.png",
      "imgs/down.png",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", setBodyPadding);

  if (navToggle && navbar) {
    navToggle.addEventListener("click", function () {
      const isOpen = navbar.classList.toggle("open");
      this.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (navbar && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && navbar.classList.contains("open")) {
          navbar.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm);
  }

  setupSmoothScroll();
  prepareReveal();
  animateOnScroll();
  preloadImages();
  setBodyPadding();

  header.classList.add("scroll-up");

  if (navLinks.length > 0) {
    navLinks[0].classList.add("active");
  }

  if (modal && window.innerWidth >= 768) {
    modal.style.display = "flex";
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    if (modalIframe) {
      const src = modalIframe.src;
      modalIframe.src = src;
    }
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
});
