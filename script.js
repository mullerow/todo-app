const input = document.querySelector("#add-input-field");
const todoField = document.querySelector(".todo-field");
const FormContainers = document.querySelectorAll("form");
const addButton = document.querySelector(".add-button");

let todos = [
  { description: "1. todo des Tages", id: 1, done: false },
  { description: "2. todo des Tages", id: 2, done: true },
];
function addTodo(event) {
  const freshTodo = {
    description: input.value,
    id: todos.length + 1,
    done: false,
  };
  todos.push(freshTodo);
  const storageList = JSON.stringify(todos);
  localStorage.setItem("todoList", storageList);
  renderTodos();
}

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos(e) {
  e.target.todoObj.done = !e.target.todoObj.done;
  console.log("todoObj", e.target.todoObj);
}

function renderTodos() {
  const todosJson = localStorage.getItem("todoList");
  todos = JSON.parse(todosJson);
  // zunächst sicherheitshalber den gesammten text löschen und erst dann neu beschreiben
  todoField.innerText = "";
  // schleife durch alle Eintäge im der todo
  todos.forEach((todo) => {
    // erstelle ein li element
    const listItem = document.createElement("li");
    // erstelle eine checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "todo-" + todo.id;
    // erstelle ein label für die checkbox
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.innerText = todo.description;
    // füge den jeweiligen item ein listeneintrag ins markdown ein
    listItem.append(checkbox, label);
    todoField.append(listItem);
    checkbox.todoObj = todo;
    if (todo.done === true) {
      checkbox.checked = true;
    }
  });
}

todoField.addEventListener("change", updateTodos);
addButton.addEventListener("click", addTodo);

renderTodos();
