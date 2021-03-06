/*
    Author: Timothy Hong, Antonio Irizarry
    Class: CS 340
    Date: 04/26/21
    Title: Crabshack server-side
    Description: Server-side for Crabshack
*/

const mysql = require('./dbcon.js');
const express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout: 'index', helpers: {formatUSD: (value) => {
    if (value) {
        return "$" + value.toFixed(2);
    }
    else {
        return "$0.00";
    }
}}});
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
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "editProduct") {
        editRowServer(req.body, ["product_id"], ["product_type_code", "product_name", "product_unit_price", 
            "product_unit_size", "product_description"], "Products")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "addProduct") {
        addRowServer(req.body, ["product_type_code", "product_name", "product_unit_price", 
            "product_unit_size", "product_description"], "Products")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    // Customers
    else if (req.body.action == "deleteCustomer") {
        deleteRowServer(req.body, ["customer_id"], "Customers")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "editCustomer") {
        editRowServer(req.body, ["customer_id"], ["first_name", "middle_name", "last_name", 
            "customer_phone_primary", "customer_phone_secondary", "customer_email", 
            "address_line_1", "address_line_2", "city", "zip_code", "state", "customer_info"], "Customers")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "addCustomer") {
        addRowServer(req.body, ["first_name", "middle_name", "last_name", 
            "customer_phone_primary", "customer_phone_secondary", "customer_email", 
            "address_line_1", "address_line_2", "city", "zip_code", "state", "customer_info"], "Customers")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    // Orders
    else if (req.body.action == "deleteOrder") {
        deleteRowServer(req.body, ["order_id"], "Customer_Orders")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "editOrder") {
        editRowServer(req.body, ["order_id"], ["customer_id", "card_type_code", "card_last_four", 
            "order_picked_up_yn", "order_paid_yn", "datetime_order_placed", "order_detail"], "Customer_Orders")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "addOrder") {
        addRowServer(req.body, ["customer_id", "card_type_code", "card_last_four", 
            "order_picked_up_yn", "order_paid_yn", "datetime_order_placed", "order_detail"], "Customer_Orders")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    // Order Products
    else if (req.body.action == "deleteOrderProduct") {
        deleteRowServer(req.body, ["order_id", "product_id"], "Customer_Orders_Products")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "editOrderProduct") {
        editRowServer(req.body, ["order_id", "product_id"], ["quantity"], "Customer_Orders_Products")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "addOrderProduct") {
        addRowServer(req.body, ["order_id", "product_id", "quantity"], "Customer_Orders_Products")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    // Payment Type References
    else if (req.body.action == "deletePaymentType") {
        deleteRowServer(req.body, ["card_type_code"], "Ref_Card_Types")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "editPaymentType") {
        editRowServer(req.body, ["card_type_code"], ["card_type_description"], "Ref_Card_Types")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "addPaymentType") {
        addRowServer(req.body, ["card_type_description"], "Ref_Card_Types")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    // Product Type References
    else if (req.body.action == "deleteProductType") {
        deleteRowServer(req.body, ["product_type_code"], "Ref_Product_Types")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "editProductType") {
        editRowServer(req.body, ["product_type_code"], ["parent_product_type_code", "product_type_description"], "Ref_Product_Types")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
    }
    else if (req.body.action == "addProductType") {
        addRowServer(req.body, ["parent_product_type_code", "product_type_description"], "Ref_Product_Types")
        .then((msg) => res.send(msg))
        .catch((err) => res.send("ERROR: " + err));
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

    return new Promise((resolve, reject) => {
        if (clientSideIdKeys.length != serverSideIdKeys.length) {
            reject("Expected data size mismatch.");
        }
        // push each serverSideIdKey and clientSideIdVal to queryVals if it exists
        else {
            for (let i = 0; i < serverSideIdKeys.length; i++) {
                if (clientSideData.ids[serverSideIdKeys[i]] !== undefined) {
                    // update query
                    if (i == serverSideIdKeys.length - 1) {
                        query += "??=?;";
                    }
                    else {
                        query += "??=? AND ";
                    }
                    // push values, replacing "" with null
                    queryVals.push(serverSideIdKeys[i]);
                    if (clientSideData.ids[serverSideIdKeys[i]] == "") {
                        queryVals.push(null);
                    }
                    else {
                        queryVals.push(clientSideData.ids[serverSideIdKeys[i]]);                       
                    }
                }
                // if an expected serverSideKey does not exist in the clientSideData, reject
                else {
                    reject("Missing expected data.");
                }
            }
            // send query
            mysql.pool.query(query, queryVals, (err, results) => {
                if (err) {
                    reject("There was an error deleting this row.");
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

/*
    UPDATE query that updates valid clientSideData from tableName.

    :param clientSideData: object containing a dictionary cols with key/value pairs representing column names and column values to be added
        and a dictionary ids with key/value pairs representing column names and values for the criteria to check against.
        example: {action: ?, {ids: {idKey1: idVal1, ...}, cols: {colKey1: colVal1, ...}}
    :param serverSideIdKeys: array of valid criteria column names to query on
    :param serverSideColKeys: array of valid column names to query on
    :param tableName: the name of the table to query
    :returns: MYSQL query results or error
 
    Notes:
    -The only client-side data used are the column values. Everything else is server-side input.
*/
editRowServer = (clientSideData, serverSideIdKeys, serverSideColKeys, tableName) => {

    let clientSideIdKeys = Object.keys(clientSideData.ids);
    let clientSideIdVals = Object.values(clientSideData.ids);
    let clientSideColKeys = Object.keys(clientSideData.cols);
    let clientSideColVals = Object.values(clientSideData.cols);

    // start of query
    let query = "UPDATE ?? SET ";
    let queryVals = [];
    queryVals.push(tableName);

    return new Promise((resolve, reject) => {
         // validate clientSideData
        let invalidPhone = false;
        let invalidZipCode = false;
        let invalidState = false;
        let invalidPrice = false;
        let invalidQuantity = false;
        let invalidCardLastFour = false;

        Array.prototype.forEach.call(serverSideColKeys, key => {
            if (clientSideData.cols[key] && ((key == "customer_phone_primary" && !isValidPhoneNumber(clientSideData.cols[key]) || 
                (key == "customer_phone_secondary" && !isValidPhoneNumber(clientSideData.cols[key]))))) {
                invalidPhone = true;
            }
            else if (key == "zip_code" && clientSideData.cols[key] && !isValidZipCode(clientSideData.cols[key])) {
                invalidZipCode = true;
            }
            else if (key == "state" && clientSideData.cols[key] && !isValidState(clientSideData.cols[key])) {
                invalidState = true;
            }
            else if (key == "product_unit_price" && clientSideData.cols[key] && !isValidPrice(clientSideData.cols[key])) {
                invalidPrice = true;
            }
            else if (key == "quantity" && clientSideData.cols[key] && !isValidQuantity(clientSideData.cols[key])) {
                invalidQuantity = true;
            }
            else if (key == "card_last_four" && clientSideData.cols[key] && !isValidCardLastFour(clientSideData.cols[key])) {
                invalidCardLastFour = true;
            }
        });

        if (invalidPhone) {
            return reject("Phone number format is invalid.");
        }
        if (invalidZipCode) {
            return reject("Invalid zip code format.");
        }
        if (invalidState) {
            return reject("Invalid state format.");
        }
        if (invalidPrice) {
            return reject("Invalid price format.");
        }
        if (invalidQuantity) {
            return reject("Invalid quantity format.");
        }
        if (invalidCardLastFour) {
            return reject("Invalid card last four format.");
        }
        if (clientSideIdKeys.length != serverSideIdKeys.length || clientSideColKeys.length != serverSideColKeys.length) {
            return reject("Expected data size mismatch.");
        }
        else {
            for (let i = 0; i < serverSideColKeys.length; i++) {
                if (clientSideData.cols[serverSideColKeys[i]] !== undefined) {
                    // update query
                    if (i == serverSideColKeys.length - 1) {
                        query += "??=? WHERE ";
                    }
                    else {
                        query += "??=?, ";
                    }
                    // push values, replacing "" with null
                    queryVals.push(serverSideColKeys[i]);
                    if (clientSideData.cols[serverSideColKeys[i]] == "") {
                        queryVals.push(null);
                    }
                    else {
                        queryVals.push(clientSideData.cols[serverSideColKeys[i]]);                       
                    }
                }
                // if an expected serverSideColKey does not exist in the clientSideData, reject
                else {
                    return reject("Missing expected data.");
                }
            }
            for (let i = 0; i < serverSideIdKeys.length; i++) {
                if (clientSideData.ids[serverSideIdKeys[i]] !== undefined) {
                    // update query
                    if (i == serverSideIdKeys.length - 1) {
                        query += "??=?;";
                    }
                    else {
                        query += "??=? AND ";
                    }
                    // push values, replacing "" with null
                    queryVals.push(serverSideIdKeys[i]);
                    if (clientSideData.ids[serverSideIdKeys[i]] == "") {
                        queryVals.push(null);
                    }
                    else {
                        queryVals.push(clientSideData.ids[serverSideIdKeys[i]]);                       
                    }
                }
                // if an expected serverSideIdKey does not exist in the clientSideData, reject
                else {
                    return reject("Missing expected data.");
                }
            }      
            // send query
            mysql.pool.query(query, queryVals, (err, results) => {
                if (err) {
                    return reject("There was an error editing this row.");
                }
                return resolve("Successfully edited!");
            })            
        }
    })
}

/*
    INSERT query that adds valid clientSideData into tableName.

    :param clientSideData: object containing a dictionary cols with key/value pairs representing column names and column values to be added
        example: {action: ?, {ids: {idKey1: idVal1, ...}, cols: {colKey1: colVal1, ...}}
    :param serverSideColKeys: array of valid column names to query on
    :param tableName: the name of the table to query
    :returns: MYSQL query results or error
 
    Notes:
    -The only client-side data used are the column values. Everything else is server-side input.
*/
addRowServer = (clientSideData, serverSideColKeys, tableName) => {

    let clientSideColKeys = Object.keys(clientSideData.cols);
    let clientSideColVals = Object.values(clientSideData.cols);

    // start of query
    let query = "INSERT INTO ?? (";
    let queryVals = [];
    queryVals.push(tableName);

    return new Promise((resolve, reject) => {
        // validate clientSideData
        let invalidPhone = false;
        let invalidZipCode = false;
        let invalidState = false;
        let invalidPrice = false;
        let invalidQuantity = false;
        let invalidCardLastFour = false;

        Array.prototype.forEach.call(serverSideColKeys, key => {
            if (clientSideData.cols[key] && ((key == "customer_phone_primary" && !isValidPhoneNumber(clientSideData.cols[key]) || 
                (key == "customer_phone_secondary" && !isValidPhoneNumber(clientSideData.cols[key]))))) {
                invalidPhone = true;
            }
            else if (key == "zip_code" && clientSideData.cols[key] && !isValidZipCode(clientSideData.cols[key])) {
                invalidZipCode = true;
            }
            else if (key == "state" && clientSideData.cols[key] && !isValidState(clientSideData.cols[key])) {
                invalidState = true;
            }
            else if (key == "product_unit_price" && clientSideData.cols[key] && !isValidPrice(clientSideData.cols[key])) {
                invalidPrice = true;
            }
            else if (key == "quantity" && clientSideData.cols[key] && !isValidQuantity(clientSideData.cols[key])) {
                invalidQuantity = true;
            }
            else if (key == "card_last_four" && clientSideData.cols[key] && !isValidCardLastFour(clientSideData.cols[key])) {
                invalidCardLastFour = true;
            }
        });

        if (invalidPhone) {
            return reject("Phone number format is invalid.");
        }
        if (invalidZipCode) {
            return reject("Invalid zip code format.");
        }
        if (invalidState) {
            return reject("Invalid state format.");
        }
        if (invalidPrice) {
            return reject("Invalid price format.");
        }
        if (invalidQuantity) {
            return reject("Invalid quantity format.");
        }
        if (invalidCardLastFour) {
            return reject("Invalid card last four format.");
        }
        if (clientSideColKeys.length != serverSideColKeys.length) {
            return reject("Expected data size mismatch.");
        }
        else {
            // continue query and push each serverSideColKey to queryVals
            for (let i = 0; i < serverSideColKeys.length; i++) {
                if (i == serverSideColKeys.length - 1) {
                    query += "??) VALUES ("
                }
                else {
                    query += "??, ";
                }
                queryVals.push(serverSideColKeys[i]);
            }
            // continue query and push each value to queryVals
            for (let i = 0; i < serverSideColKeys.length; i++) {
                if (clientSideData.cols[serverSideColKeys[i]] !== undefined) {
                    // update query
                    if (i == serverSideColKeys.length - 1) {
                        query += "?);";
                    }
                    else {
                        query += "?, ";
                    }
                    // push values, replacing "" with null
                    if (clientSideData.cols[serverSideColKeys[i]] == "") {
                        queryVals.push(null);
                    }
                    else {
                        queryVals.push(clientSideData.cols[serverSideColKeys[i]]);
                    }
                }
                // if an expected serverSideColKey does not exist in the clientSideData, reject
                else {
                    return reject("Missing expected data.");
                }
            }      
            // send query
            mysql.pool.query(query, queryVals, (err, results) => {
                if (err) {
                    return reject("There was an error adding this row. Check that it doesn't already exist.");
                }
                return resolve("Successfully added!");
            })            
        }
    })
}

/*
    SELECT query that returns (distinct) rows from colNames matching criteria from tableName

    :param tableName: the name of the table to query
    :param colNames: an array containing the names of columns to retrieve
    :param criteria: a dictionary object containing the criteria columns as keys and criteria values as values
    :param distinct: bool, true (return only unique rows), false (all)
    :param ascending: bool, true (sort by ascending), false (sort by descending)
    :returns: MYSQL query results or error
 
    Notes:
    -The only client-side data used are the criteria values. Everything else is server-side input.
    -if colNames === undefined, SELECT * FROM ...
    -if criteria === undefined, SELECT colName1, colName2, ... FROM tableName;
*/
module.exports.getColumns = ({tableName, colNames, criteria, distinct = false, ascending = true}) => {

    if (!tableName) {
        throw "tableName is required!";
    }
    
    // start of query
    let query = "SELECT ";
    let queryVals = [];

    // if distinct
    if (distinct) {
        query += "DISTINCT "
    }

    // if colNames
    if (colNames && colNames.length > 0) {
        for (let i = 0; i < colNames.length; i++) {
            if (i == colNames.length - 1) {
                query += "?? FROM ?? ";
            }
            else {
                query += "??, ";
            }
            queryVals.push(colNames[i]);
        }
    }
    else {
        query += "* FROM ?? ";
    }

    // push tableName
    queryVals.push(tableName);

    let criteriaKeys = [];
    let criteriaVals = [];

    // if criteria
    if (criteria && Object.keys(criteria).length > 0) {

        // check if criteria values are nonempty
        Array.prototype.forEach.call(Object.keys(criteria), key => {
            if (criteria[key] != "") {
                criteriaKeys.push(key);
                criteriaVals.push(criteria[key]);
            }
        })
    }

    // construct query for valid criteria
    if (criteriaKeys.length > 0) {
        query += "WHERE "
        for (let i = 0; i < criteriaKeys.length; i++) {
            if (i == criteriaKeys.length - 1) {
                query += "?? = ? ";
            }
            else {
                query += "?? = ? AND ";
            }
            queryVals.push(criteriaKeys[i]);
            queryVals.push(criteriaVals[i]);
        }
    }

    // if colNames, order by them
    if (colNames && colNames.length > 0) {
        query += "ORDER BY ";
        for (let i = 0; i < colNames.length; i++) {
            if (i == colNames.length - 1) {
                query += "??";
            }
            else {
                query += "??, ";
            }
            queryVals.push(colNames[i]);
        }
        if (ascending) {
            query += "ASC;";
        }
        else {
            query += "DESC;";
        }
    }
    else {
        query += ";";
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

// server-side data validation



// returns true/false
isValidPhoneNumber = (number) => {
    let format = /^([0-9]{3})-([0-9]{3})-([0-9]{4})$/;
    if (number && number.match(format)) {
        return true;
    }
    return false;
}

isValidZipCode = (zip) => {
    let format = /^[0-9]{5}$/;
    if (zip && zip.match(format)) {
        return true;
    }
    return false;
}

// not a real check, just checking for two capital letters
isValidState = (state) => {
    let format = /^[A-Z]{2}$/;
    if (state && state.match(format)) {
        return true;
    }
    return false;
}

isValidPrice = (price) => {
    let format = /^\d{0,8}(\.\d{2})?$/;
    if (price && price.match(format)) {
        return true;
    }
    return false;
}

isValidQuantity = (quantity) => {
    let format = /^[1-9]\d*$/;
    if (quantity && quantity.match(format)) {
        return true;
    }
    return false;
}

isValidCardLastFour = (card_last_four) => {
    let format = /^\d{4}$/;
    if (card_last_four && card_last_four.match(format)) {
        return true;
    }
    return false;
}
