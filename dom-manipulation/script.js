const quotes = [
  {
    text:"The best way to predict the future is to create it.",
    category: "Motivation"
  },
  {
    text:"Talk is cheap. Show me the code.",
    category: "Programming"
  },
  {
  text: "Healing is not linear.",
    category: "Life"
  }
  ];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
  

function sh quotes.showRandomQuote() {
  quoteDisplay.innerHTML = "";
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteText = document.createElement("p)
                                           quoteText.textContent = '"${randomQuote.text}"';
  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = 'Category: ${randomQuote.category}';
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild{quoteCategory};
}
newQuoteBtn.addEventListener("click", showRandomQuote);

