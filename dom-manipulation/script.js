// Quotes array
const quotes = [
  {
    text: "The best way to predict the future is to create it.",
    category: "Motivation"
  },
  {
    text: "Talk is cheap. Show me the code.",
    category: "Programming"
  },
  {
    text: "Healing is not linear.",
    category: "Life"
  }
];
// Connect DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
// Function to show a random quote
function showRandomQuote() {
  // Clear previous quote
  quoteDisplay.innerHTML = "";
  // Pick random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  // Create elements for quote
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;
  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  // Append to the page
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}
// Connect button
newQuoteBtn.addEventListener("click", showRandomQuote);
// Function to create Add Quote form dynamically
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
// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text === "" || category === "") {
    alert("Please enter both quote and category.");
    return;
  }
  // Add new quote to array
  quotes.push({ text, category });
  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}
// Create the form when page loads
createAddQuoteForm();
