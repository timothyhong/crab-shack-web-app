/*
    Author: Timothy Hong, Antonio Irizarry
    Class: CS 340
    Date: 04/26/21
    Title: Crabshack
    Description: Crabshack homepage client-side JS
*/

// prevent default for inputs with onclick events
Array.prototype.forEach.call(document.querySelectorAll("input[onclick]"), input => {
  input.addEventListener('click', e => {
   event.preventDefault();
 })
});

// modals
let modals = document.getElementsByClassName("modal");
let modalCloseBtns = document.getElementsByClassName("modal-close");

// hide modals on click
Array.prototype.forEach.call(modalCloseBtns, btn => {
  btn.onclick = () => {
    btn.parentElement.parentElement.style.display = "none";
  }
});

// hide modals if clicked outside of window
window.onclick = event => {
  if (Array.prototype.includes.call(modals, event.target)) {
    event.target.style.display = "none";
  }
}

// show modals
Array.prototype.forEach.call(document.querySelectorAll(".modal-open"), button => {
  button.addEventListener('click', e => {
    event.preventDefault();
    let modal = document.getElementById(button.dataset.modal);
    modal.style.display = "block";
  })
});

// navbar open
function openNav() {
  document.getElementById("sidenav-menu").style.width = "250px";
  // get all elements to push
  let push = document.getElementsByClassName("push");
  Array.prototype.forEach.call(push, element => element.style.marginLeft = "250px");
  // hide menu
  document.getElementById("sidenav-open").style.display = "none";
}

// navbar close
function closeNav() {
  document.getElementById("sidenav-menu").style.width = "0";
  // get all elements to push
  let push = document.getElementsByClassName("push");
  Array.prototype.forEach.call(push, element => element.style.marginLeft = "0");
  // show menu
  document.getElementById("sidenav-open").style.display = "block";
}

// redirects to add new product type code page
function addNewReferenceType(event) {
  if (event.target.value === "Add New Product Type" || event.target.value === "Add New Payment Type") {
    location.href = '/references';
  }
}

// redirects to customers page and brings up appropriate modal
function addNewCustomer(event) {
  if (event.target.value === "Add New Customer") {
    location.href = '/customers';
  }
}

// Customers Page
// reloads current page with restricted options
function refreshNames(event) {
    // a first_name is selected while last_name is empty => refresh last_names
    if (document.getElementById("lookupFirstName").value != "" && document.getElementById("lookupLastName").value == "") {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/customers/?first_name=" + document.getElementById("lookupFirstName").value);
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                // remove all options
                let dropdown = document.getElementById("lookupLastName");
                dropdown.options.length = 0;
                // add empty option back
                let empty = document.createElement("option");
                empty.value = "";
                dropdown.appendChild(empty);
                // add relevant options back
                Array.prototype.forEach.call(JSON.parse(xhr.response), row => {
                  let option = document.createElement("option");
                  option.value = row["last_name"];
                  option.innerHTML = row["last_name"];
                  dropdown.appendChild(option);
                })
            }
            else {
                console.error(xhr.statusText);
            }
        });
        xhr.send();
    }
    // a last name is selected while first_name is empty => refresh first names
    else if (document.getElementById("lookupLastName").value != "" && document.getElementById("lookupFirstName").value == "") {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/customers/?last_name=" + document.getElementById("lookupLastName").value);
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                // remove all options
                let dropdown = document.getElementById("lookupFirstName");
                dropdown.options.length = 0;
                // add empty option back
                let empty = document.createElement("option");
                empty.value = "";
                dropdown.appendChild(empty);
                // add relevant options back
                Array.prototype.forEach.call(JSON.parse(xhr.response), row => {
                  let option = document.createElement("option");
                  option.value = row["first_name"];
                  option.innerHTML = row["first_name"];
                  dropdown.appendChild(option);
                })
            }
            else {
                console.error(xhr.statusText);
            }
        });
        xhr.send();
    }
    // both are empty => refresh both
    else if (document.getElementById("lookupLastName").value == "" && document.getElementById("lookupFirstName").value == "") {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/customers/?first_name=&last_name=");
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                // remove all options
                let firstNameDropdown = document.getElementById("lookupFirstName");
                firstNameDropdown.options.length = 0;
                let lastNameDropdown = document.getElementById("lookupLastName");
                lastNameDropdown.options.length = 0;
                // add empty option back
                let empty = document.createElement("option");
                empty.value = "";
                firstNameDropdown.appendChild(empty);
                let empty2 = document.createElement("option");
                empty2.value = "";
                lastNameDropdown.appendChild(empty2);
                // add relevant options back
                Array.prototype.forEach.call(JSON.parse(xhr.response).firstNames, row => {
                  let option = document.createElement("option");
                  option.value = row["first_name"];
                  option.innerHTML = row["first_name"];
                  firstNameDropdown.appendChild(option);
                });
                Array.prototype.forEach.call(JSON.parse(xhr.response).lastNames, row => {
                  let option = document.createElement("option");
                  option.value = row["last_name"];
                  option.innerHTML = row["last_name"];
                  lastNameDropdown.appendChild(option);
                });                
            }
            else {
                console.error(xhr.statusText);
            }
        });
        xhr.send();
    }
}

// AJAX delete row call
function deleteRowAJAX(button) {
    let row = button.parentElement.parentElement;
    let cells = row.querySelectorAll(".key");
    let data = {};
    let ids = {};
    Array.prototype.forEach.call(cells, cell => {
        ids[cell.getAttribute("headers")] = cell.innerHTML;
    });
    data.ids = ids;
    data.action = button.className;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            row.remove();
            location.reload();
            alert(xhr.response);
        }
        else {
            console.error(xhr.statusText);
        }
    });
    xhr.send(JSON.stringify(data));
}

// AJAX add or edit existing row call
function addEditRowAJAX(button) {
    // client-side checks to ensure data has been filled out properly
    const form = button.parentElement;
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
    const userInput = form.getElementsByClassName("user-input");
    let data = {};
    let ids = {};
    let cols = {};
    Array.prototype.forEach.call(userInput, element => {
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
    data.action = button.className;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            if (xhr.response.startsWith("ERROR")) {
                alert(xhr.response);
            }
            else {
                location.reload();
                alert(xhr.response);
            }
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
    let modal = document.getElementById(editButton.dataset.modal);
    let inputs = modal.getElementsByClassName("user-input");
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