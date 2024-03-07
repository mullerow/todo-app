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
  const freshTodo = {
    description: input.value,
    id: todoArray.todos.length + 1,
    done: false,
  };
  console.log("freshtodo", freshTodo);
  todoArray.todos.push(freshTodo);
  console.log("array", todoArray);
  renderTodos();
}

FormContainers.forEach((container) =>
  container.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos(e) {
  console.log(e.target);
  e.target.done = !e.target.done;
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
addButton.addEventListener("click", renderTodos);
