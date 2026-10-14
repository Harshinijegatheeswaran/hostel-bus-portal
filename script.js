const STORAGE_KEY = "hostelBusPortalDemoRecords";

const roleSelect = document.getElementById("roleSelect");
const studentView = document.getElementById("studentView");
const adminView = document.getElementById("adminView");
const movementForm = document.getElementById("movementForm");
const movementTime = document.getElementById("movementTime");
const formMessage = document.getElementById("formMessage");
const searchInput = document.getElementById("searchInput");

function localDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}
movementTime.value = localDateTimeValue();

function getRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function renderRecords() {
  const records = getRecords().sort((a, b) => new Date(b.time) - new Date(a.time));
  const query = searchInput.value.trim().toLowerCase();
  const filtered = records.filter(record =>
    [record.name, record.studentId, record.room, record.route, record.destination, record.type]
      .some(value => String(value || "").toLowerCase().includes(query))
  );

  document.getElementById("totalCount").textContent = records.length;
  document.getElementById("departureCount").textContent =
    records.filter(record => record.type === "Sign-out / Departure").length;
  document.getElementById("returnCount").textContent =
    records.filter(record => record.type === "Sign-in / Return").length;

  const body = document.getElementById("recordsBody");
  body.innerHTML = filtered.map(record => `
    <tr>
      <td>${escapeHtml(record.name)}</td>
      <td>${escapeHtml(record.studentId)}</td>
      <td>${escapeHtml(record.room || "—")}</td>
      <td>${escapeHtml(record.route)}</td>
      <td>${escapeHtml(record.destination)}</td>
      <td>${escapeHtml(record.type)}</td>
      <td>${escapeHtml(formatDate(record.time))}</td>
    </tr>
  `).join("");

  document.getElementById("emptyState").classList.toggle("hidden", filtered.length > 0);
}

function updateView() {
  const role = roleSelect.value;
  const isStudent = role === "student";
  studentView.classList.toggle("hidden", !isStudent);
  adminView.classList.toggle("hidden", isStudent);

  const titles = {
    warden: ["WARDEN DASHBOARD", "Warden movement overview", "Review student movement and registration records."],
    staff: ["HOSTEL STAFF DASHBOARD", "Hostel staff movement records", "Check student departure and return entries."],
    principal: ["PRINCIPAL DASHBOARD", "Principal overview", "View the overall movement records and summary."]
  };

  if (!isStudent) {
    const [eyebrow, title, description] = titles[role];
    document.getElementById("adminEyebrow").textContent = eyebrow;
    document.getElementById("adminTitle").textContent = title;
    document.getElementById("adminDescription").textContent = description;
    renderRecords();
  }
}

movementForm.addEventListener("submit", event => {
  event.preventDefault();
  const record = {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    name: document.getElementById("studentName").value.trim(),
    studentId: document.getElementById("studentId").value.trim(),
    room: document.getElementById("room").value.trim(),
    route: document.getElementById("busRoute").value.trim(),
    destination: document.getElementById("destination").value,
    type: document.getElementById("movementType").value,
    time: document.getElementById("movementTime").value,
    reason: document.getElementById("reason").value.trim()
  };

  if (!record.name || !record.studentId || !record.route || !record.destination || !record.time) {
    formMessage.textContent = "Please complete all required fields.";
    return;
  }

  const records = getRecords();
  records.push(record);
  saveRecords(records);
  formMessage.textContent = "Movement record saved in this browser's demo storage.";
  movementForm.reset();
  movementTime.value = localDateTimeValue();
});

movementForm.addEventListener("reset", () => {
  formMessage.textContent = "";
  setTimeout(() => { movementTime.value = localDateTimeValue(); }, 0);
});

roleSelect.addEventListener("change", updateView);
searchInput.addEventListener("input", renderRecords);

document.getElementById("exportBtn").addEventListener("click", () => {
  const records = getRecords();
  const columns = ["name", "studentId", "room", "route", "destination", "type", "time", "reason"];
  const csvCell = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [columns.join(","), ...records.map(record => columns.map(column => csvCell(record[column])).join(","))].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hostel-bus-movement-demo.csv";
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById("clearRecordsBtn").addEventListener("click", () => {
  if (confirm("Delete all demo records stored in this browser? This cannot be undone.")) {
    saveRecords([]);
    renderRecords();
  }
});

updateView();
