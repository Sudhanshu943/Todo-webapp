// Select necessary DOM elements
const inputItem = document.getElementById("input-item");
const itemLists = document.getElementById("item-lists");
const completedLists = document.getElementById("completed-lists");
const addButton = document.getElementById("btn");

// Initialize todo lists from localStorage or empty array
let todoLists = getToDoLists();

// Event listeners
addButton.addEventListener("click", addList);
itemLists.addEventListener("click", handleListClick);
completedLists.addEventListener("click", handleListClick);

// Functions

// Fetch todo lists from localStorage
function getToDoLists() {
  try {
    return JSON.parse(localStorage.getItem("todoData")) || [];
  } catch (e) {
    console.error("Failed to parse todoData:", e);
    return [];
  }
}

// Save todo lists to localStorage
function saveLists(todo) {
  localStorage.setItem("todoData", JSON.stringify(todo));
}

// Handle click events for both active and completed lists
function handleListClick(e) {
  if (e.target.tagName === "SPAN") {
    deleteTodoItem(e.target);
  } else if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
    toggleTodoItem(e.target);
  }
}

// Delete a todo item
function deleteTodoItem(spanElement) {
  const liElement = spanElement.parentElement;
  const currentTodoText = liElement
    .querySelector(".todo-text")
    .textContent.trim();

  todoLists = todoLists.filter((todo) => todo.text !== currentTodoText);
  saveLists(todoLists);
  liElement.remove();
}

// Toggle the checked state of a todo item
function toggleTodoItem(checkboxElement) {
  const liElement = checkboxElement.parentElement;
  const todoText = liElement.querySelector(".todo-text").textContent.trim();

  const todoItem = todoLists.find((todo) => todo.text === todoText);
  todoItem.checked = checkboxElement.checked;
  saveLists(todoLists);

  if (todoItem.checked) {
    liElement.classList.add("checked");
    completedLists.appendChild(liElement);
  } else {
    liElement.classList.remove("checked");
    itemLists.appendChild(liElement);
  }
}

// Create and append a todo item to the appropriate list
function createAndAppendTodoItem(todoItem) {
  const liElement = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todoItem.checked;

  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.textContent = todoItem.text;

  const deleteButton = document.createElement("span");
  deleteButton.innerHTML = "\u00d7";
  deleteButton.className = "span";

  liElement.appendChild(checkbox);
  liElement.appendChild(todoText);
  liElement.appendChild(deleteButton);

  if (todoItem.checked) {
    liElement.classList.add("checked");
    completedLists.appendChild(liElement);
  } else {
    itemLists.appendChild(liElement);
  }
}

// Display all todo items
function showTodoLists() {
  itemLists.innerHTML = "";
  completedLists.innerHTML = "";
  todoLists.forEach(createAndAppendTodoItem);
}

// Add a new todo item
function addList(e) {
  e.preventDefault();

  const newTodoText = inputItem.value.trim();
  inputItem.value = "";

  if (
    newTodoText.length > 0 &&
    !todoLists.some((item) => item.text === newTodoText)
  ) {
    const newTodoItem = { text: newTodoText, checked: false };
    todoLists.push(newTodoItem);
    saveLists(todoLists);
    createAndAppendTodoItem(newTodoItem);
  }
}

// Initial call to display existing todos
showTodoLists();
