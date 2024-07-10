let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const addTaskButton = document.getElementById('#addTaskButton');
const taskModal = document.getElementById('taskModal');
const saveTaskButton = document.getElementById('#save-button');
const closeButtonX = document.querySelector('.close')
const closeButton = document.getElementById('#close-button')
const taskTitleEl = getElementById('#inputTaskTitle')
const taskDescrEl = getElementById('#inputTaskDescription')
const taskDueDateEl = getElementById('#inputDueDate')


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
    
    $('.draggable').draggable({
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

function handleAddTask(event){
    event.preventDefault();

    const taskTitle = taskTitleEl.val().trim();
    const taskDescr = taskDescrEl.val().trim();
    const taskDueDate = taskDueDateEl.val();
    
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

    taskTitleEl.val('');
    taskDescrEl.val('');
    taskDueDateEl.val('');
}

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

saveTaskButton.addEventListener('click', handleAddTask);

addTaskButton.addEventListener('click', () => {
    taskModal.style.display = 'block';
})

closeButton.addEventListener('click', () => {
    taskModal.style.display = 'none';
})

closeButtonX.addEventListener('click', () => {
    taskModal.style.display = 'none';
})

$(document).ready(function () {
    renderTaskList();
    
    $('#inputDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});
