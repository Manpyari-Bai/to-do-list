document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const resetBtn = document.getElementById('resetBtn');


    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task.text, task.completed));

    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTaskToList(taskText, false);
            saveTaskToLocalStorage(taskText, false);
            taskInput.value = '';
        }
    });

    function addTaskToList(taskText, completed) {
        const li = document.createElement('li');
        if (completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed');
            updateTaskCompletionInLocalStorage(taskText, checkbox.checked);
        });

        const span = document.createElement('span');
        span.textContent = taskText;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            editTask(li, span, taskText);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '';
        deleteButton.addEventListener('click', function() {
            li.remove();
            removeTaskFromLocalStorage(taskText);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }


    function editTask(li, span, oldText) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        li.insertBefore(input, span);
        li.removeChild(span);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', function() {
            const newText = input.value.trim();
            if (newText !== '') {
                span.textContent = newText;
                li.insertBefore(span, input);
                li.removeChild(input);
                li.removeChild(saveButton);
                li.appendChild(editButton);

                updateTaskTextInLocalStorage(oldText, newText);
            }
        });

        li.appendChild(saveButton);
        li.removeChild(editButton);
    }

    function saveTaskToLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, completed: completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskCompletionInLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.text === taskText) {
                task.completed = completed;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskTextInLocalStorage(oldText, newText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.text === oldText) {
                task.text = newText;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    resetBtn.addEventListener('click', function() {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
    });
});
