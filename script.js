const input = document.querySelector("#add-input-field");
const todoField = document.querySelector(".todo-field");
const FormContainers = document.querySelectorAll("form");
const addButton = document.querySelector(".add-button");
const removeButton = document.querySelector(".remove-button");

let todos = [];
function addTodo(event) {
  let duplicate = false;
  // wenn das das array durch JSON auf null gesetzt wurde, dann ändere bitte todos in array
  if (todos === null) {
    todos = [];
  }
  // ausschließen das ein leerer string als todo übergeben wird
  if (input.value.trim() === "") {
    return;
  }
  // suche nach duplikaten
  duplicate = todos.some((todo) => todo.description === input.value);

  // wenn ein duplikat gefunden wurde, breche das hinzufügen eines todos ab
  if (duplicate === true) {
    return;
  } else {
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
}

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos(e) {
  e.target.todoObj.done = !e.target.todoObj.done;
}

function renderTodos() {
  const todosJson = localStorage.getItem("todoList");
  todos = JSON.parse(todosJson);
  // zunächst sicherheitshalber den gesammten text löschen und erst dann neu beschreiben
  todoField.innerText = "";
  // schleife durch alle Eintäge im der todo
  if (todos !== null && todos.length > 0) {
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
  } else {
    return;
  }
}

function deleteDoneTodos() {
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].done === true) {
      todos.splice(i, 1);
    }
  }
  // die änderungen an der todos abspeichern und anschließend neu rendern!
  const storageList = JSON.stringify(todos);
  localStorage.setItem("todoList", storageList);
  renderTodos();
}

todoField.addEventListener("change", updateTodos);
addButton.addEventListener("click", addTodo);
removeButton.addEventListener("click", deleteDoneTodos);

renderTodos();
