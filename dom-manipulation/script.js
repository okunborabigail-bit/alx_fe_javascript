// ======= GLOBAL QUOTES ARRAY =======
let quotes = [];
// ======= LOAD FROM LOCAL STORAGE =======
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
  quotes = storedQuotes;
}
// ======= SAVE TO LOCAL STORAGE =======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ======= NOTIFICATIONS =======
function notifyUser(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }
}
// ======= RENDER QUOTES =======
function renderQuotes(displayQuotes) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  displayQuotes.forEach(q => {
    const div = document.createElement("div");
    div.textContent = `[${q.category}] ${q.text}`;
    container.appendChild(div);
  });
}
// ======= SHOW RANDOM QUOTE =======
function showRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;
  if (filter && filter !== "all") {
    filteredQuotes = quotes.filter(q => q.category === filter);
  }
  if (filteredQuotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const q = filteredQuotes[randomIndex];
  renderQuotes([q]);
}
// ======= ADD NEW QUOTE =======
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  if (!textInput.value || !categoryInput.value) {
    alert("Please enter both quote and category.");
    return;
  }
  const newQuote = {
    id: Date.now(), // unique id
    text: textInput.value,
    category: categoryInput.value
  };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  notifyUser("New quote added!");
  textInput.value = "";
  categoryInput.value = "";
}
// ======= POPULATE CATEGORY DROPDOWN =======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selected = categoryFilter.value || "all";
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = selected;
}
// ======= FILTER QUOTES BY CATEGORY =======
function filterQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  let filtered = quotes;
  if (filter && filter !== "all") {
    filtered = quotes.filter(q => q.category === filter);
  }
  renderQuotes(filtered);
  localStorage.setItem("lastFilter", filter);
}
// ======= JSON IMPORT =======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}
// ======= JSON EXPORT =======
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// ======= SERVER SYNC =======
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      category: "General"
    }));
  } catch (err) {
    console.error("Server fetch failed:", err);
    return [];
  }
}
async function syncQuotesWithServer() {
  const serverQuotes = await fetchServerQuotes();
  let updated = false;
  serverQuotes.forEach(serverQuote => {
    const localQuote = quotes.find(q => q.id === serverQuote.id);
    if (!localQuote) {
      quotes.push(serverQuote);
      updated = true;
    } else if (localQuote.text !== serverQuote.text) {
      localQuote.text = serverQuote.text;
      localQuote.category = serverQuote.category;
      updated = true;
    }
  });
  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes updated from server!");
  }
}
// ======= INITIALIZATION =======
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  // Restore last filter
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  document.getElementById("categoryFilter").value = lastFilter;
  populateCategories();
  filterQuotes();
  // Show random quote button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  // Manual sync button
  const syncBtn = document.getElementById("syncButton");
  if (syncBtn) {
    syncBtn.addEventListener("click", syncQuotesWithServer);
  }
  // Periodic sync every 30s
  setInterval(syncQuotesWithServer, 30000);
});

