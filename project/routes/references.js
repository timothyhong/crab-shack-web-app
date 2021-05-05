const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

router.route("/products").get((req, res) => {
	let context = {};
	funcs.getData("Ref_Product_Types").then(rows => {
        context.rows = rows;
        res.render('ref_products', context);
    }).catch(err => console.error(err));
});

router.route("/cards").get((req, res) => {
	let context = {};
	funcs.getData("Ref_Card_Types").then(rows => {
        context.rows = rows;
        res.render('ref_cards', context);
    }).catch(err => console.error(err));
});

module.exports = router;