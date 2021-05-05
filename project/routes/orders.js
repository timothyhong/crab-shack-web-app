const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

router.route("/create").get((req, res) => {
	let context = {};
	funcs.getData("Ref_Card_Types").then(rows => {
		context.rows = rows;
		 res.render('create_order', context);
    }).catch(err => console.error(err));
});

router.route("/add").get((req, res) => {
	res.render("add_to_order");
});

router.route("/lookup").get((req, res) => {
	let context = {};
	funcs.getData("Customer_Orders").then(rows => {
		context.rows = rows;
		 res.render('lookup_order', context);
    }).catch(err => console.error(err));
});

module.exports = router;