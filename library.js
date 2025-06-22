const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");

// Function to create and append each book result
function createAndAppendResult(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");

  const img = document.createElement("img");
  img.src = book.imageLink;
  img.alt = book.title;
  bookItem.appendChild(img);

  const details = document.createElement("div");

  const titleEl = document.createElement("h5");
  titleEl.textContent = book.title;
  details.appendChild(titleEl);

  const authorEl = document.createElement("p");
  authorEl.innerHTML = `<strong>Author:</strong> ${book.author}`;
  details.appendChild(authorEl);

  const descEl = document.createElement("p");
  descEl.innerHTML = `<strong>Description:</strong> ${book.description.slice(0, 150)}...`;
  details.appendChild(descEl);

  const link = document.createElement("a");
  link.href = book.previewLink;
  link.target = "_blank";
  link.textContent = "🔗 Preview Book";
  link.classList.add("btn", "btn-primary", "mt-2");
  details.appendChild(link);

  bookItem.appendChild(details);
  searchResultsEl.appendChild(bookItem);
}

// Function to fetch and render books from Google Books API
function fetchBooks(query) {
  spinnerEl.classList.remove("d-none");
  searchResultsEl.classList.add("d-none");
  searchResultsEl.textContent = "";

  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      spinnerEl.classList.add("d-none");
      searchResultsEl.classList.remove("d-none");

      const results = data.items || [];

      if (results.length === 0) {
        searchResultsEl.textContent = "No results found";
        return;
      }

      results.slice(0, 10).forEach(item => {
        const info = item.volumeInfo;

        const book = {
          title: info.title || "No Title",
          author: info.authors ? info.authors.join(", ") : "Unknown Author",
          description: info.description || "No Description Available",
          imageLink: info.imageLinks?.thumbnail || "https://via.placeholder.com/128x180?text=No+Cover",
          previewLink: info.previewLink || "#"
        };

        createAndAppendResult(book);
      });
    })
    .catch(error => {
      spinnerEl.classList.add("d-none");
      searchResultsEl.classList.remove("d-none");
      searchResultsEl.textContent = "Error fetching data. Please try again.";
      console.error("Error:", error);
    });
}

// Trigger fetch on Enter key press
searchInputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const query = searchInputEl.value.trim();
    if (query !== "") {
      fetchBooks(query);
    }
  }
});
