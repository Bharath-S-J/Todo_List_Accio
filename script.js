let todoList = JSON.parse(localStorage.getItem("todos")) || [];

function saveList() {
  localStorage.setItem("todos", JSON.stringify(todoList));
}

function addItem() {
  const name = document.getElementById("item-name").value.trim();
  const date = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;
  if (!name || !date || priority == "Priority") return;

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

  todayEl.innerHTML = futureEl.innerHTML = completedEl.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  const sortedList = todoList.slice().sort((a, b) => {
    const p = { high: 1, medium: 2, low: 3 };
    return p[a.priority] - p[b.priority];
  });

  let todayCount = 1, futureCount = 1, completedCount = 1;

  sortedList.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    taskDiv.innerHTML = `
      <div class="task-number">${task.completed ? completedCount : (task.date === today ? todayCount : futureCount)}.</div>
      <div class="task-name">${task.name}</div>
      <div class="task-date">${task.date}</div>
      <div class="task-priority"> Priority: ${task.priority.toUpperCase()}</div>
    `;

    // Buttons
    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.innerHTML = "🗑️";
    delBtn.title = "Delete Task";
    delBtn.onclick = () => deleteItem(index);

    if (task.completed) {
      taskDiv.classList.add("completed-task");
      taskDiv.appendChild(delBtn);
      completedEl.appendChild(taskDiv);
      completedCount++;
    } else if (task.date === today) {
      const checkBtn = document.createElement("button");
      checkBtn.className = "icon-btn";
      checkBtn.innerHTML = "✅";
      checkBtn.title = "Mark as Complete";
      checkBtn.onclick = () => toggleComplete(index);

      taskDiv.appendChild(checkBtn);
      taskDiv.appendChild(delBtn);
      todayEl.appendChild(taskDiv);
      todayCount++;
    } else if (task.date > today) {
      const checkBtn = document.createElement("button");
      checkBtn.className = "icon-btn";
      checkBtn.innerHTML = "✅";
      checkBtn.title = "Mark as Complete";
      checkBtn.onclick = () => toggleComplete(index);

      taskDiv.appendChild(checkBtn);
      taskDiv.appendChild(delBtn);
      futureEl.appendChild(taskDiv);
      futureCount++;
    }
  });
}

renderTasks();
