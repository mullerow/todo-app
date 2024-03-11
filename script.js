const input = document.querySelector("#add-input-field");
const todoField = document.querySelector(".todo-field");
const FormContainers = document.querySelectorAll("form");
const addButton = document.querySelector(".add-button");
const removeButton = document.querySelector(".remove-button");
const radioAll = document.querySelector("#radio-all");
const radioOpen = document.querySelector("#radio-open");
const radioDone = document.querySelector("#radio-done");
const filter = document.querySelector(".filter");
let todos = [];

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function addTodo(event) {
  let duplicate = false;
  let freshTodo;
  let generatedId = 0;
  let idList = [];
  if (!todos || todos === null) {
    todos = [];
  }
  // ausschließen das ein leerer string als todo übergeben wird
  if (input.value.trim() === "") {
    return;
  }
  // suche nach duplikaten
  duplicate = todos.some(
    (todo) =>
      todo &&
      todo.description &&
      todo.description.toLowerCase() === input.value.toLowerCase()
  );

  // wenn ein duplikat gefunden wurde, breche das hinzufügen eines todos ab
  if (duplicate === true) {
    return;
  } else {
    // erstelle eine Liste mit allen vorhandenen id der todos
    for (let todo of todos) {
      idList.push(todo.id);
    }
    // definieren der ID. notwendig da beim löschen von todos die ids neuer todos sich sonst doppeln können
    if (todos.length === 0) {
      generatedId = 1;
    } else {
      generatedId = Math.max(...idList) + 1;
    }
    freshTodo = {
      description: input.value,
      id: generatedId,
      done: false,
    };
  }
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
  console.log("before storage", todos);
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

function filterTodos(e) {
  console.log("todos", todos);
  const todoListItems = document.querySelectorAll("li");
  console.log("todoListItems", todoListItems);
  //
  if (e.target.id === "radio-all") {
    todoListItems.forEach(function (item) {
      const elementId = item.firstChild.id;
      let filteredId = Number(elementId.match(/\d+/)[0]);
      for (let todo of todos) {
        if (todo.id === filteredId) {
          item.classList.remove("hide-me");
        }
      }
    });
  }

  /// verstecken aller todos welche nicht erledigt sind
  else if (e.target.id === "radio-done") {
    todoListItems.forEach(function (item) {
      const elementId = item.firstChild.id;
      let filteredId = Number(elementId.match(/\d+/)[0]);
      for (let todo of todos) {
        if (todo.id === filteredId && todo.done === false) {
          item.classList.add("hide-me");
        } else if (todo.id === filteredId && todo.done === true) {
          item.classList.remove("hide-me");
        }
      }
    });
  } else if (e.target.id === "radio-open") {
    todoListItems.forEach(function (item) {
      const elementId = item.firstChild.id;
      let filteredId = Number(elementId.match(/\d+/)[0]);
      for (let todo of todos) {
        if (todo.id === filteredId) {
          if (todo.done === false) {
            console.log("hab dich");
            item.classList.remove("hide-me");
          } else {
            item.classList.add("hide-me");
          }
        }
      }
    });
  }
  const storageList = JSON.stringify(todos);
  localStorage.setItem("todoList", storageList);
}

todoField.addEventListener("change", updateTodos);
filter.addEventListener("change", filterTodos);
addButton.addEventListener("click", addTodo);
removeButton.addEventListener("click", deleteDoneTodos);

renderTodos();
