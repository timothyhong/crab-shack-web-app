const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// main page route
router.route("/").get((req, res) => {
	let context = {};
	let firstNames = {};
	let lastNames = {};
	firstNames.cols = ["first_name"];
	lastNames.cols = ["last_name"];
	funcs.getColumns({}, "Customers", false).then(rows => {
    	context.rows = rows;
    }).then(() => funcs.getColumns(firstNames, "Customers", true)).then(rows => {
    	context.firstNames = rows;
    }).then(() => funcs.getColumns(lastNames, "Customers", true)).then(rows => {
    	context.lastNames = rows;
    	res.render('customers', context);
    }).catch(err => console.error(err));
})

// route for search
router.route("/search").get((req, res) => {
	let context = {};
	let data = {};
	data.criteria = {};
	let firstNames = {};
	let lastNames = {};
	firstNames.cols = ["first_name"];
	lastNames.cols = ["last_name"];
	if (req.query.first_name != "" && req.query.first_name != undefined) {
		data.criteria["first_name"] = req.query.first_name;
	}
	if (req.query.last_name != "" && req.query.last_name != undefined) {
		data.criteria["last_name"] = req.query.last_name;
	}
	if (req.query.customer_phone_primary != "" && req.query.customer_phone_primary != undefined) {
		data.criteria["customer_phone_primary"] = req.query.customer_phone_primary;
	}
	funcs.getColumns(data, "Customers", false).then(rows => {
    	context.rows = rows;
    }).then(() => funcs.getColumns(firstNames, "Customers", true)).then(rows => {
    	context.firstNames = rows;
    }).then(() => funcs.getColumns(lastNames, "Customers", true)).then(rows => {
    	context.lastNames = rows;
    	res.render('customers', context);
    }).catch(err => console.error(err));
})

module.exports = router;