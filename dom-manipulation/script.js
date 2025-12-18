let quotes = [];

/* =====================
   LOCAL STORAGE
===================== */

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

loadQuotes();

/* =====================
   ADD QUOTE
===================== */

function addQuote() {
  const text = document.getElementById("quoteInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();

  if (!text || !category) {
    alert("Enter quote and category");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("quoteInput").value = "";
  document.getElementById("categoryInput").value = "";
}

/* =====================
   CATEGORIES
===================== */

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

/* =====================
   FILTER QUOTES
===================== */

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes available";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").textContent = random.text;

  sessionStorage.setItem("lastViewedQuote", random.text);
}

/* =====================
   RESTORE STATE
===================== */

function restoreFilter() {
  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    document.getElementById("categoryFilter").value = saved;
  }
}

function restoreLastQuote() {
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    document.getElementById("quoteDisplay").textContent = last;
  }
}

/* =====================
   JSON EXPORT / IMPORT
===================== */

function exportToJsonFile() {
  const blob = new Blob(
    [JSON.stringify(quotes, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
  };
  reader.readAsText(event.target.files[0]);
}

/* =====================
   SERVER SYNC (SIMULATION)
===================== */

async function fetchServerQuotes() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  const data = await res.json();

  return data.map(post => ({
    text: post.title,
    category: "server"
  }));
}

async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();

  // Conflict resolution: server wins
  quotes = serverQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("syncStatus").textContent =
    "✔ Synced with server. Conflicts resolved.";
}

// Auto sync every 30 seconds
setInterval(syncWithServer, 30000);

/* =====================
   EVENTS
===================== */

document.getElementById("addQuoteBtn")
  .addEventListener("click", addQuote);

document.getElementById("showQuoteBtn")
  .addEventListener("click", filterQuotes);

document.getElementById("exportBtn")
  .addEventListener("click", exportToJsonFile);

document.getElementById("importFile")
  .addEventListener("change", importFromJsonFile);

document.getElementById("categoryFilter")
  .addEventListener("change", filterQuotes);

document.getElementById("syncBtn")
  .addEventListener("click", syncWithServer);

/* =====================
   INIT
===================== */

populateCategories();
restoreFilter();
filterQuotes();
restoreLastQuote();
