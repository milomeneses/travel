const table = document.getElementById("admin-table");
const refreshBtn = document.getElementById("refresh");

const render = (entries) => {
  if (!entries.length) {
    table.innerHTML = "<p>No hay suscriptores registrados.</p>";
    return;
  }

  const rows = entries
    .map(
      (entry) => `
        <div class="admin-row">
          <div>
            <strong>${entry.name || "Sin nombre"}</strong>
            <span>${entry.email}</span>
          </div>
          <span>${new Date(entry.createdAt).toLocaleString("es-ES")}</span>
        </div>
      `
    )
    .join("");

  table.innerHTML = rows;
};

const loadEntries = async () => {
  table.innerHTML = "<p>Cargando...</p>";
  const response = await fetch("/api/newsletter");
  const data = await response.json();
  render(data.entries || []);
};

refreshBtn.addEventListener("click", loadEntries);
loadEntries();
