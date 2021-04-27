/*
    Author: Timothy Hong
    Class: CS 290
    Date: 03/06/2021
    Title: HW6 - Database Interactions and UI
    Description: Client-side script for Workout Tracker
*/

// Add button prevent default
document.getElementById("add-button").addEventListener("click", (e) => {
    e.preventDefault();
    addRow();
})

// Edit button prevent default
document.getElementById("edit-button").addEventListener("click", (e) => {
    e.preventDefault();
    submitEdit();
})

// AJAX add row call
function addRow() {
    // collect row data to send
    const addData = document.getElementsByClassName("add-data");
    const row = {};
    for (const data of addData) {
        row[data.getAttribute("name")] = data.value;
    }
    // client-side check to ensure row name is not null
    if (!row.name) {
        alert("Name is required!");
        return;
    }
    let data = {"row": row, "action": "addRow"};
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            // update client-side view to add a row with the correct id
            appendRow(row, JSON.parse(xhr.response).id);
        }
        else {
            console.error(xhr.statusText);
        }
    })
    xhr.send(JSON.stringify(data));
}

// client-side function to add row to table with the given id
function appendRow(row, id) {
    let tr = create("tr");
        tr.className = "workout-row";
        // create hidden ID cell
        let idTd = create("td");
        let input = create("input");
        input.setAttribute("type", "hidden");
        input.className = "cell-data id";
        input.value = id;
        append(input, idTd);
        append(idTd, tr);
        // create other cells
        for (const key of Object.keys(row)) {
            let td = create("td");
            td.className = "cell-data " + key;
            if (key == "date") {
                // reformat date YYYY-MM-DD to MM-DD-YYYY
                td.innerHTML = dateFromISO(row[key]);
            }
            else if (key == "unit") {
                // convert from boolean
                if (row[key] == 1) {
                    td.innerHTML = "lbs";
                }
                else {
                    td.innerHTML = "kgs";
                }
            }
            else {
                td.innerHTML = row[key];  
            }
            append(td, tr);
        }
        // create buttons
        let deleteTd = create("td");
        let deleteButton = create("input");
        deleteButton.className = "delete-button";
        deleteButton.setAttribute("type", "submit");
        deleteButton.value = "Delete";
        deleteButton.setAttribute("onclick", "deleteRow(this)");
        append(deleteButton, deleteTd);
        append(deleteTd, tr);

        let editTd = create("td");
        let editButton = create("input");
        editButton.className = "edit-button";
        editButton.setAttribute("type", "submit");
        editButton.value = "Edit";
        editButton.setAttribute("onclick", "setDefaults(this)");
        append(editButton, editTd);
        append(editTd, tr);

        let tableBody = document.getElementById("workout-table").lastElementChild;
        append(tr, tableBody);
}

// Helper function that formats from ISO YYYY-MM-DD to MM-DD-YYYY
function dateFromISO(dateString) {
    if (!dateString) return "00-00-0000";
    else if (dateString == "0000-00-00") return "";
    let date = dateString.split("-");
    formattedString = date[1] + "-" + date[2] + "-" + date[0];
    return formattedString;
}

// Helper function that formats from MM-DD-YYYY -> ISO YYYY-MM-DD
function dateToISO(dateString) {
    if (!dateString) return "0000-00-00";
    else if (dateString == "00-00-0000") return "";
    let date = dateString.split("-");
    formattedString = date[2] + "-" + date[0] + "-" + date[1];
    return formattedString;
}

// AJAX delete row call
function deleteRow(deleteButton) {
    const xhr = new XMLHttpRequest();
    const row = deleteButton.parentElement.parentElement;
    const id = row.firstElementChild.firstElementChild.value;
    let data = {"id": id, "action": "deleteRow"};
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            row.remove();
        }
        else {
            console.error(xhr.statusText);
        }
    })
    xhr.send(JSON.stringify(data));
}

// modifies a row with new values
function modifyRow(row) {
    let tr = document.querySelector("td input[value=" + CSS.escape(row.id) + "]").parentElement.parentElement;
    for (const key of Object.keys(row)) {
        let cell = tr.querySelector("." + CSS.escape(key));
        if (key == "date") {
            cell.innerHTML = dateFromISO(row.date);
        }
        else if (key == "unit") {
            // convert from boolean
            if (row[key] == 1) {
                cell.innerHTML = "lbs";
            }
            else {
                cell.innerHTML = "kgs";
            }
        }
        else if (key != "id") {
            cell.innerHTML = row[key];
        }
    }
}

// AJAX submit edits call
function submitEdit() {
    // ensure edit has been clicked
    if (!document.getElementById("editID").value) {
        alert("Click on a row to edit before submitting!");
        return;
    }
    // get edit data
    const editData = document.getElementsByClassName("edit-data");
    const row = {};
    for (const data of editData) {
        row[data.getAttribute("name")] = data.value;
    }
    // client side check to ensure row name is not null
    if (!row.name) {
        alert("Name is required!");
        return;
    }
    let data = {"row": row, "action": "editRow"};
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            modifyRow(row);
        }
        else {
            console.error(xhr.statusText);
        }
    })
    xhr.send(JSON.stringify(data));
}

// Sets the default values for the edit form
function setDefaults(editButton) {
    const row = editButton.parentElement.parentElement;
    // get and set values of current row to be default values for the edit form
    const defaultValues = row.getElementsByClassName("cell-data");
    const editFields = document.getElementsByClassName("edit-data");
    for (let i = 0; i < editFields.length; i++) {
        if (editFields[i].name == "date") {
            editFields[i].value = dateToISO(defaultValues[i].innerHTML);
        }
        else if (editFields[i].name == "id") {
            editFields[i].value = defaultValues[i].value;
        }
        else if (editFields[i].name == "unit") {
            if (defaultValues[i].innerHTML == "lbs") {
                editFields[i].value = 1;
            }
            else {
                editFields[i].value = 0;
            }
        }
        else {
            editFields[i].value = defaultValues[i].innerHTML;
        }
    }
}

// Helper function to create element
function create(tag) {
    return document.createElement(tag);
}

// Helper function to append child to parent
function append(child, parent) {
    parent.appendChild(child);
}
