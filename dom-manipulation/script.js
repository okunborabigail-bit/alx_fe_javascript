// ============================
// Mock API fetch (REQUIRED)
// ============================
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json());
}
// ============================
// Sync quotes (REQUIRED)
// ============================
function syncQuotes() {
  fetchQuotesFromServer().then(data => {
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
    const localQuotes =
      JSON.parse(localStorage.getItem("quotes")) || [];
    // Conflict resolution: server data takes precedence
    const filteredLocal = localQuotes.filter(
      quote => quote.category !== "Server"
    );
    const mergedQuotes = [...filteredLocal, ...serverQuotes];
    // Update local storage
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    // UI notification
    const notice = document.getElementById("syncNotification");
    if (notice) {
      notice.textContent = "Quotes synced with server";
      setTimeout(() => {
        notice.textContent = "";
      }, 3000);
    }
  });
}
// ============================
// Periodic server sync
// ============================
setInterval(syncQuotes, 60000)
