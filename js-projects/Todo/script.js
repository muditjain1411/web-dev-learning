// script.js
// Entry point: initializes todoManager and binds addTodo button

document.addEventListener('DOMContentLoaded', function() {
    // Initialize todoManager (functional, not OOP)
    todoManager.init('todoBox');

    // Add Todo functionality for addTodo image
    const addTodoImg = document.querySelector('.addTodo');
    if (addTodoImg) {
        addTodoImg.addEventListener('click', () => {
            // Find the next available ID
            let nextId = 1;
            while (document.getElementById(String(nextId)) || localStorage[String(nextId)]) {
                nextId++;
            }
            // Save to localStorage
            localStorage[String(nextId)] = JSON.stringify({ title: 'Untitled Todo', tasks: [] });
            // Render the new todo
            todoManager.renderTodo(String(nextId));
            // Remove empty message if present
            const emptyMsg = document.querySelector('.empty-todo-msg');
            if (emptyMsg) emptyMsg.remove();
        });
    }
});
