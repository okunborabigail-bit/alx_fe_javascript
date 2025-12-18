// STEP 1: Create quotes array
let quotes = [];

// STEP 2: Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");

  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

loadQuotes();

// STEP 3: Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// STEP 4: Add a new quote
function addQuote() {
  const quoteInput = document.getElementById("quoteInput");
  const quoteText = quoteInput.value.trim();

  if (quoteText === "") {
    alert("Please enter a quote");
    return;
  }

  quotes.push(quoteText);
  saveQuotes();

  quoteInput.value = "";
  alert("Quote added successfully!");
}

// STEP 5: Display random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").textContent = selectedQuote;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", selectedQuote);
}

// STEP 6: Load last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");

  if (lastQuote) {
    document.getElementById("quoteDisplay").textContent = lastQuote;
  }
}

loadLastViewedQuote();

// STEP 7: Export quotes as JSON
function exportQuotes() {
  if (quotes.length === 0) {
    alert("No quotes to export");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(quotes, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// STEP 8: Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON file");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error reading JSON file");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}
