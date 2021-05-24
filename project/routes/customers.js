const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// main page route
router.route("/").get((req, res) => {
	let context = {};
	let criteria = {}
	if (req.query.first_name != undefined && req.query.last_name != undefined) {
		funcs.getColumns({tableName: "Customers", colNames: ["first_name"], distinct: true}).then(rows => {
			context.firstNames = rows;
	    }).then(() => funcs.getColumns({tableName: "Customers", colNames: ["last_name"], distinct: true})).then(rows => {
	    	context.lastNames = rows;
	    	res.send(context);
	    }).catch(err => console.error(err));
	}
	else if (req.query.first_name != undefined) {
		criteria["first_name"] = req.query.first_name;

		funcs.getColumns({tableName: "Customers", colNames: ["last_name"], criteria, distinct: true}).then(rows => {
	    	res.send(rows);
	    }).catch(err => console.error(err));
	}
	else if (req.query.last_name != undefined) {
		criteria["last_name"] = req.query.last_name;

		funcs.getColumns({tableName: "Customers", colNames: ["first_name"], criteria, distinct: true}).then(rows => {
	    	res.send(rows);
	    }).catch(err => console.error(err));
	}
	else {
		funcs.getColumns({tableName: "Customers"}).then(rows => {
	    	context.rows = rows;
	    }).then(() => funcs.getColumns({tableName: "Customers", colNames: ["first_name"], distinct: true})).then(rows => {
	    	context.firstNames = rows;
	    }).then(() => funcs.getColumns({tableName: "Customers", colNames: ["last_name"], distinct: true})).then(rows => {
	    	context.lastNames = rows;
	    	res.render('customers', context);
	    }).catch(err => console.error(err));
	}
})

// route for search
router.route("/search").get((req, res) => {
	let context = {};

	let criteria = {};
	if (req.query.first_name != "" && req.query.first_name != undefined) {
		criteria["first_name"] = req.query.first_name;
	}
	if (req.query.last_name != "" && req.query.last_name != undefined) {
		criteria["last_name"] = req.query.last_name;
	}
	if (req.query.customer_phone_primary != "" && req.query.customer_phone_primary != undefined) {
		criteria["customer_phone_primary"] = req.query.customer_phone_primary;
	}

	funcs.getColumns({tableName: "Customers", criteria: criteria}).then(rows => {
    	context.rows = rows;
    }).then(() => funcs.getColumns({tableName: "Customers", colNames: ["first_name"], distinct: true})).then(rows => {
    	context.firstNames = rows;
    }).then(() => funcs.getColumns({tableName: "Customers", colNames: ["last_name"], distinct: true})).then(rows => {
    	context.lastNames = rows;
    	res.render('customers', context);
    }).catch(err => console.error(err));
})

module.exports = router;