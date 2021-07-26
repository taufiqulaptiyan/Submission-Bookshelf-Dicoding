const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function makeBook(title,author, timestamp, isCompleted) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;
    
    const textAuthor = document.createElement("h3");
    textAuthor.innerText = author;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeBookFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const textTitle = document.getElementById("title").value;
    const textAuthor = document.getElementById("author").value;
    const timestamp = document.getElementById("date").value;

    const book = makeBook(textTitle,textAuthor, timestamp, false);
    const bookObject = composeBookObject(textTitle,textAuthor,timestamp, false);
    
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedBOOKList.append(book);
    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner > h2").innerText;
    const bookAuthor = bookElement.querySelector(".inner > h3").innerText;
    const bookTimestamp = bookElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(bookTitle,bookAuthor,bookTimestamp, true);
    

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function removeBookFromUnCompleted(bookElement) {

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner > h2").innerText;
    const bookAuthor = bookElement.querySelector(".inner > h3").innerText;
    const bookTimestamp = bookElement.querySelector(".inner > p").innerText;
    
    const newBook = makeBook(bookTitle,bookAuthor,bookTimestamp, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();
    
    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for(book of books){
        const newBook = makeBook(book.title,book.author, book.timestamp, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isCompleted){
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}
