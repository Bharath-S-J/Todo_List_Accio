let todoList = JSON.parse(localStorage.getItem("todos")) || [];

function saveList() {
  localStorage.setItem("todos", JSON.stringify(todoList));
}

function addItem() {
  const name = document.getElementById("item-name").value.trim();
  const date = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;
  if (!name || !date || priority === "Priority") return;

  todoList.push({ name, date, priority, completed: false });
  saveList();
  renderTasks();

  document.getElementById("item-name").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("priority").value = "Priority";
}

function deleteItem(index) {
  todoList.splice(index, 1);
  saveList();
  renderTasks();
}

function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  saveList();
  renderTasks();
}

function renderTasks() {
  const todayEl = document.getElementById("today-tasks");
  const futureEl = document.getElementById("future-tasks");
  const completedEl = document.getElementById("completed-tasks");

  todayEl.innerHTML = "";
  futureEl.innerHTML = "";
  completedEl.innerHTML = "";

  const today = new Date().toLocaleDateString('en-CA');

  // Separate tasks into categories
  const todayTasks = todoList.filter(task => !task.completed && task.date === today);
  const futureTasks = todoList.filter(task => !task.completed && task.date > today);
  const completedTasks = todoList.filter(task => task.completed);

  // Priority order for sorting
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  // Sort each category by priority
  todayTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  futureTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  completedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Helper to create task div with buttons
  function createTaskDiv(task, index, number, categoryEl, completed = false) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    if (completed) taskDiv.classList.add("completed-task");

    taskDiv.innerHTML = `
      <div class="task-number">${number}.</div>
      <div class="task-name">${task.name}</div>
      <div class="task-date">${task.date}</div>
      <div class="task-priority">Priority: ${task.priority.toUpperCase()}</div>
    `;

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.innerHTML = "🗑️";
    delBtn.title = "Delete Task";
    delBtn.onclick = () => deleteItem(index);

    taskDiv.appendChild(delBtn);

    // Complete button only for uncompleted tasks
    if (!completed) {
      const checkBtn = document.createElement("button");
      checkBtn.className = "icon-btn";
      checkBtn.innerHTML = "✅";
      checkBtn.title = "Mark as Complete";
      checkBtn.onclick = () => toggleComplete(index);
      taskDiv.appendChild(checkBtn);
    }

    categoryEl.appendChild(taskDiv);
  }

  // Render each category with numbering and original index reference
  todayTasks.forEach((task, i) => {
    const originalIndex = todoList.indexOf(task);
    createTaskDiv(task, originalIndex, i + 1, todayEl);
  });

  futureTasks.forEach((task, i) => {
    const originalIndex = todoList.indexOf(task);
    createTaskDiv(task, originalIndex, i + 1, futureEl);
  });

  completedTasks.forEach((task, i) => {
    const originalIndex = todoList.indexOf(task);
    createTaskDiv(task, originalIndex, i + 1, completedEl, true);
  });
}

renderTasks();
