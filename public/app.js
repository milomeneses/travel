const form = document.getElementById("newsletter-form");
const statusEl = document.getElementById("newsletter-status");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".menu-close");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Registrando...";

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email")
    };

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Error al registrar.");
      }

      form.reset();
      statusEl.textContent = "¡Gracias por suscribirte!";
    } catch (error) {
      statusEl.textContent = "No se pudo registrar. Intenta nuevamente.";
    }
  });
}

const toggleMenu = (open) => {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle("open", open);
  mobileMenu.setAttribute("aria-hidden", (!open).toString());
  menuToggle.setAttribute("aria-expanded", open.toString());
};

if (menuToggle && mobileMenu && menuClose) {
  menuToggle.addEventListener("click", () => toggleMenu(true));
  menuClose.addEventListener("click", () => toggleMenu(false));
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });
}

const initCarousel = (carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const prev = carousel.querySelector(".carousel-btn.prev");
  const next = carousel.querySelector(".carousel-btn.next");
  if (!track || !prev || !next) return;

  const updateScroll = (direction) => {
    const firstCard = track.querySelector("*");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 240;
    track.scrollBy({ left: direction * (cardWidth + 18), behavior: "smooth" });
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= maxScroll - 2;
    track.classList.toggle("is-scrollable", maxScroll > 0);
  };

  prev.addEventListener("click", () => updateScroll(-1));
  next.addEventListener("click", () => updateScroll(1));
  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  updateButtons();
};

document.querySelectorAll(".carousel").forEach(initCarousel);
