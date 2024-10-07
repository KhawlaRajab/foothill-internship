'use strict';
const list = document.querySelector('.list');
const addBtn = document.querySelector('.addBtn');
const content = document.querySelector('.content');
const taskNum = document.querySelector('.count');
const tab = document.querySelector('.deleteConfirmation');
const cancel = document.querySelector('.cancel');
const confirmDeleteBtn = document.querySelector('.ok');
const searchInput = document.querySelector('.search');
let todoItems = [];
let count = 0, idx=0;

const loadFromLocalStorage = function () {
    //get task from local storage
    const tasks = window.localStorage.getItem('tasks');
    // if there are tasks in local storage then retrive them
    if (tasks) {
        todoItems = JSON.parse(tasks);
        idx = todoItems[todoItems.length - 1];
        todoItems.forEach(element => {
            createItem(element, false); 
        });
        count = todoItems.length; 
        taskNum.innerHTML = 'total:' + count; 
    }
    // if there is no task in local storage then retreive the tasks from api
    else retrieveToDo();
};

const createItem = function (element,addedToArray) {
     const item = document.createElement('div');
     item.classList.add('item');          
    
     const task = document.createElement('div');
     task.classList.add('task');
     task.dataset.id = element.id;

     const checkbox = document.createElement('input');
     checkbox.type = 'checkbox';
     checkbox.checked = element.completed;

     const taskcontent = document.createElement('p');
            
     taskcontent.textContent = element.todo;
     if (checkbox.checked) taskcontent.classList.add('check');
     task.append(checkbox, taskcontent);

     const buttons = document.createElement('div');
     buttons.classList.add('buttons');
     const del = document.createElement('button');
     del.textContent = 'delete';
     del.classList.add('delete');
     const edit = document.createElement('button');
     edit.textContent = 'edit';
     edit.classList.add('edit');
     buttons.append(del, edit);

     item.append(task, buttons);

     list.append(item);
     // to prevent dupluicate items in the array and the list
     if (addedToArray) {
        //put tasks in the array 
        todoItems.push(element);
        count++;
        taskNum.innerHTML = 'total:' + count;
    }

}


//retrieve tasks
//done
const retrieveToDo = function () {
    const request = fetch('https://dummyjson.com/todos');
    request.then(response => response.json())
        .then(data => {
            const todo = data.todos;
            // make the idx = the id of the last task to make the new task start with the idx+1
            idx = todo[todo.length - 1].id;
            todo.forEach(element => {
                createItem(element,true);
            });
            addToLocalStorage(todoItems);
        }).catch(error => console.log(error));   
}

loadFromLocalStorage();

//add task
//done
addBtn.addEventListener('click', function () {
    let val = content.value;
    if (val === '') return;

    const element = {
        id: ++idx,
        todo: val,
        completed: false,
        userId :0
    };
    
    createItem(element, true);
 //   console.log(todoItems);
    addToLocalStorage(todoItems);
    content.value = '';
});


//delete task
//done
list.addEventListener('click', function (e) {
    if (e.target.matches('.delete')) {
        // delete confirmation
        let delTask = e.target.parentNode.parentNode;
        tab.style.display = 'block';

        cancel.addEventListener('click', function () {
            tab.style.display = 'none';
        });

        
        confirmDeleteBtn.addEventListener('click', function () {
            // to solve the previous problem ('when i click on delete button it will execute the handler many time so i need to check if the task is the taask that i want to delete it and the change its value to null)
            if (delTask) {
                delTask.classList.add('del');
                tab.style.display = 'none';
                // if i use taskidx to dlete the item from the array then it will delete the wrong item because when i delete an item then the index of the items which after it will decrease so i need to know the real posittion in the array using findIndex method
                const taskIdx = delTask.firstChild.dataset.id;
                const index = todoItems.findIndex(item => item.id == taskIdx);
                todoItems.splice(index, 1);
                delTask.remove();
                // count--;
                taskNum.innerHTML = 'total:' + todoItems.length;
                delTask = null;
                addToLocalStorage(todoItems);
            }
        });
    }
});




//mark task as done
//done
list.addEventListener('click', function (e) {
    const elem = e.target;
    const parent = elem.parentNode;
    if (elem.matches('[type="checkbox"]')) {
        const task = todoItems.find(item => item.id == parent.dataset.id)
        task.completed = elem.checked;
        elem.checked ? parent.lastChild.classList.add('check') : parent.lastChild.classList.remove('check');
        addToLocalStorage(todoItems);
    }

});


//search task
//done
searchInput.addEventListener('input', function () {
    list.innerHTML = '';
    const taskCont = searchInput.value.toLowerCase();
    const searchedTask = todoItems.filter(ele => ele.todo.toLowerCase().startsWith(taskCont));
    searchedTask.forEach(elem => createItem(elem, false));
});

const addToLocalStorage = function (arr) {
    window.localStorage.setItem('tasks', JSON.stringify(arr));
}