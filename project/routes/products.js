const express = require("express");
let router = express.Router();

router.route("/add").get((req, res) => {
	res.render("add_product");
});

router.route("/lookup").get((req, res) => {
	res.render("lookup_product");
})

module.exports = router;