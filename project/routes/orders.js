const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// main page route
router.route("/").get((req, res) => {
	let context = {};
	let data = {};
	data.cols = ["product_type_description", "product_type_code"];
	getProducts().then(rows => {
		context.rows = rows;
	}).then(() => funcs.getColumns(data, "Ref_Product_Types", false)).then(rows => {
		context.productTypes = rows;
		res.render('products', context);
	}).catch(err => console.error(err));
});


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