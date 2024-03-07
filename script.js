const input = document.querySelector("#add-input-field");
const todoField = document.querySelector(".todo-field");
const FormContainers = document.querySelectorAll("form");

const addButton = document.querySelector(".add-button");

let todoArray = {
  todos: [
    { description: "1. todo des Tages", id: 1, done: false },
    { description: "2. todo des Tages", id: 2, done: true },
  ],
};

function addTodo(event) {
  //console.log(input.value);
  todoArray.todos.push(input.value);
  //console.log(todoArray);
  localStorage.setItem("User", input.value);

  test = localStorage.getItem("user");
}

FormContainers.forEach((container) =>
  container.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos() {
  return;
}

function renderTodos() {
  // zunächst sicherheitshalber den gesammten text löschen und erst dann neu  ebschreiben

  todoField.innerText = "";
  console.log("render:", todoArray.todos[1].description);

  // schleife durch alle Eintäge im der todo
  todoArray.todos.forEach((todo) => {
    //
    // estelle ein li element
    const listItem = document.createElement("li");
    //
    // erstelle eine checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "todo-" + todo.id;
    console.log("checkbox", checkbox.id);
    //
    // erstelle ein label für die checkbox
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.innerText = todo.description;
    console.log("label:", label.innerText);
    listItem.append(checkbox, label);
    todoField.append(listItem);
  });
}

addButton.addEventListener("click", addTodo);
addButton.addEventListener("click", renderTodos);
