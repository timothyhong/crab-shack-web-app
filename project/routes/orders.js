const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// lookup orders
router.route("/lookup").get((req, res) => {
	let context = {};
	let firstNames = {};
	firstNames.cols = ["first_name"];
	let lastNames = {};
	lastNames.cols = ["last_name"];
	let paymentMethods = {};
	paymentMethods.cols = ["card_type_code", "card_type_description"];
	// need to write two SQL queries for orders and orderProducts
	getOrders(req.query.first_name, req.query.last_name, req.query.customer_phone_primary).then(rows => {
		context.orders = rows;
	}).then(() => funcs.getColumns(firstNames, "Customers", true)).then(rows => {
		context.firstNames = rows;
	}).then(() => funcs.getColumns(lastNames, "Customers", true)).then(rows => {
		context.lastNames = rows;
	}).then(() => funcs.getColumns(paymentMethods, "Ref_Card_Types", true)).then(rows => {
		context.paymentMethods = rows;
		res.render('orders_lookup', context);
	}).catch(err => console.error(err));
});

// order details
router.route("/details").get((req, res) => {
	let context = {};
	let firstNames = {};
	firstNames.cols = ["first_name"];
	let lastNames = {};
	lastNames.cols = ["last_name"];
	let paymentMethods = {};
	paymentMethods.cols = ["card_type_code", "card_type_description"];
	// need to write two SQL queries for orders and orderProducts
	getOrders(req.query.first_name, req.query.last_name, req.query.customer_phone_primary).then(rows => {
		context.orders = rows;
	}).then(() => funcs.getColumns(firstNames, "Customers", true)).then(rows => {
		context.firstNames = rows;
	}).then(() => funcs.getColumns(lastNames, "Customers", true)).then(rows => {
		context.lastNames = rows;
	}).then(() => funcs.getColumns(paymentMethods, "Ref_Card_Types", true)).then(rows => {
		context.paymentMethods = rows;
		res.render('order_details', context);
	}).catch(err => console.error(err));
});

// lookup orders
function getOrders(firstName, lastName, phoneNumber) {
	let baseQuery = "SELECT Customer_Orders.order_id, Customer_Orders.customer_id, Customers.first_name, " +
    "Customers.last_name, Customers.customer_phone_primary, Ref_Card_Types.card_type_description, " +
    "Customer_Orders.card_last_four, IF(Customer_Orders.order_picked_up_yn, 'Yes', 'No') AS order_picked_up_yn, " +
    "IF(Customer_Orders.order_paid_yn, 'Yes', 'No') AS order_paid_yn, Customer_Orders.datetime_order_placed, " +
    "SUM(Customer_Orders_Products.quantity * Products.product_unit_price) AS der_total_order_price, " +
    "Customer_Orders.order_detail FROM Customer_Orders LEFT JOIN Customers ON Customer_Orders.customer_id = Customers.customer_id " +
	"LEFT JOIN Ref_Card_Types ON Customer_Orders.card_type = Ref_Card_Types.card_type_code " +
	"LEFT JOIN Customer_Orders_Products ON Customer_Orders.order_id = Customer_Orders_Products.order_id " +
	"LEFT JOIN Products ON Customer_Orders_Products.product_id = Products.product_id ";

	let endQuery = "GROUP BY Customer_Orders.order_id;";

	let criteriaQuery = "";
	let queryVals = [];
	if (firstName != "") {
		criteriaQuery += "Customers.first_name = ? AND ";
		queryVals.push(firstName);
	}
	if (lastName != "") {
		criteriaQuery += "Customers.last_name = ? AND ";
		queryVals.push(lastName);
	}
	if (phoneNumber != "") {
		criteriaQuery += "Customers.customer_phone_primary = ? AND ";
		queryVals.push(phoneNumber);
	}
	// remove the trailing AND from query
	criteriaQuery = criteriaQuery.substring(0, criteriaQuery.length - 4);
	// add WHERE clause and semicolon
	criteriaQuery = "WHERE " + criteriaQuery;

	// display all orders
	if ((!firstName || firstName == "") && (!lastName || lastName == "") && (!phoneNumber || phoneNumber == "")) {
		return new Promise((resolve, reject) => {
            mysql.pool.query(baseQuery + endQuery, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            })
        })
    }
    // search by filters
    else {
        return new Promise((resolve, reject) => {
            mysql.pool.query(baseQuery + criteriaQuery + endQuery, queryVals, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            })
        })
    }
}

// lookup order products
function getOrderProducts(orderId) {
	let baseQuery = "SELECT Customer_Orders.order_id, Customer_Orders.customer_id, Customers.first_name, " +
    "Customers.last_name, Customers.customer_phone_primary, Ref_Card_Types.card_type_description, " +
    "Customer_Orders.card_last_four, IF(Customer_Orders.order_picked_up_yn, 'Yes', 'No') AS order_picked_up_yn, " +
    "IF(Customer_Orders.order_paid_yn, 'Yes', 'No') AS order_paid_yn, Customer_Orders.datetime_order_placed, " +
    "SUM(Customer_Orders_Products.quantity * Products.product_unit_price) AS der_total_order_price, " +
    "Customer_Orders.order_detail FROM Customer_Orders LEFT JOIN Customers ON Customer_Orders.customer_id = Customers.customer_id " +
	"LEFT JOIN Ref_Card_Types ON Customer_Orders.card_type = Ref_Card_Types.card_type_code " +
	"LEFT JOIN Customer_Orders_Products ON Customer_Orders.order_id = Customer_Orders_Products.order_id " +
	"LEFT JOIN Products ON Customer_Orders_Products.product_id = Products.product_id ";

	let endQuery = "GROUP BY Customer_Orders.order_id;";	

	let criteriaQuery = "";
	let queryVals = [];
	if (firstName != "") {
		criteriaQuery += "Customers.first_name = ? AND ";
		queryVals.push(firstName);
	}
	if (lastName != "") {
		criteriaQuery += "Customers.last_name = ? AND ";
		queryVals.push(lastName);
	}
	if (phoneNumber != "") {
		criteriaQuery += "Customers.customer_phone_primary = ? AND ";
		queryVals.push(phoneNumber);
	}
	// remove the trailing AND from query
	criteriaQuery = criteriaQuery.substring(0, criteriaQuery.length - 4);
	// add WHERE clause
	criteriaQuery = "WHERE " + criteriaQuery;

	// display all orders
	if ((!firstName || firstName == "") && (!lastName || lastName == "") && (!phoneNumber || phoneNumber == "")) {
		return new Promise((resolve, reject) => {
            mysql.pool.query(baseQuery + endQuery, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            })
        })
    }
    // search by filters
    else {
        return new Promise((resolve, reject) => {
            mysql.pool.query(baseQuery + criteriaQuery + endQuery, queryVals, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            })
        })
    }
}

module.exports = router;