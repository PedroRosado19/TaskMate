const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// --- Add Task ---
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return alert("Please enter a task!");
  
  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveAndRender();
});

// --- Toggle Complete ---
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

// --- Delete Task ---
function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

// --- Save & Render ---
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// --- Render Tasks ---
function renderTasks() {
  taskList.innerHTML = "";
  let completed = 0;

  tasks.forEach((task, i) => {
    const div = document.createElement("div");
    div.classList.add("task-item");
    if (task.completed) div.classList.add("completed");

    div.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${i})">
      <span>${task.text}</span>
      <button onclick="deleteTask(${i})">🗑️</button>
    `;
    taskList.appendChild(div);

    if (task.completed) completed++;
  });

  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `Progress: ${percent}% Complete`;
}

// --- Load on start ---
renderTasks();
