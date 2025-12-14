// Connect DOM elements
// ==========================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const exportBtn = document.getElementById("exportJson");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
// ==========================
// Load quotes from localStorage or default
// ==========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" },
  { text: "Healing is not linear.", category: "Life" }
];
// Save quotes to localStorage
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
  // Save last displayed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}
// Connect button
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
// Call form creator
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
  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // Update category dropdown
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}
// ==========================
// Populate categories
// ==========================
function populateCategories() {
  // Clear existing options except "All"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  // Unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  // Restore last selected category
  const savedCategory = localStorage.getItem("lastSelectedCategory");
  if (savedCategory && categories.includes(savedCategory)) {
    categoryFilter.value = savedCategory;
  }
}
// Call this on page load
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

 
