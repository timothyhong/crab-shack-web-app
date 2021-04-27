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



app.listen(app.get("port"), () => {
  console.log("Express started on port: " + app.get("port") + "; press Ctrl-C to terminate.");
});


// SQL queries

// fetches entire table from MYSQL database
function getData() {
    return new Promise((resolve, reject) => {
        mysql.pool.query('SELECT * FROM customers;', (err, results) => {
            if (err) {
            	console.log("Error with Query");
                return reject(err);
            }
            /*
            let rows = [];
            for (let i = 0; i < results.length; i++) {
                rows.push(results[i]);
            }
            */
            resolve(results);
        })
    })
}