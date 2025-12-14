// ===== GLOBAL QUOTES ARRAY =====
let quotes = [];
// ===== LOAD LOCAL STORAGE =====
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
  quotes = storedQuotes;
}
// ===== SAVE LOCAL STORAGE =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ===== UI NOTIFICATION =====
function notifyUser(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }
}
// ===== RENDER QUOTES =====
function renderQuotes(displayQuotes) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  displayQuotes.forEach(q => {
    const div = document.createElement("div");
    div.textContent = `[${q.category}] ${q.text}`;
    container.appendChild(div);
  });
}
// ===== SHOW RANDOM QUOTE =====
function showRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  renderQuotes([quotes[randomIndex]]);
}
// ===== ADD NEW QUOTE =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  if (!textInput.value || !categoryInput.value) return;
  const newQuote = {
    id: Date.now(),
    text: textInput.value,
    category: categoryInput.value
  };
  quotes.push(newQuote);
  saveQuotes();
  renderQuotes(quotes);
  notifyUser("New quote added!");
  textInput.value = "";
  categoryInput.value = "";
}
// ===== SYNC QUOTES WITH SERVER =====
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
async function syncQuotes() {
  try {
    // Fetch server quotes
    const response = await fetch(SERVER_URL);
    const serverQuotes = (await response.json()).slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      category: "General"
    }));
    // Merge server data with local data
    let updated = false;
    serverQuotes.forEach(serverQuote => {
      const localQuote = quotes.find(q => q.id === serverQuote.id);
      if (!localQuote) {
        quotes.push(serverQuote);
        updated = true;
      } else if (localQuote.text !== serverQuote.text) {
        // Conflict resolution: ask user
        const keepServer = confirm(
          `Conflict detected for quote:\nLocal: ${localQuote.text}\nServer: ${serverQuote.text}\nOK = keep SERVER version, Cancel = keep LOCAL version`
        );
        if (keepServer) {
          localQuote.text = serverQuote.text;
          localQuote.category = serverQuote.category;
        }
        updated = true;
      }
    });
    if (updated) {
      saveQuotes();
      renderQuotes(quotes);
      notifyUser("Quotes synced with server!");
    }
  } catch (err) {
    console.error("Error syncing quotes:", err);
  }
}
// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  renderQuotes(quotes);
  // Event listeners
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("syncButton").addEventListener("click", syncQuotes);
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  // Periodic sync every 30 seconds
  setInterval(syncQuotes, 30000);
});
