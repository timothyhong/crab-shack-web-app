const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// main page route
router.route("/").get((req, res) => {
	let context = {};

	getProducts().then(rows => {
		context.rows = rows;
	}).then(() => funcs.getColumns({tableName: "Ref_Product_Types", colNames: ["product_type_description", "product_type_code"]})).then(rows => {
		context.productTypes = rows;
		res.render('products', context);
	}).catch(err => console.error(err));
});

// route for product type search
router.route("/search").get((req, res) => {
	let context = {};

	getProducts(req.query.product_type_code).then(rows => {
		context.rows = rows;
	}).then(() => funcs.getColumns({tableName: "Ref_Product_Types", colNames: ["product_type_description", "product_type_code"]})).then(rows => {
		context.productTypes = rows;
		res.render('products', context);
	}).catch(err => console.error(err));
});

// lookup rows matching product_type_code
function getProducts(productTypeCode) {
	const baseQuery = "SELECT `product_id`, `product_type_description`, `product_name`, `product_unit_price`, " +
	"`product_unit_size`, `product_description` FROM `Products` LEFT JOIN `Ref_Product_Types` ON " +
	"Products.product_type_code = Ref_Product_Types.product_type_code;";

	// recursive query to get all products that descend from a parent_product_type_code
	const recursiveQuery = "WITH RECURSIVE cte_products AS (SELECT product_type_code, parent_product_type_code, product_type_description FROM Ref_Product_Types WHERE product_type_code = ? " +
      "UNION ALL SELECT child.product_type_code, child.parent_product_type_code, child.product_type_description FROM Ref_Product_Types AS child JOIN cte_products AS parent ON " +
      "parent.product_type_code = child.parent_product_type_code) SELECT Products.product_id, cte_products.product_type_description, Products.product_name, Products.product_unit_price, Products.product_unit_size, " +
      "Products.product_description FROM cte_products JOIN Ref_Product_Types ON cte_products.product_type_description = Ref_Product_Types.product_type_description JOIN Products " +
      "ON Ref_Product_Types.product_type_code = Products.product_type_code;";

	// display all products
	if (!productTypeCode || productTypeCode == "") {
		return new Promise((resolve, reject) => {
            mysql.pool.query(baseQuery, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            })
        })
    }
    // search by product_type_code
    else if (productTypeCode != "") {
        return new Promise((resolve, reject) => {
            mysql.pool.query(recursiveQuery, [productTypeCode], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            })
        })
    }
}

module.exports = router;