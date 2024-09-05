// Sample book data (can be replaced with dynamic content or a database later)
const books = [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", category: "fiction", available: true },
    { id: 2, title: "Sapiens", author: "Yuval Noah Harari", category: "non-fiction", available: true },
    { id: 3, title: "Harry Potter", author: "J.K. Rowling", category: "fantasy", available: true }
];

// History of borrowed books
let borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayBooks(books);
    displayHistory();
    
    // Search functionality
    document.getElementById('search-bar').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        displayBooks(filteredBooks);
    });

    // Filter by category
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const category = e.target.value;
        const filteredBooks = category === "all" ? books : books.filter(book => book.category === category);
        displayBooks(filteredBooks);
    });
});

// Display books
function displayBooks(bookList) {
    const bookListDiv = document.getElementById('book-list');
    bookListDiv.innerHTML = "";
    
    bookList.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <strong>${book.title}</strong> by ${book.author} (${book.category})
            ${book.available ? '<button class="borrow-btn" onclick="borrowBook(' + book.id + ')">Borrow</button>' : '<button class="return-btn" onclick="returnBook(' + book.id + ')">Return</button>'}
        `;
        bookListDiv.appendChild(bookDiv);
    });
}

// Borrow a book
function borrowBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && book.available) {
        book.available = false;
        const borrowedDate = new Date().toLocaleDateString();
        borrowingHistory.push({ bookTitle: book.title, action: "borrowed", date: borrowedDate });
        localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory));
        displayBooks(books);
        displayHistory();
    }
}

// Return a book
function returnBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && !book.available) {
        book.available = true;
        const returnDate = new Date().toLocaleDateString();
        borrowingHistory.push({ bookTitle: book.title, action: "returned", date: returnDate });
        localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory));
        displayBooks(books);
        displayHistory();
    }
}

// Display borrowing history
function displayHistory() {
    const historyListDiv = document.getElementById('history-list');
    historyListDiv.innerHTML = "";

    borrowingHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            ${entry.bookTitle} was ${entry.action} on ${entry.date}.
        `;
        historyListDiv.appendChild(historyItem);
    });
}
