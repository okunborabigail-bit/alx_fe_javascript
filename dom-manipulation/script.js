// Connect DOM elements
// ==========================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const exportBtn = document.getElementById("exportJson");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");
const manualSyncBtn = document.getElementById("manualSync");
// ==========================
// Server URL (mock API)
// ==========================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
// ==========================
// Load quotes from localStorage or default
// ==========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" },
  { text: "Healing is not linear.", category: "Life" }
];
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ==========================
// Show random quote (filtered)
// ==========================
function showRandomQuote() {
  quoteDisplay.innerHTML = "";
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;
  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}
newQuoteBtn.addEventListener("click", showRandomQuote);
// ==========================
// Add Quote Form
// ==========================
function createAddQuoteForm() {
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}
createAddQuoteForm();
// ==========================
// Add new quote
// ==========================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text === "" || category === "") {
    alert("Please enter both quote and category.");
    return;
  }
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  // Post the new quote to the server
  postQuoteToServer(newQuote);
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}
// ==========================
// Populate categories
// ==========================
function populateCategories() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const savedCategory = localStorage.getItem("lastSelectedCategory");
  if (savedCategory && categories.includes(savedCategory)) {
    categoryFilter.value = savedCategory;
  }
}
populateCategories();
// ==========================
// Filter quotes when category changes
// ==========================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote();
}
// ==========================
// Export quotes to JSON
// ==========================
exportBtn.addEventListener("click", exportToJson);
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}
// ==========================
// Import quotes from JSON
// ==========================
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing JSON: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
// ==========================
// Post quote to server
// ==========================
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (error) {
    console.error("Error posting quote:", error);
    syncNotification.textContent = "Failed to post new quote to server.";
    setTimeout(() => syncNotification.textContent = "", 3000);
  }
}
// ==========================
// Fetch quotes from server (sync + conflict resolution)
// ==========================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    const serverQuotes = serverData.slice(0, 10).map(item => ({
      text: item.title,
      category: "Server"
    }));
    // Conflict resolution: server overwrites old server quotes
    quotes = [...quotes.filter(q => q.category !== "Server"), ...serverQuotes];
    saveQuotes();
    populateCategories();
    syncNotification.textContent = "Quotes synced with server!";
    setTimeout(() => syncNotification.textContent = "", 3000);
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    syncNotification.textContent = "Failed to sync with server.";
    setTimeout(() => syncNotification.textContent = "", 3000);
  }
}
// Auto-sync every 60 seconds
setInterval(fetchQuotesFromServer, 60000);
// Initial fetch on page load
fetchQuotesFromServer();
// Manual sync button
if (manualSyncBtn) {
  manualSyncBtn.addEventListener("click", fetchQuotesFromServer);
}
