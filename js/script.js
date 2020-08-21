// initialize ui elements
let book_form = document.getElementById('book-form');
let title = document.getElementById('book-title');
let author = document.getElementById('book-author');
let isbn = document.getElementById('book-isbn');
let insert_btn = document.getElementById('book-insert');
let book_table = document.getElementById('book-table');
let table_body = document.getElementById('table-body');
let clear_all = document.getElementById('clear-all');

// initialize event listener
document.addEventListener("DOMContentLoaded", getBookList);
book_form.addEventListener('submit', addBook);
table_body.addEventListener('click', removeBook);
clear_all.addEventListener('click', clearAllBooks);

// functions
function addBook(e) {
    if(title.value === "" || author.value === "" || isbn.value === "") {
        alert('Please fill-up every information!')
    }
    else {

        if(if_valid() === 'not found') {
            let tr = document.createElement('tr');

            let td1 = document.createElement('td');
            td1.innerHTML = title.value;
            
            let td2 = document.createElement('td');
            td2.innerHTML = author.value;

            let td3 = document.createElement('td');
            td3.innerHTML = isbn.value;

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
            
            storeIntoLocalStorage(e);

            title.value = "";
            author.value = "";
            isbn.value = "";
        } else {
            alert('isbn number already exist!');
        }
    }
    
    e.preventDefault();
}

function if_valid() {
    let books;

    if(localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }

    let found = 'not found';

    console.log(books);

    for (let index = 0; index < books.length; index++) {
        const element = books[index];
        if(element.isbn === isbn.value) {
            found = 'found';
            break;
        }
    }

    return found;
}

function getBookList(e) {
    let books;

    if(localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }

    books.forEach(element => {
        console.log(element);

        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = element.title;
        
        let td2 = document.createElement('td');
        td2.innerHTML = element.author;

        let td3 = document.createElement('td');
        td3.innerHTML = element.isbn;

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
    });
}

function removeBook(e) {
    if(e.target.hasAttribute('href')) {
        e.target.parentNode.parentNode.remove();
        removeFromLocalStorage(e);
    }
}

function storeIntoLocalStorage(e) {
    let books;

    if(localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }

    let book = {title: title.value, author: author.value, isbn: isbn.value};
    
    books.push(book);
    
    localStorage.setItem('books', JSON.stringify(books));
}

function removeFromLocalStorage(e) {
    let books;

    if(localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    
    let tr = e.target.parentNode.parentNode;

    tr.removeChild(tr.lastChild);

    let str = tr.lastChild.textContent;

    books.forEach((element, index) => {
        if(element.isbn === str) {
            books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));
}

function clearAllBooks() {
    while(table_body.hasChildNodes()) {
        table_body.removeChild(table_body.firstChild);
    }

    localStorage.clear();
}