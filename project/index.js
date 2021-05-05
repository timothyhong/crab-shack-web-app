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

// deletes and edits through POST
app.post('/', function(req, res, next) {
    let context = {};
    if (req.body.action == "delete-product") {
        deleteRow(req.body.id, "product_id", "Products").then((msg) => res.send(msg)).catch((err) => console.error(err));
    }
});

app.listen(app.get("port"), () => {
  console.log("Express started on port: " + app.get("port") + "; press Ctrl-C to terminate.");
});

// SQL queries

// deletes row with columnId from columnName of tableName
function deleteRow(columnId, columnName, tableName) {
    return new Promise((resolve, reject) => {
        mysql.pool.query("DELETE FROM ?? WHERE ?? = ?;", [tableName, columnName, columnId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve("Success");
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
