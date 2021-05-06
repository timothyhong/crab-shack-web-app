/*
    Author: Timothy Hong, Antonio Irizarry
    Class: CS 340
    Date: 04/26/21
    Title: Crabshack server-side
    Description: Server-side for Crabshack
*/

const mysql = require('./dbcon.js');
const express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout: 'index'});
const bodyparser = require('body-parser');
const app = express();
const customers = require("./routes/customers");
const products = require("./routes/products");
const orders = require("./routes/orders");
const references = require("./routes/references");

app.use(bodyparser.json());
app.use(express.static('public'));
app.use('/customers', customers);
app.use('/products', products);
app.use('/orders', orders);
app.use('/references', references);

app.set("port", 9184);
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.get('/', function(req, res, next) {
    res.render('home');
});

// row modification through POST
app.post('/', function(req, res, next) {
    if (req.body.action == "deleteProduct") {
        delete req.body["action"];
        deleteRowServer(req.body, "Products").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    else if (req.body.action == "editProduct") {
        delete req.body["action"];
        editRowServer(req.body, "Products").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    else if (req.body.action == "addProduct") {
        delete req.body["action"];
        addRowServer(req.body, "Products").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
});

app.listen(app.get("port"), () => {
  console.log("Express started on port: " + app.get("port") + "; press Ctrl-C to terminate.");
});

// SQL queries

// Deletes row from server
function deleteRowServer(data, tableName) {
    let idKeys = Object.keys(data.ids);
    let idVals = Object.values(data.ids);

    let numKeys = idKeys.length;

    let query = "DELETE FROM ?? WHERE ";

    for (let i = 0; i < numKeys; i++) {
        if (i == numKeys - 1) {
            query += "??=?;";
        }
        else {
            query += "??=? AND ";
        }
    }

    let queryVals = [];
    queryVals.push(tableName);
    for (let i = 0; i < numKeys; i++) {
        queryVals.push(idKeys[i]);
        queryVals.push(idVals[i]);
    }

    return new Promise((resolve, reject) => {
        mysql.pool.query(query, queryVals, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve("Successfully deleted!");
        })
    })
}

// Edits row from server
function editRowServer(data, tableName) {
    let idKeys = Object.keys(data.ids);
    let idVals = Object.values(data.ids);
    let colKeys = Object.keys(data.cols);
    let colVals = Object.values(data.cols);

    let numKeys = idKeys.length;
    let numCols = colKeys.length;
    // form query
    let query = "UPDATE ?? SET ";
    for (let i = 0; i < numCols; i++) {
        if (i == numCols - 1) {
            query += "??=? WHERE ";
        }
        else {
            query += "??=?, ";
        }
    }
    for (let i = 0; i < numKeys; i++) {
        if (i == numKeys - 1) {
            query += "??=?;";
        }
        else {
            query += "??=? AND ";
        }
    }
    let queryVals = [];
    queryVals.push(tableName);
    for (let i = 0; i < numCols; i++) {
        queryVals.push(colKeys[i]);
        queryVals.push(colVals[i]);
    }
    for (let i = 0; i < numKeys; i++) {
        queryVals.push(idKeys[i]);
        queryVals.push(idVals[i]);
    }
    return new Promise((resolve, reject) => {
        mysql.pool.query(query, queryVals, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve("Successfully edited!");
        })
    })
}

// Adds row to server
function addRowServer(data, tableName) {
    let colKeys = Object.keys(data.cols);
    let colVals = Object.values(data.cols);

    let numCols = colKeys.length;
    // form query
    let query = "INSERT INTO ?? (";
    for (let i = 0; i < numCols; i++) {
        if (i == numCols - 1) {
            query += "??) VALUES ("
        }
        else {
            query += "??, ";
        }
    }
    for (let i = 0; i < numCols; i++) {
        if (i == numCols - 1) {
            query += "?);";
        }
        else {
            query += "?, ";
        }
    }

    let queryVals = [];
    queryVals.push(tableName);
    for (let i = 0; i < numCols; i++) {
        queryVals.push(colKeys[i]);
    }
    for (let i = 0; i < numCols; i++) {
        queryVals.push(colVals[i]);
    }

    return new Promise((resolve, reject) => {
        mysql.pool.query(query, queryVals, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve("Successfully added!");
        })
    })
}

// fetches entire table from MYSQL database
module.exports.getData = (tableName) => {
    return new Promise((resolve, reject) => {
        mysql.pool.query('SELECT * FROM ??;', [tableName], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

// fetches columns from table
module.exports.getColumns = (tableName, ...columnNames) => {
    return new Promise((resolve, reject) => {
        mysql.pool.query('SELECT ?? FROM ??', [columnNames, tableName], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}
