/*
    Author: Timothy Hong, Antonio Irizarry
    Class: CS 340
    Date: 04/26/21
    Title: Crabshack
    Description: Crabshack homepage client-side JS
*/

Array.prototype.forEach.call(document.querySelectorAll("input[onclick]"), input => {
  input.addEventListener('click', e => {
   event.preventDefault();
 })
});

function openNav() {
  document.getElementById("sidenav-menu").style.width = "250px";
  // get all elements to push
  let push = document.getElementsByClassName("push");
  Array.prototype.forEach.call(push, element => element.style.marginLeft = "250px");
  // hide menu
  document.getElementById("sidenav-open").style.display = "none";
}

function closeNav() {
  document.getElementById("sidenav-menu").style.width = "0";
  // get all elements to push
  let push = document.getElementsByClassName("push");
  Array.prototype.forEach.call(push, element => element.style.marginLeft = "0");
  // show menu
  document.getElementById("sidenav-open").style.display = "block";
}

// redirects to add new product type code page
function addNewProductType(event) {
  if (event.target.value === "Add New Product Type") {
    location.href = '/references';
  }
}

// AJAX delete row call
function deleteRowAJAX(deleteButton) {
    let row = deleteButton.parentElement.parentElement;
    let cells = row.querySelectorAll(".key");
    let data = {};
    let cols = {};
    let ids = {};
    Array.prototype.forEach.call(cells, cell => {
        ids[cell.getAttribute("headers")] = cell.innerHTML;
    });
    data.ids = ids;
    data.cols = cols;
    data.action = deleteButton.className;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.response == "Successfully deleted!") {
            row.remove();
        }
        else {
            console.error(xhr.statusText);
        }
    });
    xhr.send(JSON.stringify(data));
}

// AJAX edit existing row call
function editRowAJAX(editButton) {
    // client-side checks to ensure data has been filled out properly
    const requiredFields = document.querySelectorAll("[required]");
    let requiredFieldsMissing = false;
    Array.prototype.forEach.call(requiredFields, element => {
        if (!element.value || element.value == "") {
            requiredFieldsMissing = true;
            return;
        }
    });
    if (requiredFieldsMissing) {
      return;
    }
    const editFields = document.getElementsByClassName("edit-field");
    let data = {};
    let ids = {};
    let cols = {};
    Array.prototype.forEach.call(editFields, element => {
        // get ids (hidden)
        if (element.classList.contains("key")) {
            ids[element.getAttribute("name")] = element.value;
        }
        else {
            cols[element.getAttribute("name")] = element.value;
        }
    });
    data.ids = ids;
    data.cols = cols;
    data.action = editButton.className;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.response == "Successfully edited!") {
            location.reload();
        }
        else {
            console.error(xhr.statusText);
        }
    });
    xhr.send(JSON.stringify(data));
}

// AJAX add row call
function addRowAJAX(addButton) {
    // client-side checks to ensure data has been filled out properly
    const form = addButton.parentElement;
    const requiredFields = form.querySelectorAll("[required]");
    let requiredFieldsMissing = false;
    Array.prototype.forEach.call(requiredFields, element => {
        if (!element.value || element.value == "") {
            requiredFieldsMissing = true;
            return;
        }
    });
    if (requiredFieldsMissing) {
        return;
    }
    const editFields = form.querySelectorAll(".edit-field");
    let data = {};
    let cols = {};
    let ids = {};
    Array.prototype.forEach.call(editFields, element => {
        // get only non-keys
        if (!element.classList.contains("key")) {
            cols[element.getAttribute("name")] = element.value;
        }
    });
    data.cols = cols;
    data.ids = ids;
    data.action = addButton.className;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.response == "Successfully added!") {
            location.reload();
        }
        else {
            console.error(xhr.statusText);
        }
    });
    xhr.send(JSON.stringify(data));
}

// Sets values in form when edit button is clicked
function setDefaults(editButton) {
    let data = {};
    const row = editButton.parentElement.parentElement;
    // get and set values of current row to be default values for the edit form
    const cells = row.querySelectorAll("[headers]");
    Array.prototype.forEach.call(cells, cell => {
        data[cell.getAttribute("headers")] = cell.innerHTML;
    });
    const inputs = document.getElementsByClassName("edit-field");
    Array.prototype.forEach.call(inputs, input => {
        // for dropdown menus that utilize descriptions, find the description that matches the value and select it
        if (input.classList.contains("description")) {
            Array.prototype.forEach.call(input.children, child => {
                if (child.innerHTML == data[input.getAttribute("name")] || child.value == data[input.getAttribute("name")]) {
                    input.value = child.value;
                }
            });
        }
        else if (Array.prototype.includes.call(Object.keys(data), input.getAttribute("name"))) {
            input.value = data[input.getAttribute("name")];
        }
    });
}

/*
function editRowClient(data) {
    let rows = document.getElementsByClassName("table-row");
    let selectedRow;
    // get the row that has hidden cells matching idKeys
    Array.prototype.forEach.call(rows, row => {
        let count = 0;
        let cells = row.querySelectorAll(".key");
        for (let i = 0; i < cells.length; i++) {
            if (data.ids[cells[i].getAttribute("headers")] == cells[i].innerHTML) {
                count += 1;
            }
        if (count == cells.length) {
            selectedRow = row;
        }
        }
    });
    // get the cells to be modified in that row
    let cells = selectedRow.querySelectorAll("[headers]");
    Array.prototype.forEach.call(cells, cell => {
        let cellKey = cell.getAttribute("headers");
        if (Array.prototype.includes.call(Object.keys(data.cols), cellKey)) {
            cell.innerHTML = data.cols[cellKey];
        }
    });
}
*/

/*
function addRowClient(data) {
    let tr = create("tr");
        tr.className = "table-row";
        for (key of Object.keys(data)) {
            let td = create("td");
            td.setAttribute("headers", key);
            td.innerHTML = data[key];
            td.className = "cell-data";
            append(td, tr);
        }
        // set first id cell to hidden
        tr.firstElementChild.className += " key";

        // delete button
        let deleteTd = create("td");
        let deleteButton = create("input");
        deleteButton.className = "delete-button";
        deleteButton.setAttribute("type", "submit");
        deleteButton.value = "Delete";
        deleteButton.setAttribute("onclick", "deleteRow(this)");
        append(deleteButton, deleteTd);
        append(deleteTd, tr);
        // edit button
        let editTd = create("td");
        let editButton = create("input");
        editButton.className = "edit-button";
        editButton.setAttribute("type", "submit");
        editButton.value = "Edit";
        editButton.setAttribute("onclick", "setDefaults(this)");
        append(editButton, editTd);
        append(editTd, tr);

        let tableBody = document.querySelector("tbody");
        append(tr, tableBody);
}

// Helper function to create element
function create(tag) {
    return document.createElement(tag);
}

// Helper function to append child to parent
function append(child, parent) {
    parent.appendChild(child);
}
*/

/*
function toggleSubMenu(id) {
  let currentSubMenu = document.getElementById(id);
  // close existing open submenus
  let submenus = document.getElementsByClassName("submenu");
  Array.prototype.forEach.call(submenus, element => {
    if (element != currentSubMenu) {
      element.style.display = "none"
    }
  });
  // toggle current submenu
  if (!currentSubMenu.style.display || currentSubMenu.style.display == "none") {
    currentSubMenu.style.display = "block";
  }
  else {
    currentSubMenu.style.display = "none";
  }
}
*/