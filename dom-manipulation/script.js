// DOM Elements
// ==========================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");
// ==========================
// Mock Server URL
// ==========================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
// ==========================
// Load Quotes
// ==========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" }
];
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ==========================
// Display Quote
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
// SYNC QUOTES (REQUIRED)
// ==========================
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    // Conflict resolution: server wins for "Server" category
    quotes = [
      ...quotes.filter(q => q.category !== "Server"),
      ...serverQuotes
    ];
    saveQuotes();
    populateCategories();
    // UI Notification
    syncNotification.textContent = "Quotes synced with server ✔";
    setTimeout(() => (syncNotification.textContent = ""), 3000);
  } catch (error) {
    syncNotification.textContent = "Sync failed ❌";
    setTimeout(() => (syncNotification.textContent = ""), 3000);
  }
}
// ==========================
// PERIODIC SERVER CHECK (REQUIRED)
// ==========================
setInterval(syncQuotes, 60000);
// Initial sync on page load
syncQuotes();

