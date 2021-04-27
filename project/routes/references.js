const express = require("express");
let router = express.Router();

router.route("/products/add").get((req, res) => {
	res.render("add_product_type");
});

router.route("/products/lookup").get((req, res) => {
	res.render("search_product_type");
});

router.route("/cards/add").get((req, res) => {
	res.render("add_card_type");
})

router.route("/cards/lookup").get((req, res) => {
	res.render("search_card_type");
})

module.exports = router;