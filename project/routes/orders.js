const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// main page route
router.route("/").get((req, res) => {
	let context = {};

	getOrders(req.query.order_id, req.query.customer_id).then(rows => {
		context.orders = rows;
	}).then(() => getOrderProducts(req.query.order_id, req.query.customer_id)).then(rows => {
		context.orderProducts = rows;
	}).then(() => funcs.getColumns({tableName: "Customer_Orders", colNames: ["order_id"], distinct: true})).then(rows => {
		context.orderIds = rows;
	}).then(() => funcs.getColumns({tableName: "Customers", colNames: ["customer_phone_primary"], distinct: true})).then(rows => {
		context.primaryPhones = rows;
	}).then(() => funcs.getColumns({tableName: "Ref_Card_Types", colNames: ["card_type_code", "card_type_description"], distinct: true})).then(rows => {
		context.paymentMethods = rows;
	}).then(() => getCustomerDescriptions()).then(rows => {
		context.customers = rows;
	}).then(() => funcs.getColumns({tableName: "Products", colNames: ["product_id", "product_name"], distinct: true})).then(rows => {
		context.productNames = rows;
		res.render('orders', context);
	}).catch(err => console.error(err));
});

// lookup orders
function getOrders(orderId, customerId) {
	let baseQuery = "SELECT Customer_Orders.order_id, Customer_Orders.customer_id, Customers.first_name, " +
    "Customers.last_name, Customers.customer_phone_primary, Ref_Card_Types.card_type_description, " +
    "Customer_Orders.card_last_four, IF(Customer_Orders.order_picked_up_yn, 'Yes', 'No') AS order_picked_up_yn, " +
    "IF(Customer_Orders.order_paid_yn, 'Yes', 'No') AS order_paid_yn, DATE_FORMAT(Customer_Orders.datetime_order_placed, '%Y-%m-%dT%H:%i') AS datetime_order_placed, " +
    "SUM(Customer_Orders_Products.quantity * Products.product_unit_price) AS der_total_order_price, " +
    "Customer_Orders.order_detail FROM Customer_Orders LEFT JOIN Customers ON Customer_Orders.customer_id = Customers.customer_id " +
	"LEFT JOIN Ref_Card_Types ON Customer_Orders.card_type_code = Ref_Card_Types.card_type_code " +
	"LEFT JOIN Customer_Orders_Products ON Customer_Orders.order_id = Customer_Orders_Products.order_id " +
	"LEFT JOIN Products ON Customer_Orders_Products.product_id = Products.product_id ";
	let endQuery = "GROUP BY Customer_Orders.order_id;";
	let criteriaQuery = "";
	let query;
	let queryVals = [];

	if (orderId != "") {
		criteriaQuery += "Customer_Orders.order_id = ? AND ";
		queryVals.push(orderId);
	}
	if (customerId != "") {
		criteriaQuery += "Customers.customer_id = ? AND ";
		queryVals.push(customerId);
	}
	// remove the trailing AND from query
	criteriaQuery = criteriaQuery.substring(0, criteriaQuery.length - 4);
	// add WHERE clause and semicolon
	criteriaQuery = "WHERE " + criteriaQuery;

	// display all orders
	if ((!orderId || orderId == "") && (!customerId || customerId == "")) {
		query = baseQuery + endQuery;
    }
    // search by filters
    else {
    	query = baseQuery + criteriaQuery + endQuery;
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

// lookup order products
function getOrderProducts(orderId, customerId) {
	let baseQuery = "SELECT Customer_Orders.order_id, Products.product_id, Products.product_name, " +
    "Products.product_unit_price, Customer_Orders_Products.quantity FROM Customer_Orders " +
    "JOIN Customer_Orders_Products USING (order_id) JOIN Products USING (product_id) JOIN Customers USING " +
    "(customer_id) ";
	let endQuery = "ORDER BY Customer_Orders.order_id;";	
	let criteriaQuery = "";
	let query;
	let queryVals = [];

	if (orderId != "") {
		criteriaQuery += "Customer_Orders.order_id = ? AND ";
		queryVals.push(orderId);
	}
	if (customerId != "") {
		criteriaQuery += "Customers.customer_id = ? AND ";
		queryVals.push(customerId);
	}
	// remove the trailing AND from query
	criteriaQuery = criteriaQuery.substring(0, criteriaQuery.length - 4);
	// add WHERE clause
	criteriaQuery = "WHERE " + criteriaQuery;

	// display all orders
	if ((!orderId || orderId == "") && (!customerId || customerId == "")) {
		query = baseQuery + endQuery;
    }
    // filter with criteria
    else {
    	query = baseQuery + criteriaQuery + endQuery;
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

function getCustomerDescriptions() {
	let query = "SELECT customer_id, CONCAT(first_name, ' ', last_name, ', ', customer_phone_primary) AS customer_desc FROM Customers;";
    return new Promise((resolve, reject) => {
        mysql.pool.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

module.exports = router;