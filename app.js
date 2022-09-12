//get UI elements
const myform = document.getElementById('newBookForm');
const modalToggles = document.querySelectorAll('.toggleModal')
const closeBtn = document.getElementById('closeModal');
const newFormBtn = document.getElementById('newBook');
const clearBtn = document.getElementById('clearForm');

//event listeners to handle inputs
myform.addEventListener('submit', getFormInput);
closeBtn.addEventListener('click', hideModal);
newFormBtn.addEventListener('click', displayModal);
window.addEventListener('keydown', handleKeyboardInput);
clearBtn.addEventListener('click', clearForm);

let myLibrary = [];

//constructor object for creating new book object
function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
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



//event executed on submission of the form to retrieve values 
function getFormInput(event){
    //stop the form from submitting
    event.preventDefault();

    const book = this.bookName.value;
    const author = this.authorName.value;
    const pages = this.pageCount.value;
    const read = this.readStatus.value;

    //we now need to 1. add book, 2. get rid of the modal and 3. display book
    addBookToLibrary(book, author, pages, read);
    hideModal();
    clearForm();

}

function addBookToLibrary(book, author, pages, read){
    const newBook = new Book(book, author, pages, read);
    myLibrary.push(newBook);
    console.log(myLibrary);
}

//once book is submitted, the from should be cleared down for next time
function clearForm(){
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if(input.type == 'text' || input.type == 'number'){
            input.value = "";
        } else if (input.type == 'checkbox') {
            input.checked = false;  
        }
        
    });

}



//add function to delete a book

//function changeReadStatus

