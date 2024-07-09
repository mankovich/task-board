// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const addTaskButton = document.getElementById('addTaskButton');
const taskModal = document.getElementById('taskModal');
const saveTaskButton = document.getElementById('saveTaskButton');
const closeButton = document.querySelector('.close')

//  create a function to generate a unique task id
// function generateTaskId() {
//     const taskId = {
//         id: crypto.randomUUID(),
//         title: taskTitle,
//         description: taskDescr,
//         dueDate: taskDueDate,
//         status: 'to-do'
//     }
//     return taskId
// }

// TODO: create a function to create a task card...Mini 37-71
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask)

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if(now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// create a function to render the task list and make cards draggable...Mini 73-113
function readTasksFromStorage() {
    if (!taskList) {
        taskList = [];
    }
    return taskList;
}

function renderTaskList() {
    const tasks = readTasksFromStorage();
    const toDoList = $('#todo-cards');
    toDoList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            toDoList.append(createTaskCard(task));
        } else if (project.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (project.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }
    
    $('draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function(e) {
            const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerwidth(),
            });
        },
    });
}

// create a function to handle adding a new task...Mini 135-165
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = $('#taskTitle').val().trim();
    const taskDescr = $('#taskDescription').val().trim();
    const taskDueDate = $('taskDueDate').val();

    
    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        description: taskDescr,
        dueDate: taskDueDate,
        status: 'to-do'
    }

    const tasks = readTasksFromStorage();
    tasks.push(newTask);

    saveTaskstoStorage(tasks);
    renderTaskList();

    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('taskDueDate').val('');
}

// create a function to handle deleting a task...see Mini ln 116-132
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1)
        }
    });

    saveTaskstoStorage(tasks);

    renderTaskList();
}

//  create a function to handle dropping a task into a new status lane...Mini 168-187
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker...Mini 189-190, 194, 197-198, 201-215
saveTaskButton.on('click', handleAddTask)

$(document).ready(function () {
    renderTaskList();
    addTaskButton.addEventListener('click', () => {
        taskModal.style.display = 'block';
    })

});
