//get UI elements
const myform = document.getElementById('newBookForm');
const modalToggles = document.querySelectorAll('.toggleModal')
const closeBtn = document.getElementById('closeModal');
const newFormBtn = document.getElementById('newBook');
const clearBtn = document.getElementById('clearForm');
let deleteBtns = document.querySelectorAll('.delete-icon')

//event listeners to handle inputs
myform.addEventListener('submit', handleFormInput);
closeBtn.addEventListener('click', hideModal);
newFormBtn.addEventListener('click', displayModal);
window.addEventListener('keydown', handleKeyboardInput);
clearBtn.addEventListener('click', clearForm);
deleteBtns.forEach(btn => btn.addEventListener('click', function(){ deleteBook(this.dataset.reference) }));

//because buttons are generated after the event listener is set, need to recheck for buttons each time table items are added
function reselectButtons(){
    deleteBtns = document.querySelectorAll('.delete-icon')
    deleteBtns.forEach(btn => btn.addEventListener('click', function(){ deleteBook(this.dataset.reference) }));
}

let myLibrary = [];

//constructor object for creating new book object
function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.visibleInLibrary = false;
}

function addBookToLibrary(book, author, pages, read){
    const newBook = new Book(book, author, pages, read);
    myLibrary.push(newBook);
    generateTableContents();

}

//event executed on submission of the form to retrieve values 
function handleFormInput(event){
    //stop the form from submitting
    event.preventDefault();

    const book = this.bookName.value;
    const author = this.authorName.value;
    const pages = this.pageCount.value;
    let read ; 
    if (this.readStatus.value == 'yes') {
        read = 'Read';
    } else {
        read = 'Not Read';
    }

    //we now need to 1. add book, 2. get rid of the modal and 3. display book
    addBookToLibrary(book, author, pages, read);
    hideModal();
    clearForm();
    
}

function handleKeyboardInput(event){
    const enteredChar = event.key;

    //if the user is typing in an input field, stop the function
    if (event.target.tagName == "INPUT" && enteredChar != 'Escape') {
        return;
    }
    switch(enteredChar) {
        case 'Escape':
            hideModal();
            break;
        case 'n':
            displayModal();
            break;

    }
}

function displayModal(){
    const modal = document.getElementById('newBookModal');
    const application = document.getElementById('application-container');
    modal.style.display = 'flex';
    application.classList.add('body-blur');
}

function hideModal(){
    const modal = document.getElementById('newBookModal');
    const application = document.getElementById('application-container');
    modal.style.display = 'none';
    application.classList.remove('body-blur');

    //TBC if should also call clearForm() at this stage
}


//once book is submitted, the from should be cleared down for next time
function clearForm(){
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if(input.type == 'text' || input.type == 'number'){
            input.value = "";
        } 
    });

}

function generateTableContents(){
    const table = document.getElementById('bookList');

    //loop over each book in the library
    myLibrary.forEach(book => {
        //get reference to be added to action icons
        const bookReference = myLibrary.indexOf(book);

        //check if the book is already rendered and return if so
        //otherwise go on to render it
        if(book.visibleInLibrary) {
            return;
        }
       
        const row = document.createElement('tr');
   
        //then loop over each key in the object
        Object.keys(book).forEach(key => {
            //omit the visible key as we don't want that displayesd
            if(key !== 'visibleInLibrary') {
                row.innerHTML += `<td>${book[key]}</td>`;
            }
        })

        //then add on the action buttons
        row.innerHTML += `<td><div class="icon-container"><i class="fa-regular fa-pen-to-square edit-icon" data-reference="${bookReference}"></i><i class="fa-regular fa-trash-can delete-icon" data-reference="${bookReference}"></i></div></td>`;
        //add the book to the table then mark it as visible
        table.appendChild(row);
        book.visibleInLibrary = true;

        //calls fucntion to include newly created buttons for event listener
        reselectButtons();

    })
}



//add function to delete a book
function deleteBook(reference) {

    const libraryReference = parseInt(reference);
    const tableReference = libraryReference+1;

    myLibrary.splice(reference, 1);
    console.log(myLibrary);

    const table = document.getElementById('bookList');

    //doesn't work because table positoon will change
    console.log(table.rows[tableReference]);
    table.rows[tableReference].innerHTML ='';


}
//function changeReadStatus

addBookToLibrary('The Hobbit', 'Tolkien', '304', 'Read');


