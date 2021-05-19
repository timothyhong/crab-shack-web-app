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
        deleteRowServer(req.body, ["product_id"], "Products")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "editProduct") {
        editRowServer(req.body, ["product_id"], ["product_type_code", "product_name", "product_unit_price", 
            "product_unit_size", "product_description"], "Products")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "addProduct") {
        addRowServer(req.body, ["product_type_code", "product_name", "product_unit_price", 
            "product_unit_size", "product_description"], "Products")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    // Customers
    else if (req.body.action == "deleteCustomer") {
        deleteRowServer(req.body, ["customer_id"], "Customers")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "editCustomer") {
        editRowServer(req.body, ["customer_id"], ["first_name", "middle_name", "last_name", 
            "customer_phone_primary", "customer_phone_secondary", "customer_email", 
            "address_line_1", "address_line_2", "city", "zip_code", "state", "customer_info"], "Customers")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "addCustomer") {
        addRowServer(req.body, ["first_name", "middle_name", "last_name", 
            "customer_phone_primary", "customer_phone_secondary", "customer_email", 
            "address_line_1", "address_line_2", "city", "zip_code", "state", "customer_info"], "Customers")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    // Orders
    else if (req.body.action == "deleteOrder") {
        deleteRowServer(req.body, ["order_id"], "Customer_Orders")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "editOrder") {
        editRowServer(req.body, ["order_id"], ["customer_id", "card_type_code", "card_last_four", 
            "order_picked_up_yn", "order_paid_yn", "datetime_order_placed", "order_detail"], "Customer_Orders")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "addOrder") {
        addRowServer(req.body, ["customer_id", "card_type_code", "card_last_four", 
            "order_picked_up_yn", "order_paid_yn", "datetime_order_placed", "order_detail"], "Customer_Orders")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    // Order Products
    else if (req.body.action == "deleteOrderProduct") {
        deleteRowServer(req.body, ["order_id", "product_id"], "Customer_Orders_Products")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "editOrderProduct") {
        editRowServer(req.body, ["order_id", "product_id"], ["quantity"], "Customer_Orders_Products")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "addOrderProduct") {
        addRowServer(req.body, ["order_id", "product_id", "quantity"], "Customer_Orders_Products")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    // Payment Type References
    else if (req.body.action == "deletePaymentType") {
        deleteRowServer(req.body, ["card_type_code"], "Ref_Card_Types")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "editPaymentType") {
        editRowServer(req.body, ["card_type_code"], ["card_type_description"], "Ref_Card_Types")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "addPaymentType") {
        addRowServer(req.body, ["card_type_description"], "Ref_Card_Types")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    // Product Type References
    else if (req.body.action == "deleteProductType") {
        deleteRowServer(req.body, ["product_type_code"], "Ref_Product_Types")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "editProductType") {
        editRowServer(req.body, ["product_type_code"], ["parent_product_type_code", "product_type_description"], "Ref_Product_Types")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }
    else if (req.body.action == "addProductType") {
        addRowServer(req.body, ["parent_product_type_code", "product_type_description"], "Ref_Product_Types")
        .then((msg) => res.send(msg))
        .catch((err) => console.error(err));
    }        
});

app.listen(app.get("port"), () => {
  console.log("Express started on port: " + app.get("port") + "; press Ctrl-C to terminate.");
});

// SQL queries

// clientSideData: {action: ?, {ids: {idKey1: idVal1, ...}} <- this is the only client-side info
// serverSideIdKeys: [idKey1, idKey2, ...] <- this is server side
// tableName: the name of the table to delete <- this is server-side
deleteRowServer = (clientSideData, serverSideIdKeys, tableName) => {

    let clientSideIdKeys = Object.keys(clientSideData.ids);
    let clientSideIdVals = Object.values(clientSideData.ids);

    // start of query
    let query = "DELETE FROM ?? WHERE ";
    let queryVals = [];
    queryVals.push(tableName);

    // generate rest of query
    for (let i = 0; i < serverSideIdKeys.length; i++) {
        if (i == serverSideIdKeys.length - 1) {
            query += "??=?;";
        }
        else {
            query += "??=? AND ";
        }
    }

    return new Promise((resolve, reject) => {
        if (clientSideIdKeys.length != serverSideIdKeys.length) {
            reject("Expected data size mismatch.");
        }
        else {
            // push each serverSideIdKey and clientSideIdVal to queryVals if it exists
            Array.prototype.forEach.call(serverSideIdKeys, key => {
                // replace empty string with null
                if (clientSideData.ids[key] == "") {
                    queryVals.push(key);
                    queryVals.push(null);
                }
                else if (clientSideData.ids[key] != undefined) {
                    queryVals.push(key);
                    queryVals.push(clientSideData.ids[key]);
                }
                // if an expected serverSideKey does not exist in the clientSideData, reject
                else {
                    reject("Missing expected data.");
                }
            });
            // send query
            mysql.pool.query(query, queryVals, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve("Successfully deleted!");
            })            
        }
    })
}

// clientSideData: {action: ?, {ids: {idKey1: idVal1, ...}, cols: {colKey1: colVal1, ...}} <- this is the only client-side info
// serverSideIdKeys: [idKey1, idKey2, ...] <- this is server-side
// serverSideColKeys: [colKey1, colKey2, ...] <- this is server-side
// tableName: the name of the table to delete <- this is server-side
editRowServer = (clientSideData, serverSideIdKeys, serverSideColKeys, tableName) => {

    let clientSideIdKeys = Object.keys(clientSideData.ids);
    let clientSideIdVals = Object.values(clientSideData.ids);
    let clientSideColKeys = Object.keys(clientSideData.cols);
    let clientSideColVals = Object.values(clientSideData.cols);

    // start of query
    let query = "UPDATE ?? SET ";
    let queryVals = [];
    queryVals.push(tableName);

    // generate rest of query
    for (let i = 0; i < serverSideColKeys.length; i++) {
        if (i == serverSideColKeys.length - 1) {
            query += "??=? WHERE ";
        }
        else {
            query += "??=?, ";
        }
    }
    for (let i = 0; i < serverSideIdKeys.length; i++) {
        if (i == serverSideIdKeys.length - 1) {
            query += "??=?;";
        }
        else {
            query += "??=? AND ";
        }
    }

    return new Promise((resolve, reject) => {
        if (clientSideIdKeys.length != serverSideIdKeys.length || clientSideColKeys.length != serverSideColKeys.length) {
            reject("Expected data size mismatch.");
        }
        else {
            // push each serverSideColKey and clientSideColVal to queryVals if it exists
            Array.prototype.forEach.call(serverSideColKeys, key => {
                // replace empty string with null
                if (clientSideData.cols[key] == "") {
                    queryVals.push(key);
                    queryVals.push(null);
                }
                else if (clientSideData.cols[key] != undefined) {
                    queryVals.push(key);
                    queryVals.push(clientSideData.cols[key]);
                }
                // if an expected serverSideColKey does not exist in the clientSideData, reject
                else {
                    reject("Missing expected data.");
                }
            });
            // push each serverSideIdKey and clientSideIdVal to queryVals if it exists
            Array.prototype.forEach.call(serverSideIdKeys, key => {
                // replace empty string with null
                if (clientSideData.ids[key] == "") {
                    queryVals.push(key);
                    queryVals.push(null);
                }
                else if (clientSideData.ids[key] != undefined) {
                    queryVals.push(key);
                    queryVals.push(clientSideData.ids[key]);
                }
                // if an expected serverSideIdKey does not exist in the clientSideData, reject
                else {
                    reject("Missing expected data.");
                }
            });            
            // send query
            mysql.pool.query(query, queryVals, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve("Successfully edited!");
            })            
        }
    })
}

// clientSideData: {action: ?, {ids: {idKey1: idVal1, ...}, cols: {colKey1: colVal1, ...}} <- this is the only client-side info
// serverSideColKeys: [colKey1, colKey2, ...] <- this is server-side
// tableName: the name of the table to delete <- this is server-side
addRowServer = (clientSideData, serverSideColKeys, tableName) => {

    let clientSideColKeys = Object.keys(clientSideData.cols);
    let clientSideColVals = Object.values(clientSideData.cols);

    // start of query
    let query = "INSERT INTO ?? (";
    let queryVals = [];
    queryVals.push(tableName);

    // generate rest of query
    for (let i = 0; i < serverSideColKeys.length; i++) {
        if (i == serverSideColKeys.length - 1) {
            query += "??) VALUES ("
        }
        else {
            query += "??, ";
        }
    }
    for (let i = 0; i < serverSideColKeys.length; i++) {
        if (i == serverSideColKeys.length - 1) {
            query += "?);";
        }
        else {
            query += "?, ";
        }
    }

    return new Promise((resolve, reject) => {
        if (clientSideColKeys.length != serverSideColKeys.length) {
            reject("Expected data size mismatch.");
        }
        else {
            // push each serverSideColKey to queryVals
            Array.prototype.forEach.call(serverSideColKeys, key => {
                queryVals.push(key);
            });
            // push each clientSideColVal to queryVals if it exists
            Array.prototype.forEach.call(serverSideColKeys, key => {
                // replace empty string with null
                if (clientSideData.cols[key] == "") {
                    queryVals.push(null);
                }
                else if (clientSideData.cols[key] != undefined) {
                    queryVals.push(clientSideData.cols[key]);
                }
                // if an expected serverSideColKey does not exist in the clientSideData, reject
                else {
                    reject("Missing expected data.");
                }
            });          
            // send query
            mysql.pool.query(query, queryVals, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve("Successfully added!");
            })            
        }
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
