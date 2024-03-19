////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// IPORTANT INFORMATION!   to ru  this test you need to run this API-Server with the serve package (https://github.com/coding-bootcamps-eu/todo-api)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <reference types="cypress" />

describe("Todo App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("should have empty todo list by default", () => {
    cy.get("#todo-list li").should("have.length", 0);
  });
  it("should add new todo", () => {
    cy.get("#new-todo").type("test-todo");
    cy.get("#add-todo").click();
    cy.get("#todo-list li").should("have.length", 1);
  });
  it("should not add the same todo again", () => {
    cy.get("#new-todo").type("test-todo");
    cy.get("#add-todo").click();
    cy.get("#todo-list li").should("have.length", 1);
  });
  it("should delete done todos", () => {
    cy.get("#new-todo").type("please delete me");
    cy.get("#add-todo").click();
    cy.get("li")
      .contains("please delete me")
      .find("input[type=checkbox]")
      .as("checkbox");
    cy.get("@checkbox").check();
    cy.get("#delete-todos").click();
    cy.get("#todo-list li").should("have.length", 0);
  });
  // check for show all todos
  it("should display [all todos] who are filtered accordingly to the checked radiobutton", () => {
    // füge ein gechecktes Todo hinzu
    cy.get("#new-todo").type("im checked");
    cy.get("#add-todo").click();
    cy.get("li")
      .contains("im checked")
      .find("input[type=checkbox]")
      .as("checkbox");
    cy.get("@checkbox").check();
    // füge ein nicht gechecktes todo hinzu
    cy.get("#new-todo").type("im not checked");
    cy.get("#add-todo").click();
    cy.get("#todo-list li").should("have.length", 2);
  });

  // check for show done todos
  it("should display only todos who are [checked/done], accordingly to the checked radiobutton", () => {
    // füge ein gechecktes Todo hinzu
    cy.get("#new-todo").type("im checked");
    cy.get("#add-todo").click();
    cy.get("li")
      .contains("im checked")
      .find("input[type=checkbox]")
      .as("checkbox");
    cy.get("@checkbox").check();
    // füge ein nicht gechecktes todo hinzu
    cy.get("#new-todo").type("im not checked");
    cy.get("#add-todo").click();
    // ändere den filter auf "done" todos
    cy.get("#filter-done").check();
    cy.get("#todo-list li").should((todos) => {
      expect(todos.filter(":visible")).to.have.length(1);
      const isChecked = todos.find("input[type='checkbox']").prop("checked");
      expect(isChecked).to.be.true;
    });
  });

  // check for show open todos
  it("should display only todos who are [NOT checked/done], accordingly to the checked radiobutton", () => {
    // füge ein gechecktes Todo hinzu
    cy.get("#new-todo").type("im checked");
    cy.get("#add-todo").click();
    cy.get("li")
      .contains("im checked")
      .find("input[type=checkbox]")
      .as("checkbox");
    cy.get("@checkbox").check();
    // füge ein nicht gechecktes todo hinzu
    cy.get("#new-todo").type("im not checked");
    cy.get("#add-todo").click();
    // ändere den filter auf "open" todos
    cy.get("#filter-open").check();
    cy.get("#todo-list li").should((todos) => {
      expect(todos.filter(":visible")).to.have.length(1);
      const isChecked = todos
        .find("input[type='checkbox']:visible")
        .prop("checked");
      expect(isChecked).to.be.false;
    });
  });
});
