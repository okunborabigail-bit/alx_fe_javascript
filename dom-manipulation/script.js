// ======================
// DOM ELEMENTS
// ======================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");
// ======================
// INITIAL QUOTES
// ======================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" }
];
// ======================
// SAVE TO LOCAL STORAGE
// ======================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ======================
// SHOW RANDOM QUOTE
// ======================
function showRandomQuote() {
  quoteDisplay.textContent = "";
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
// ======================
// POPULATE CATEGORIES
// ======================
function populateCategories() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}
populateCategories();
// ======================
// MOCK API FETCH
// ======================
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json());
}
// ======================
// SYNC QUOTES
// ======================
function syncQuotes() {
  fetchQuotesFromServer().then(data => {
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    // Conflict resolution: server wins
    const filteredLocal = localQuotes.filter(
      quote => quote.category !== "Server"
    );
    quotes = [...filteredLocal, ...serverQuotes];
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    if (syncNotification) {
      syncNotification.textContent = "Quotes synced with server";
      setTimeout(() => {
        syncNotification.textContent = "";
      }, 3000);
    }
  });
}
// ======================
// PERIODIC SERVER SYNC
// ======================
setInterval(syncQuotes, 60000);
