const form = document.getElementById("newsletter-form");
const statusEl = document.getElementById("newsletter-status");

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
