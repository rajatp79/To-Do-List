let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let taskList = document.getElementById("taskList");
let searchInput = document.getElementById("searchInput");

let taskCount = document.getElementById("taskCount");
let completedCount = document.getElementById("completedCount");
let progressFill = document.getElementById("progressFill");
let emptyState = document.getElementById("emptyState");

let currentFilter = "all";

/* =========================
   SAVE TO LOCAL STORAGE
========================= */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   RENDER TASKS
========================= */
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  let searchValue = searchInput.value.toLowerCase();

  filteredTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(searchValue)
  );

  filteredTasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.classList.add("task");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>

      <div>
        <button class="edit" onclick="editTask(${index})">✏️</button>
        <button class="delete" onclick="deleteTask(${index})">🗑</button>
        <button onclick="toggleComplete(${index})">✔</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateUI();
}

/* =========================
   ADD TASK
========================= */
function addTask() {
  let text = taskInput.value.trim();

  if (text === "") return alert("Task cannot be empty!");

  tasks.push({
    text: text,
    completed: false
  });

  taskInput.value = "";

  saveTasks();
  renderTasks();
}

/* Enter key support */
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

/* Button click */
addTaskBtn.addEventListener("click", addTask);

/* =========================
   DELETE TASK
========================= */
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

/* =========================
   EDIT TASK
========================= */
function editTask(index) {
  let newTask = prompt("Edit task:", tasks[index].text);

  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask.trim();
    saveTasks();
    renderTasks();
  }
}

/* =========================
   TOGGLE COMPLETE
========================= */
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", renderTasks);

/* =========================
   FILTERS
========================= */
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

/* =========================
   CLEAR ALL
========================= */
document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

/* =========================
   UPDATE UI (COUNTER + PROGRESS)
========================= */
function updateUI() {
  let total = tasks.length;
  let completed = tasks.filter(t => t.completed).length;

  taskCount.innerText = `Tasks: ${total}`;
  completedCount.innerText = `Completed: ${completed}`;

  let progress = total === 0 ? 0 : (completed / total) * 100;
  progressFill.style.width = progress + "%";

  emptyState.style.display = total === 0 ? "block" : "none";
}

/* =========================
   INITIAL LOAD
========================= */
renderTasks();