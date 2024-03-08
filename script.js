const input = document.querySelector("#add-input-field");
const todoField = document.querySelector(".todo-field");
const FormContainers = document.querySelectorAll("form");
const addButton = document.querySelector(".add-button");

const todos = [
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

  const jsonTodo = JSON.stringify(todos);
  localStorage.setItem("todoList", jsonTodo);
  renderTodos();
}

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos(e) {
  const targetId = parseInt(e.target.id.match(/\d+/)[0]);
  const found = todos.find((item) => item.id === Number(targetId));
  found.done = !found.done;
  const jsonTodo = JSON.stringify(todos);
}

function renderTodos() {
  // zunächst sicherheitshalber den gesammten text löschen und erst dann neu  ebschreiben
  todoField.innerText = "";
  console.log("render:", todos[1].description);

  // schleife durch alle Eintäge im der todo
  todos.forEach((todo) => {
    //
    // estelle ein li element
    const listItem = document.createElement("li");
    //
    // erstelle eine checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "todo-" + todo.id;
    //
    // erstelle ein label für die checkbox
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.innerText = todo.description;

    // füge den jeweiligen item ein listeneintrag ins markdown ein
    listItem.append(checkbox, label);
    todoField.append(listItem);
    if (todo.done === true) {
      checkbox.checked = true;
    }
  });
}

todoField.addEventListener("change", updateTodos);
addButton.addEventListener("click", addTodo);

renderTodos();
