// Quotes array
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

loadQuotes();

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add quote
function addQuote() {
  const input = document.getElementById("quoteInput");
  const text = input.value.trim();

  if (text === "") {
    alert("Please enter a quote");
    return;
  }

  quotes.push(text);
  saveQuotes();
  input.value = "";
}

// Display random quote + save to session storage
function displayRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quoteDisplay").textContent = quote;

  // ✅ REQUIRED: Save last viewed quote to session storage
  sessionStorage.setItem("lastViewedQuote", quote);
}

// Load last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").textContent = lastQuote;
  }
}

loadLastViewedQuote();

// ✅ REQUIRED FUNCTION NAME
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

// ✅ REQUIRED FUNCTION
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
  };

  reader.readAsText(event.target.files[0]);
}

/* =====================================================
   ✅ REQUIRED: addEventListener usage
===================================================== */

document.getElementById("addQuoteBtn")
  .addEventListener("click", addQuote);

document.getElementById("showQuoteBtn")
  .addEventListener("click", displayRandomQuote);

document.getElementById("exportBtn")
  .addEventListener("click", exportToJsonFile);

document.getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
