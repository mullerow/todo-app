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
  console.log("todos vor some", todos);
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
  /// todos.push(freshTodo);
  // const storageList = JSON.stringify(todos);
  // localStorage.setItem("todoList", storageList);

  saveAPITodos(freshTodo);

  renderTodos();
}

FormContainers.forEach((form) =>
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  })
);

function updateTodos(e) {
  e.target.todoObj.done = !e.target.todoObj.done;
  console.log("freshTodo", e.target.todoObj);
  freshTodo = e.target.todoObj;
  updateAPITodos(freshTodo);
  // der done status wird hier zwar lokal geändert, aber nicht auf der api. sodass bei rendern der api status geladen wird und der lokale vergessen
}

async function renderTodos() {
  await getAPITodos();

  //const todosJson = localStorage.getItem("todoList");
  //todos = JSON.parse(todosJson) || [];
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
      doneTodo = todos[i].id;
      console.log("doneTodo", doneTodo);
      deleteAPITodos(doneTodo);
      //todos.splice(i, 1);
    }
    return todos;
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
            item.classList.remove("hide-me");
          } else {
            item.classList.add("hide-me");
          }
        }
      }
    });
  }

  // const storageList = JSON.stringify(todos);
  // localStorage.setItem("todoList", storageList);

  ///// saveAPITodos();
}

//////  funktionen für backend API  ///////////////////////////////////////////////

const apiUrl = "http://localhost:4730/todos/";

async function saveAPITodos(freshTodo) {
  console.log("freshtodoID", freshTodo.id);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(freshTodo),
    });
    if (response.ok) {
      const todoData = await response.json();
      console.log("tododData", todoData);
    }
  } catch (error) {
    console.error("error", error);
  }
}

async function getAPITodos() {
  const response = await fetch(apiUrl);
  if (response.ok) {
    const todoData = await response.json();
    todos = todoData;
    console.log(todoData);
    return todos;
  }
}

async function updateAPITodos(doneTodo) {
  const response = await fetch(apiUrl + doneTodo.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(freshTodo),
  });
}

async function deleteAPITodos(doneTodo) {
  const response = await fetch(apiUrl + doneTodo.id, {
    method: "DELETE",
  });
  if (response.ok) {
    const todoData = await response.json();
    todos = todoData;
    console.log("nach löschung", todoData);
    return todos;
  }
}

todoField.addEventListener("change", updateTodos);
filter.addEventListener("change", filterTodos);
addButton.addEventListener("click", addTodo);
removeButton.addEventListener("click", deleteDoneTodos);

renderTodos();
