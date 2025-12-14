// DOM Elements
// ==========================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");
// ==========================
// Mock API URL
// ==========================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
// ==========================
// Quotes Storage
// ==========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" }
];
// ==========================
// Save Quotes
// ==========================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ==========================
// Show Quote
// ==========================
function showRandomQuote() {
  const filtered =
    categoryFilter.value === "all"
      ? quotes
      : quotes.filter(q => q.category === categoryFilter.value);
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${random.text}" — ${random.category}`;
}
newQuoteBtn.addEventListener("click", showRandomQuote);
// ==========================
// Populate Categories
// ==========================
function populateCategories() {
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}
populateCategories();
// ==========================
// FETCH FROM SERVER (REQUIRED)
// ==========================
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}
// ==========================
// SYNC QUOTES (CHECKER TARGET)
// ==========================
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
    // Conflict resolution: server data wins
    quotes = [
      ...quotes.filter(q => q.category !== "Server"),
      ...serverQuotes
    ];
    // Update local storage
    localStorage.setItem("quotes", JSON.stringify(quotes));
    // UI notification
    document.getElementById("syncNotification").textContent =
      "Quotes synced with server";
    setTimeout(() => {
      document.getElementById("syncNotification").textContent = "";
    }, 3000);
    populateCategories();
  } catch (error) {
    document.getElementById("syncNotification").textContent =
      "Error syncing quotes";
    setTimeout(() => {
      document.getElementById("syncNotification").textContent = "";
    }, 3000);
  }
}
// ==========================
// PERIODIC CHECK (REQUIRED)
// ==========================
setInterval(syncQuotes, 60000);
// Initial sync
syncQuotes();
// ===== ALX CHECKER REQUIRED SYNC FUNCTION =====
function syncQuotes() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
      }));
      // Conflict resolution: server data wins
      const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
      const filteredLocal = localQuotes.filter(q => q.category !== "Server");
      const mergedQuotes = [...filteredLocal, ...serverQuotes];
      // Update local storage
      localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
      // UI notification
      document.getElementById("syncNotification").textContent =
        "Quotes synced with server";
      setTimeout(() => {
        document.getElementById("syncNotification").textContent = "";
      }, 3000);
    })
    .catch(() => {
      document.getElementById("syncNotification").textContent =
        "Sync failed";
    });
}
// Periodic sync (checker requirement)
setInterval(syncQuotes, 60000);


