const express = require("express");
let router = express.Router();

router.route("/create").get((req, res) => {
	res.render("create_order");
});

router.route("/add").get((req, res) => {
	res.render("add_to_order");
});

router.route("/lookup").get((req, res) => {
	res.render("lookup_order");
})

module.exports = router;