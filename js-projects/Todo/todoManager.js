// todoManager.js (non-OOP, functional style)
// Handles all todo and task logic, localStorage, and DOM updates

const todoManager = (function() {
    const minTodoHeight = 420;
    const padding = 32;
    let todoBox;

    function init(todoBoxId) {
        todoBox = document.getElementById(todoBoxId);
        loadTodos();
    }

    function loadTodos() {
        todoBox.innerHTML = '';
        const todoIDs = Object.keys(localStorage).filter(key => !isNaN(Number(key)));
        todoIDs.sort((a, b) => Number(a) - Number(b));
        if (todoIDs.length === 0) {
            showEmptyMessage();
            return;
        }
        todoIDs.forEach(renderTodo);
    }

    function showEmptyMessage() {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-todo-msg';
        emptyMsg.textContent = 'Click the add button below to add a todo';
        emptyMsg.style.cssText = 'color:#888;text-align:center;font-size:1.2em;padding:2em 0;letter-spacing:0.5px;';
        todoBox.appendChild(emptyMsg);
    }

    function renderTodo(todoID) {
        const data = JSON.parse(localStorage[todoID]);
        const todoDiv = document.createElement('div');
        todoDiv.className = 'todo';
        todoDiv.id = todoID;
        if (data.color) {
            todoDiv.style.backgroundColor = data.color;
        }
        todoDiv.innerHTML = `
            <div class="title">
                <input type="text" name="todoTitle" placeholder="Enter Todo's Title" value="${data.title || 'Untitled Todo'}" class="todoTitle">
                <div>
                    <img src="assets/add.svg" alt="" class="addTask pointer">
                    <img src="assets/more.svg" alt="" class="more pointer">
                </div>
            </div>
            <div class="taskBox"></div>
        `;
        // Render tasks
        const taskBox = todoDiv.querySelector('.taskBox');
        if (Array.isArray(data.tasks)) {
            data.tasks.forEach(task => {
                const newTask = createTaskElement(task.value, task.checked, data.color);
                taskBox.appendChild(newTask);
            });
        }
        todoBox.appendChild(todoDiv);
        attachTodoEvents(todoDiv, data.color);
        setTodoTitleStyle(todoDiv, data.color);
        autoExpandAllTaskvalues(todoDiv);
    }

    function createTaskElement(value = '', checked = false, color = null) {
        const newTask = document.createElement('div');
        newTask.className = 'task';
        newTask.innerHTML = `
            <img src="assets/cross.svg" alt="" class="removeTask pointer">
            <input type="checkbox" name="task" class="check" ${checked ? 'checked' : ''}>
            <textarea name="task" class="taskvalue" rows="1">${(value || '').trim()}</textarea>
        `;
        const taskValueInput = newTask.querySelector('.taskvalue');
        if (color) {
            const bg = darkenColor(color, 40);
            const textColor = isDarkColor(bg) ? '#fff' : '#222';
            taskValueInput.style.color = textColor;
        }
        // Attach events
        taskValueInput.addEventListener('input', function() {
            autoExpandTextarea(this);
        });
        taskValueInput.addEventListener('blur', function() {
            trimAndSaveTaskValue(this);
        });
        return newTask;
    }

    function attachTodoEvents(todoDiv, color) {
        // Title change
        const todoTitleInput = todoDiv.querySelector('.todoTitle');
        todoTitleInput.addEventListener('input', function() {
            const todoID = todoDiv.id;
            todoTitleInput.classList.add('edited');
            setTimeout(() => todoTitleInput.classList.remove('edited'), 1000);
            if(localStorage[todoID] == null){
                localStorage[todoID] = JSON.stringify({ title: 'Untitled Todo', tasks: [] });
            }
            const data = JSON.parse(localStorage[todoID]);
            data.title = todoTitleInput.value;
            localStorage[todoID] = JSON.stringify(data);
        });
        // Add task
        todoDiv.querySelector('.addTask').addEventListener('click', function() {
            addTask(todoDiv);
        });
        // Remove task
        todoDiv.querySelectorAll('.removeTask').forEach(function(btn) {
            btn.addEventListener('click', function(event) {
                removeTask(event.target.closest('.task'), todoDiv);
            });
        });
        // Checkbox change
        todoDiv.querySelectorAll('.check').forEach(function(checkbox) {
            checkbox.addEventListener('change', function(event) {
                saveTaskChecked(event.target, todoDiv);
            });
        });
        // More (dropdown)
        todoDiv.querySelector('.more').addEventListener('click', function(event) {
            showDropdown(event, todoDiv);
        });
    }

    function addTask(todoDiv) {
        const todoID = todoDiv.id;
        const taskBox = todoDiv.querySelector('.taskBox');
        const newTask = createTaskElement('', false, JSON.parse(localStorage[todoID]).color);
        taskBox.appendChild(newTask);
        saveTaskToLocalStorage(todoID, '');
        autoExpandAllTaskvalues(todoDiv);
        // Attach remove and checkbox events
        newTask.querySelector('.removeTask').addEventListener('click', function(event) {
            removeTask(event.target.closest('.task'), todoDiv);
        });
        newTask.querySelector('.check').addEventListener('change', function(event) {
            saveTaskChecked(event.target, todoDiv);
        });
        // Attach blur event for trimming (in case it was missed)
        newTask.querySelector('.taskvalue').addEventListener('blur', function() {
            trimAndSaveTaskValue(this);
        });
        // Force trimming and saving immediately after creation
        trimAndSaveTaskValue(newTask.querySelector('.taskvalue'));
    }

    function removeTask(taskDiv, todoDiv) {
        const todoID = todoDiv.id;
        const taskBox = todoDiv.querySelector('.taskBox');
        const tasks = Array.from(taskBox.children);
        const index = tasks.indexOf(taskDiv);
        taskDiv.remove();
        if (localStorage[todoID]) {
            const data = JSON.parse(localStorage[todoID]);
            data.tasks.splice(index, 1);
            localStorage[todoID] = JSON.stringify(data);
        }
        autoExpandAllTaskvalues(todoDiv);
    }

    function saveTaskToLocalStorage(todoID, value) {
        let data = { title: 'Untitled Todo', tasks: [] };
        if (localStorage[todoID]) {
            data = JSON.parse(localStorage[todoID]);
        }
        data.tasks.push({ value: (value || '').trim(), checked: false });
        localStorage[todoID] = JSON.stringify(data);
    }

    function saveTaskChecked(checkbox, todoDiv) {
        const todoID = todoDiv.id;
        const taskBox = todoDiv.querySelector('.taskBox');
        const tasks = Array.from(taskBox.children);
        const taskDiv = checkbox.closest('.task');
        const index = tasks.indexOf(taskDiv);
        if (localStorage[todoID]) {
            const data = JSON.parse(localStorage[todoID]);
            if (data.tasks[index]) {
                data.tasks[index].checked = checkbox.checked;
                localStorage[todoID] = JSON.stringify(data);
            }
        }
    }

    function showDropdown(event, todoDiv) {
        document.querySelectorAll('.todoDropdown').forEach(function(el) { el.remove(); });
        const dropdown = document.createElement('div');
        dropdown.className = 'todoDropdown';
        const rect = event.target.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        dropdown.style.left = (rect.left + window.scrollX - 30) + 'px';
        dropdown.innerHTML = `
            <div class="deleteTodo">Delete Todo</div>
            <div class="colorPicker" style="position:relative;">
                <button class="showColorPickerBtn modern-btn" type="button" tabindex="0">Change Color</button>
                <input type="color" class="todoColorInput" value="#fff8dc" style="display:none; position:absolute; left:0; top:110%; z-index:1001;visibility: hidden;">
            </div>
        `;
        document.body.appendChild(dropdown);
        // Delete todo
        dropdown.querySelector('.deleteTodo').addEventListener('click', function() {
            todoDiv.remove();
            localStorage.removeItem(todoDiv.id);
            dropdown.remove();
            if (Object.keys(localStorage).filter(key => !isNaN(Number(key))).length === 0) {
                showEmptyMessage();
            }
        });
        // Color picker
        const colorInput = dropdown.querySelector('.todoColorInput');
        const showColorBtn = dropdown.querySelector('.showColorPickerBtn');
        showColorBtn.addEventListener('click', function() {
            colorInput.style.display = 'block';
            colorInput.style.position = 'absolute';
            colorInput.style.left = showColorBtn.offsetLeft + 'px';
            colorInput.style.top = (showColorBtn.offsetTop + showColorBtn.offsetHeight + 6) + 'px';
            colorInput.focus();
            setTimeout(() => colorInput.click(), 0);
        });
        colorInput.addEventListener('blur', function() {
            colorInput.style.display = 'none';
        });
        colorInput.addEventListener('input', function(e) {
            const color = e.target.value;
            todoDiv.style.backgroundColor = color;
            if (localStorage[todoDiv.id]) {
                const data = JSON.parse(localStorage[todoDiv.id]);
                data.color = color;
                localStorage[todoDiv.id] = JSON.stringify(data);
            }
            setTodoTitleStyle(todoDiv, color);
            todoDiv.querySelectorAll('.taskvalue').forEach(function(taskValueInput) {
                const bg = darkenColor(color, 40);
                const textColor = isDarkColor(bg) ? '#fff' : '#222';
                taskValueInput.style.color = textColor;
            });
        });
        // Set color picker to current color
        if (localStorage[todoDiv.id]) {
            const data = JSON.parse(localStorage[todoDiv.id]);
            if (data.color) {
                colorInput.value = data.color;
                todoDiv.style.backgroundColor = data.color;
            }
        }
        // Remove dropdown if clicked elsewhere
        const removeDropdown = function(e) {
            if (!dropdown.contains(e.target) && e.target !== event.target) {
                dropdown.remove();
                document.removeEventListener('mousedown', removeDropdown);
            }
        };
        setTimeout(function() {
            document.addEventListener('mousedown', removeDropdown);
        }, 0);
    }

    function setTodoTitleStyle(todoDiv, color) {
        const todoTitleInput = todoDiv.querySelector('.todoTitle');
        if (color && todoTitleInput) {
            const bg = darkenColor(color, 40);
            const textColor = isDarkColor(bg) ? '#fff' : '#222';
            todoTitleInput.style.backgroundColor = bg;
            todoTitleInput.style.color = textColor;
        }
    }

    function darkenColor(hex, amt = 30) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        let num = parseInt(c, 16);
        let r = Math.max(0, (num >> 16) - amt);
        let g = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        let b = Math.max(0, (num & 0x0000FF) - amt);
        return `rgb(${r},${g},${b})`;
    }
    function isDarkColor(rgbStr) {
        const rgb = rgbStr.match(/\d+/g).map(Number);
        return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) < 128;
    }
    function autoExpandAllTaskvalues(todoDiv) {
        todoDiv.querySelectorAll('.taskvalue').forEach(function(textarea) {
            autoExpandTextarea(textarea);
        });
    }
    function autoExpandTextarea(textarea) {
        textarea.style.height = '1.8em';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        const taskBox = textarea.closest('.taskBox');
        const todoDiv = textarea.closest('.todo');
        if (taskBox && todoDiv) {
            todoDiv.style.height = 'auto';
            todoDiv.style.transition = 'height 0.18s cubic-bezier(0.4,0,0.2,1)';
            const title = todoDiv.querySelector('.title');
            const titleHeight = title ? title.offsetHeight : 0;
            const taskBoxHeight = taskBox.offsetHeight;
            const required = titleHeight + taskBoxHeight + padding;
            if (required > minTodoHeight) {
                todoDiv.style.height = required + 'px';
            } else {
                todoDiv.style.height = minTodoHeight + 'px';
            }
        }
    }
    function trimAndSaveTaskValue(textarea) {
        if (textarea.classList && textarea.classList.contains("taskvalue")) {
            const todoDiv = textarea.closest('.todo');
            const todoID = todoDiv.id;
            const taskBox = todoDiv.querySelector('.taskBox');
            const tasks = Array.from(taskBox.children);
            const taskDiv = textarea.closest('.task');
            const index = tasks.indexOf(taskDiv);
            if (localStorage[todoID]) {
                const data = JSON.parse(localStorage[todoID]);
                if (data.tasks[index]) {
                    const trimmed = (textarea.value || textarea.textContent || textarea.innerText).trim();
                    data.tasks[index].value = trimmed;
                    textarea.value = trimmed;
                    localStorage[todoID] = JSON.stringify(data);
                    autoExpandTextarea(textarea);
                    // Rerender this todo to reflect trimmed value immediately
                    todoDiv.replaceWith(createRerenderedTodo(todoID));
                }
            }
        }
    }

    // Helper to rerender a single todo by ID and return the new DOM node
    function createRerenderedTodo(todoID) {
        const tempDiv = document.createElement('div');
        renderTodo(todoID);
        // renderTodo appends to todoBox, so get the last child
        const newTodo = todoBox.lastElementChild;
        tempDiv.appendChild(newTodo);
        return newTodo;
    }

    // Expose public API
    return {
        init,
        loadTodos,
        renderTodo
    };
})();

window.todoManager = todoManager;
