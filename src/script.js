const input = document.querySelector("#add-input-field");
const todoField = document.querySelector(".todo-field");
const FormContainers = document.querySelectorAll("form");
const addButton = document.querySelector(".add-button");
const removeButton = document.querySelector(".remove-button");
const radioAll = document.querySelector("#radio-all");
const radioOpen = document.querySelector("#radio-open");
const radioDone = document.querySelector("#radio-done");
const filter = document.querySelector(".filter");

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

async function addTodo() {
  let duplicate = false;
  let freshTodo;
  let generatedId = 0;
  let idList = [];
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

  await saveAPITodos(freshTodo);

  renderTodos();
}

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos(e) {
  e.target.todoObj.done = !e.target.todoObj.done;
  freshTodo = e.target.todoObj;
  updateAPITodos(freshTodo);
}

async function renderTodos() {
  await getAPITodos();
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

function deleteDoneTodos() {
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].done === true) {
      const doneTodoId = todos[i].id;
      deleteAPITodos(doneTodoId);
      //todos.splice(i, 1);
    }
  }
  renderTodos();
}

function filterTodos(e) {
  const todoListItems = document.querySelectorAll("li");
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
            item.classList.remove("hide-me");
          } else {
            item.classList.add("hide-me");
          }
        }
      }
    });
  }
}

//////  funktionen für die backend API  ///////////////////////////////////////////////

const apiUrl = "http://localhost:4730/todos/";

async function saveAPITodos(freshTodo) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(freshTodo),
    });
  } catch (error) {
    console.error("error", error);
  }
}

async function getAPITodos() {
  const response = await fetch(apiUrl);
  if (response.ok) {
    const todoData = await response.json();
    todos = todoData;
    return todos;
  }
}

async function updateAPITodos(doneTodo) {
  const response = await fetch(apiUrl + doneTodo, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(freshTodo),
  });
}

async function deleteAPITodos(doneTodoId) {
  const response = await fetch(apiUrl + doneTodoId, {
    method: "DELETE",
  });
  if (response.ok) {
    const todoData = await response.json();
    renderTodos();
  }
}

todoField.addEventListener("change", updateTodos);
filter.addEventListener("change", filterTodos);
addButton.addEventListener("click", addTodo);
removeButton.addEventListener("click", deleteDoneTodos);

renderTodos();
