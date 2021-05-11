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
    // Products
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
    // Customers
    else if (req.body.action == "deleteCustomer") {
        delete req.body["action"];
        console.log(req.body);
        deleteRowServer(req.body, "Customers").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    else if (req.body.action == "editCustomer") {
        delete req.body["action"];
        editRowServer(req.body, "Customers").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    else if (req.body.action == "addCustomer") {
        delete req.body["action"];
        addRowServer(req.body, "Customers").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    // Orders
    else if (req.body.action == "deleteOrder") {
        delete req.body["action"];
        deleteRowServer(req.body, "Customer_Orders").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    else if (req.body.action == "editOrder") {
        delete req.body["action"];
        editRowServer(req.body, "Customer_Orders").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
    else if (req.body.action == "addOrder") {
        delete req.body["action"];
        addRowServer(req.body, "Customer_Orders").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
});

app.listen(app.get("port"), () => {
  console.log("Express started on port: " + app.get("port") + "; press Ctrl-C to terminate.");
});

// SQL queries

// Deletes row from server
// data: {ids: {idKey1: idVal1, ...}}
// tableName: name of the table
function deleteRowServer(data, tableName) {
    let idKeys = Object.keys(data.ids);
    let idVals = Object.values(data.ids);

    let numIds = idKeys.length;

    let query = "DELETE FROM ?? WHERE ";

    for (let i = 0; i < numIds; i++) {
        if (i == numIds - 1) {
            query += "??=?;";
        }
        else {
            query += "??=? AND ";
        }
    }

    let queryVals = [];
    queryVals.push(tableName);
    for (let i = 0; i < numIds; i++) {
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
// data: {ids: {idKey1: idVal1, ...} cols: {colKey1: colVal1, ...}}
// tableName: name of the table
function editRowServer(data, tableName) {
    let idKeys = Object.keys(data.ids);
    let idVals = Object.values(data.ids);
    let colKeys = Object.keys(data.cols);
    let colVals = Object.values(data.cols);

    let numIds = idKeys.length;
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
    for (let i = 0; i < numIds; i++) {
        if (i == numIds - 1) {
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
    for (let i = 0; i < numIds; i++) {
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
// data: {cols: {colKey1: colVal1, ...}}
// tableName: name of the table
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

// fetches columns matching criteria
// data: {cols: [col1, ...], criteria:{criteriaKey1: criteriaVal1}}
// tableName: name of the table
// distinct: bool true (distinct), false (all)
// if data = {} : SELECT * FROM tableName;
// if data = {cols} (no criteria) : SELECT col1, ... FROM tableName;
// if data = {criteria} (no cols) : SELECT * FROM tableName WHERE ?? = ?, ...

// refactor this later it's repetitive
module.exports.getColumns = (data, tableName, distinct) => {
    // data = {}
    let query;
    let queryVals = [];
    // data is empty, get everything
    if (Object.keys(data).length === 0 || 
        (data.hasOwnProperty("cols") && data.cols.length === 0) || 
        (data.hasOwnProperty("criteria") && Object.keys(data.criteria).length === 0)) {
        if (distinct) {
            query = "SELECT * FROM ??;";
        }
        else {
            query = "SELECT DISTINCT * FROM ??;";
        }
        queryVals.push(tableName);
    }
    // data: {cols: [], criteria: {}}
    // SELECT * FROM ?? WHERE ?? = ?;
    else if (data.hasOwnProperty("cols") && data.cols.length > 0 && 
        data.hasOwnProperty("criteria") && Object.keys(data.criteria).length > 0) {
        let criteriaKeys = Object.keys(data.criteria);
        let criteriaVals = Object.values(data.criteria);

        let numCriteria = criteriaKeys.length;
        // form query
        if (distinct) {
            query = "SELECT DISTINCT ";
        }
        else {
            query = "SELECT ";
        }
        for (let i = 0; i < data.cols.length; i++) {
            if (i == data.cols.length - 1) {
                query += "?? FROM ?? WHERE ";
            }
            else {
                query += "??, ";
            }
        }
        for (let i = 0; i < numCriteria; i++) {
            if (i == numCriteria - 1) {
                query += "?? = ?;";
            }
            else {
                query += "?? = ? AND ";
            }
        }
        // form query values list
        for (let i = 0; i < data.cols.length; i++) {
            queryVals.push(data.cols[i]);
        }
        queryVals.push(tableName);
        for (let i = 0; i < numCriteria; i++) {
            queryVals.push(criteriaKeys[i]);
            queryVals.push(criteriaVals[i]);
        }
            }
    // data = {cols: []}
    // SELECT ?? FROM ??;
    else if (data.hasOwnProperty("cols") && data.cols.length > 0) {
        // form query
        if (distinct) {
            query = "SELECT DISTINCT ";
        }
        else {
            query = "SELECT ";
        }
        for (let i = 0; i < data.cols.length; i++) {
            if (i == data.cols.length - 1) {
                query += "?? FROM ??;";
            }
            else {
                query += "??, ";
            }
        }
        // form query values list
        for (let i = 0; i < data.cols.length; i++) {
            queryVals.push(data.cols[i]);
        }
        queryVals.push(tableName);
    }
    // data = {criteria: {}}
    // SELECT * FROM ?? WHERE ?? = ?;
    else if (data.hasOwnProperty("criteria") && Object.keys(data.criteria).length > 0) {
        let criteriaKeys = Object.keys(data.criteria);
        let criteriaVals = Object.values(data.criteria);

        let numCriteria = criteriaKeys.length;
        if (distinct) {
            query = "SELECT DISTINCT * FROM ?? WHERE ";
        }
        else {
            query = "SELECT * FROM ?? WHERE ";
        }
        for (let i = 0; i < numCriteria; i++) {
            if (i == numCriteria - 1) {
                query += "?? = ?;";
            }
            else {
                query += "?? = ? AND ";
            }
        }
        // form query values list
        queryVals.push(tableName);
        for (let i = 0; i < numCriteria; i++) {
            queryVals.push(criteriaKeys[i]);
            queryVals.push(criteriaVals[i]);
        }
    }
    return new Promise((resolve, reject) => {
        mysql.pool.query(query, queryVals, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}
