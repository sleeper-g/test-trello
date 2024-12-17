const board = document.querySelector('.board');
const columns = board.querySelectorAll('.column');

const saveListOfTasks = () => {
    const taskList = board.querySelector('.taskList');
    const todo = [...taskList[0]];
    const inprogress = [...taskList[1]];
    const done = [...taskList[2]];
    localStorage.setItem("tasks", JSON.stringify([todo, inprogress, done]));
};

const addInput = (event) => {
    const newCardForm = document.createElement('form');
    newCardForm.classList.add('columnAddForm');
    newCardForm.innerHTML = `
    <textarea class="addFormText" type="text"
    placeholder="Enter a title for this card"></textarea>
    <div class="addCardForm">
        <button class="addCardBtn">Add Card</button>
        <button class="closeCardBtn">🗙</button>
    </div>`
    const closestColumn = event.target.closest(".column");
    event.target.replaceWith(newCardForm);

    const addCardBtn = closestColumn.querySelector('.addCardBtn');
    addCardBtn.addEventListener("click", addNewCard);

    const closeCardBtn = closestColumn.querySelector('.closeCardBtn');
    closeCardBtn.addEventListener("click", closeNewCard);
}

const deleteCard = (el) => {
    const taskElem = el.target.closest('.taskElem')
    const taskList = el.target.closest('.taskList')
    taskList.removeChild(taskElem);
};

const addNewCard = (el) => {
    el.preventDefault();
    const closestColumn = el.target.closest('.column');
    const cardTextValue = closestColumn.querySelector('.addFormText').value;
    if (!cardTextValue) {
        alert('Card is empty')
        return 0;
    }

    const closestTaskList = closestColumn.querySelector('.taskList');
    const taskElem = document.createElement('li');
    taskElem.classList.add('taskElem');
    taskElem.textContent = cardTextValue;
    const deleteCardEl = document.createElement('div');
    deleteCardEl.classList.add('deleteCard');
    deleteCardEl.textContent = '🗙'    
    closestTaskList.appendChild(taskElem);
    taskElem.appendChild(deleteCardEl);

    deleteCardEl.addEventListener("click", deleteCard);

};

const closeNewCard = (el) => {
    el.preventDefault();

    const closestColumn = el.target.closest('.column');
    const columnAddForm = closestColumn.querySelector('.columnAddForm');

    const addCard = document.createElement('div');
    addCard.classList.add('addCard')
    addCard.innerText = '+ Add another card'

    columnAddForm.replaceWith(addCard);
    addCard.addEventListener("click", addInput);
}

let actualElement
const onMouseUp = (el) => {
    const mouseUpColumn = el.target.closest('.column') && 
        el.target.closest('.column').querySelector('.taskList');

    actualElement.classList.remove('dragged'); 
    actualElement = null;

    document.documentElement.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeEventListener('mouseover', onMouseOver);
};
const onMouseOver = (event) => {
    actualElement.style.top = event.clientY + 'px';
    actualElement.style.left = event.clientX - board.getBoundingClientRect().x + 'px';
}

board.addEventListener('mousedown', (el) => {
    actualElement = el.target;

    if (!actualElement.classList.contains('taskElem')){
        return 0
    }
    el.preventDefault();
    actualElement.classList.add('dragged');
    document.documentElement.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseover', onMouseOver);
});

const addCardEl = board.querySelectorAll(".addCard");
[...addCardEl].forEach( el => el.addEventListener("click", addInput));
window.addEventListener("beforeunload", saveListOfTasks);