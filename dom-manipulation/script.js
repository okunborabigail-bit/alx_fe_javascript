// Quotes array (each quote is an object)
let quotes = [];

/* ================================
   LOAD & SAVE
================================ */

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load last selected category filter
function loadLastFilter() {
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    document.getElementById("categoryFilter").value = savedFilter;
  }
}

loadQuotes();

/* ================================
   ADD QUOTE
================================ */

function addQuote() {
  const quoteText = document.getElementById("quoteInput").value.trim();
  const categoryText = document.getElementById("categoryInput").value.trim();

  if (quoteText === "" || categoryText === "") {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({
    text: quoteText,
    category: categoryText
  });

  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("quoteInput").value = "";
  document.getElementById("categoryInput").value = "";
}

/* ================================
   POPULATE CATEGORIES
================================ */

function populateCategories() {
  const filter = document.getElementById("categoryFilter");

  // Clear existing options except "all"
  filter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });
}

/* ================================
   FILTER QUOTES
================================ */

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save selected filter
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes in this category";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex].text;

  document.getElementById("quoteDisplay").textContent = quote;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", quote);
}

/* ================================
   SESSION STORAGE
================================ */

function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").textContent = lastQuote;
  }
}

/* ================================
   EXPORT & IMPORT
================================ */

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

  reader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
  };

  reader.readAsText(event.target.files[0]);
}

/* ================================
   EVENT LISTENERS
================================ */

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

/* ================================
   INITIALIZE UI
================================ */

populateCategories();
loadLastFilter();
filterQuotes();
loadLastViewedQuote();
