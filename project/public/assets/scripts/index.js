/*
    Author: Timothy Hong, Antonio Irizarry
    Class: CS 340
    Date: 04/26/21
    Title: Crabshack
    Description: Crabshack homepage client-side JS
*/

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

function addNewProductType(event) {
  if (event.target.value === "Add New Product Type") {
    location.href = '/references/products';
  }
}

// AJAX delete row call
function deleteRow(deleteButton) {
    const xhr = new XMLHttpRequest();
    const row = deleteButton.parentElement.parentElement;
    const id = row.firstElementChild.innerHTML;
    const action = deleteButton.getAttribute("class");
    console.log(action);
    let data = {"id": id, "action": action};
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.response = "Success") {
            row.remove();
        }
        else {
            console.error(xhr.statusText);
        }
    })
    xhr.send(JSON.stringify(data));
}

// AJAX modify row call
function modifyRow() {
    // get data
    const searchData = document.getElementsByClassName("edit-field");
    let data = {};
    Array.prototype.forEach.call(searchData, element => {
        data[element.getAttribute("name")] = element.value;
    });
    // insert request if product_id is empty
    if (data.product_id = "") {
        delete data[product_id];
        data.action = "insertProduct";
    }
    else {
        data.action = "editProduct";
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            console.log("hooray");
        }
        else {
            console.error(xhr.statusText);
        }
    })
    xhr.send(JSON.stringify(data));
}

// Sets values in form when edit button is clicked
function setDefaults(editButton) {
    let data = {};
    const row = editButton.parentElement.parentElement;
    const id = row.firstElementChild.innerHTML;
    // get and set values of current row to be default values for the edit form
    const cells = row.getElementsByClassName("cell-data");
    Array.prototype.forEach.call(cells, cell => {
        data[cell.getAttribute("headers")] = cell.innerHTML;
    });
    const inputs = document.getElementsByClassName("edit-field");
    Array.prototype.forEach.call(inputs, input => {
        // for dropdown menus that utilize descriptions, find the description that matches the value and select it
        if (input.classList.contains("description")) {
            Array.prototype.forEach.call(input.children, child => {
                if (child.innerHTML == data[input.getAttribute("name")]) {
                    input.value = child.value;
                }
            });
        }
        else {
            input.value = data[input.getAttribute("name")];
        }
    });
}