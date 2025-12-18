// Quote data
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final; failure is not fatal.", category: "Inspiration" },
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryContainer = document.getElementById("categoryContainer");
const formContainer = document.getElementById("formContainer");

let selectedCategory = "All";

// ------------------------------
// Display Random Quote
// ------------------------------
function showRandomQuote() {
  let filteredQuotes = quotes;

  if (selectedCategory !== "All") {
    filteredQuotes = quotes.filter(
      quote => quote.category === selectedCategory
    );
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// ------------------------------
// Create Category Selector
// ------------------------------
function renderCategories() {
  categoryContainer.innerHTML = "";

  const select = document.createElement("select");

  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All";
  select.appendChild(allOption);

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    showRandomQuote();
  });

  categoryContainer.appendChild(select);
}

// ------------------------------
// Create Add Quote Form Dynamically
// ------------------------------
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// ------------------------------
// Add Quote Function
// ------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  renderCategories();
  showRandomQuote();
}

// ------------------------------
// Event Listeners
// ------------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);

// ------------------------------
// Initialize App
// ------------------------------
renderCategories();
createAddQuoteForm();
showRandomQuote();

