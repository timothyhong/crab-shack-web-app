const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

router.route("/add").get((req, res) => {
	res.render("add_customer");
});

router.route("/lookup").get((req, res) => {
	let context = {};
	funcs.getData("Customers").then(rows => {
    	context.rows = rows;
    	res.render('lookup_customer', context);
    }).catch(err => console.error(err));
})

module.exports = router;