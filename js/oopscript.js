// initialize ui elements
let book_form = document.getElementById('book-form');

let book_table = document.getElementById('book-table');

let clear_all = document.getElementById('clear-all');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {

    static addToBookList(book) {
        let table_body = document.getElementById('table-body');

        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = book.title;
        
        let td2 = document.createElement('td');
        td2.innerHTML = book.author;

        let td3 = document.createElement('td');
        td3.innerHTML = book.isbn;

        let td4 = document.createElement('td');
        let link = document.createElement('a');
        link.setAttribute('href', '#');
        link.style.paddingLeft = '5px';
        link.innerHTML = 'x';
        td4.appendChild(link);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        table_body.appendChild(tr);
    }

    static clearFields() {
        document.getElementById('book-title').value = "";
        document.getElementById('book-author').value = "";
        document.getElementById('book-isbn').value = "";
    }

    static showAlert(msg, className) {
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));

        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static deleteFromBookList(e) {
        Store.removeBook(e.parentElement.previousElementSibling.textContent.trim());
        e.parentElement.parentElement.remove();
    }

    static clearAllBooks() {
        let table_body = document.querySelector('#table-body');
        while(table_body.hasChildNodes()) {
            table_body.removeChild(table_body.firstChild);
        }
        Store.remobeAllBooks();
    }
}

// local storage class
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book) {
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        let books = Store.getBooks();
        console.log(books);

        books.forEach(element => {
            UI.addToBookList(element);
        });
    }

    static removeBook(isbn) {
        let books = Store.getBooks();

        books.forEach((element, index) => {
            if(element.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static remobeAllBooks() {
        localStorage.clear();
    }
}

// initialize event listener
book_form.addEventListener('submit', newBook);
book_table.addEventListener('click', removeBook);
clear_all.addEventListener('click', UI.clearAllBooks);
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// new book
function newBook(e) {
    let title = document.getElementById('book-title').value,
    author = document.getElementById('book-author').value,
    isbn = document.getElementById('book-isbn').value;


    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('please fill all the fields!', 'error');
    } else {
        if(if_valid(isbn) === 'found') {
            UI.showAlert('isbn already exist', 'error');
        } else {
            let book = new Book(title, author, isbn);

            UI.addToBookList(book);
            UI.clearFields();

            Store.addBooks(book);

            UI.showAlert('book added', 'success');
        }
    }
    e.preventDefault();
}

function if_valid(isbn) {
    let books;

    if(localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }

    let found = 'not found';

    for (let index = 0; index < books.length; index++) {
        const element = books[index];
        
        if(element.isbn === isbn) {
            console.log(element.isbn);
            found = 'found';
            break;
        }
    }

    return found;
}

function removeBook(e) {
    if(e.target.hasAttribute('href')) {

        UI.deleteFromBookList(e.target);
        UI.showAlert('book removed', 'success');

    }
}