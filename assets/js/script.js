// let nextId = JSON.parse(localStorage.getItem("nextId"));
const addTaskBtn = $('#add-task-btn');
const taskModal = $('#task-modal')
const modalHeader = $('.modal-header');
const modalFooter = $('.modal-footer')
const saveTaskBtn = $('#save-btn');
const closeBtnX = $('#x-close-btn')
const closeBtn = $('#close-btn')
const taskTitleInputEl = $('#input-task-title')
const taskDescrInputEl = $('#input-description')
const taskDueDateInputEl = $('#input-due-date')


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
        const taskDueDate = dayjs(task.dueDate, 'YYYY/MM/DD');

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

function readTasksFromStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    
    if (!tasks) {
        tasks = [];
    }
    return tasks;
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = readTasksFromStorage();
    
    const toDoList = $('#todo-cards');
    toDoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            toDoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }
    
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        
        helper: function(e) {
            const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target) 
            : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

function handleTaskSubmit(event) {
    event.preventDefault()

    const taskTitle = taskTitleInputEl.val().trim();
    const taskDescr = taskDescrInputEl.val().trim();
    const taskDueDate = taskDueDateInputEl.val();
    const newTaskId =  crypto.randomUUID();

    const newTask = {
        id: newTaskId,
        title: taskTitle,
        description: taskDescr,
        dueDate: taskDueDate,
        status: 'to-do',
    }

    const tasks = readTasksFromStorage();
    tasks.push(newTask);

    saveTasksToStorage(tasks);
    renderTasks();

    taskTitleInputEl.val('');
    taskDescrInputEl.val('');
    taskDueDateInputEl.val('');
}

function handleDeleteTask() {
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();
    
    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1)
        }
    });

    saveTasksToStorage(tasks);

    renderTasks();
}

function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    // console.log(event.target)
    const newStatus = event.target.id

    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

$(document).ready(function() {
    renderTasks();
    
    saveTaskBtn.on('click', handleTaskSubmit);

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});
