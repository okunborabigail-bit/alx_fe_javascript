// ======== server simulation ========
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for quotes
// Fetch quotes from server
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Take first 5 quotes for demo
    return data.slice(0, 5).map(item => ({ id: item.id, quote: item.title }));
  } catch (err) {
    console.error("Failed to fetch server quotes:", err);
    return [];
  }
}
// ======== local storage handling ========
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem("quotes") || "[]");
}
function saveLocalQuotes(quotes) {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// ======== notifications ========
function notifyUser(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }
}
// ======== render quotes ========
function renderQuotes(quotes) {
  const container = document.getElementById("quoteContainer");
  container.innerHTML = ""; // clear old quotes
  quotes.forEach(q => {
    const div = document.createElement("div");
    div.textContent = `${q.id}: ${q.quote}`;
    container.appendChild(div);
  });
}
// ======== sync logic with conflict resolution ========
async function syncQuotes() {
  const serverQuotes = await fetchServerQuotes();
  const localQuotes = getLocalQuotes();
  let updated = false;
  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuotes.find(q => q.id === serverQuote.id);
    if (!localQuote) {
      // New quote from server
      localQuotes.push(serverQuote);
      updated = true;
    } else if (localQuote.quote !== serverQuote.quote) {
      // Conflict detected: server wins
      localQuote.quote = serverQuote.quote;
      updated = true;
    }
  });
  if (updated) {
    saveLocalQuotes(localQuotes);
    notifyUser("Quotes have been updated from the server.");
    renderQuotes(localQuotes);
  }
}
// ======== manual conflict resolution option ========
function manualSync() {
  syncQuotes();
  notifyUser("Manual sync executed.");
}
// ======== initial load ========
document.addEventListener("DOMContentLoaded", () => {
  const quotes = getLocalQuotes();
  renderQuotes(quotes);
  // Periodic sync every 30 seconds
  setInterval(syncQuotes, 30000);
  // Optional: manual sync button
  const syncButton = document.getElementById("syncButton");
  if (syncButton) {
    syncButton.addEventListener("click", manualSync);
  }
});
