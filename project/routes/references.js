const express = require("express");
const mysql = require('../dbcon.js');
const funcs = require('../index.js');
let router = express.Router();

// main page route
router.route("/").get((req, res) => {
    let context = {};

    getProductTypes().then(rows => {
        context.productTypes = rows;
        if (rows.length == 0) {
            context.message = "No product types to display.";
        }
        else {
            context.message = "Displaying all " + rows.length + " product types.";
        }
    }).then(() => funcs.getColumns({tableName: "Ref_Card_Types", colNames: ["card_type_code", "card_type_description"]})).then(rows => {
        context.cardTypes = rows;
        if (rows.length == 0) {
            context.message2 = "No card types to display.";
        }
        else {
            context.message2 = "Displaying all " + rows.length + " payment types.";
        }
        res.render('references', context);
    }).catch(err => console.error(err));
});

function getProductTypes() {

    const query = "SELECT child.product_type_code, child.product_type_description, parent.product_type_description " +
    "AS parent_product_type_description FROM Ref_Product_Types child LEFT JOIN Ref_Product_Types parent ON " +
    "child.parent_product_type_code = parent.product_type_code;"

    return new Promise((resolve, reject) => {
        mysql.pool.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }            resolve(results);
        })
    })

}

module.exports = router;