//get UI elements
const myform = document.getElementById('newBookForm');
const modalToggles = document.querySelectorAll('.toggleModal')
const closeBtn = document.getElementById('closeModal');
const newFormBtn = document.getElementById('newBook');
const clearBtn = document.getElementById('clearForm');
const bookList = document.getElementById('bookList');

//event listeners to handle inputs
myform.addEventListener('submit', handleFormInput);
closeBtn.addEventListener('click', hideModal);
newFormBtn.addEventListener('click', displayModal);
window.addEventListener('keydown', handleKeyboardInput);
clearBtn.addEventListener('click', clearForm);
bookList.addEventListener('click', function(event) {
    const bookTitle = event.target.dataset.reference;
    //find the specific row to be deleted and the object index in array
    const updateFields = findBookToUpdate(bookTitle);

    //since the listener is on the entire table, check the target and execute function dependent on button clicked
    if (event.target.classList.contains('delete-icon')) {
        deleteBook(updateFields, bookTitle);
    }
    if (event.target.classList.contains('edit-icon')) {
        myLibrary[`${updateFields.bookToEdit}`].toggleRead(updateFields.rowToBeEdited);
    }
})

let myLibrary = [];

//constructor object for creating new book object
function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.visibleInLibrary = false;
}

//prototype function to toggle if the book is read or not
//updates both the array object and the table that displays results
Book.prototype.toggleRead = function (updateFields){
    if(this.read == 'Read'){
        this.read = 'Unread';
        updateFields.cells[3].innerHTML = 'Unread';
    } else {
        this.read = 'Read';
        updateFields.cells[3].innerHTML = 'Read';
    }
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
        case '+':
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
        const bookReference = book.title;

        //check if the book is already rendered and return if so
        //otherwise go on to render it
        if(book.visibleInLibrary) {
            return;
        }
   
        //insert a new row and at end (-1) and then set the id as the array index
        const row = table.insertRow(-1);
        row.setAttribute('id', `${bookReference}`)

        //then loop over each key in the object
        Object.keys(book).forEach(key => {
            //omit the visible key as we don't want that displayesd
            if(key !== 'visibleInLibrary') {
                let cell = row.insertCell() 
                cell.innerHTML = `${book[key]}`
            }
        })

        //then add on the action buttons
        row.innerHTML += `<td><div class="icon-container"><i class="fa-regular fa-pen-to-square edit-icon" data-reference="${bookReference}"></i><i class="fa-regular fa-trash-can delete-icon" data-reference="${bookReference}"></i></div></td>`;
        //add the book to the table then mark it as visible
        table.appendChild(row);
        book.visibleInLibrary = true;

    })
}

//returns the index number of the object in array and the row item to be updated in table
function findBookToUpdate(reference){
    //get the row with the matching title
    const rowToBeEdited = document.getElementById(`${reference}`);
    //search the array for object with matching title and return the index number
    const bookToEdit = myLibrary.map(b => b.title).indexOf(`${reference}`);
    return({rowToBeEdited, bookToEdit});

}


//add function to delete a book
function deleteBook(updateFields, bookTitle) {
    
    if (confirm(`Are you sure you want to delete ${bookTitle}?`)) {
        //remove the book from library
        myLibrary.splice(updateFields.bookToEdit, 1);
        updateFields.rowToBeEdited.remove();
    }
}


//initalise the app with some dummy books for demo purpose
addBookToLibrary('The Hobbit', 'Tolkien', '304', 'Read');
addBookToLibrary('A Game of Thrones', 'G.R.R Martin', '304', 'Read');
addBookToLibrary('A Tale of Two Cities', 'Charles Dickens', '304', 'Read');
addBookToLibrary('A fantasy book', 'Brandon Sanderson', '304', 'Read');


