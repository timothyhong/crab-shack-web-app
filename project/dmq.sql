-- SQL Queries for Website

-------------------
-- CUSTOMERS PAGE--
-------------------

-- SELECT query
SELECT
    *
FROM
    `Customers`;

-- INSERT query
INSERT INTO `Customers`(
    `first_name`,
    `middle_name`,
    `last_name`,
    `customer_phone_primary`,
    `customer_phone_secondary`,
    `customer_email`,
    `address_line_1`,
    `address_line_2`,
    `city`,
    `zip_code`,
    `state`,
    `customer_info`
)
VALUES(:val1, :val2, :val3, :val4, :val5, :val6, :val7, :val8, :val9, :val10, :val11, :val12);

-- UPDATE query
UPDATE
    `Customers`
SET
    `first_name` = :val1,
    `middle_name` = :val2,
    `last_name` = :val3,
    `customer_phone_primary` = :val4,
    `customer_phone_secondary` = :val5,
    `customer_email` = :val6,
    `address_line_1` = :val7,
    `address_line_2` = :val8,
    `city` = :val9,
    `zip_code` = :val10,
    `state` = :val11,
    `customer_info` = :val12
WHERE
    `customer_id` = :val13;

-- DELETE query
DELETE
FROM
    `Customers`
WHERE
    `customer_id` = :val1;

------------------
-- PRODUCTS PAGE--
------------------

-- SELECT query
SELECT
    `product_id`,
    `product_type_description`,
    `product_name`,
    `product_unit_price`,
    `product_unit_size`,
    `product_description`
FROM
    `Products`
LEFT JOIN `Ref_Product_Types` ON Products.product_type_code = Ref_Product_Types.product_type_code;

-- INSERT query
INSERT INTO `Products`(
    `product_name`,
    `product_type_code`,
    `product_unit_price`,
    `product_unit_size`,
    `product_description`
)
VALUES(:val1, :val2, :val3, :val4, :val5);

-- UPDATE query
UPDATE
    `Products`
SET
    `product_name` = :val1,
    `product_type_code` = :val2,
    `product_unit_price` = :val3,
    `product_unit_size` = :val4,
    `product_description` = :val5
WHERE
    `product_id` = :val6;

-- DELETE query
DELETE
FROM
    `Products`
WHERE
    `product_id` = :val1;
   
-- Filter by products that have parent_product_type_code as an ancestor
WITH
    RECURSIVE cte_products AS(
    SELECT
        product_type_code,
        parent_product_type_code,
        product_type_description
    FROM
        Ref_Product_Types
    WHERE
        product_type_code = :val1
    UNION ALL
SELECT
    child.product_type_code,
    child.parent_product_type_code,
    child.product_type_description
FROM
    Ref_Product_Types AS child
JOIN cte_products AS parent
ON
    parent.product_type_code = child.parent_product_type_code
)
SELECT
    cte_products.product_type_description,
    Products.product_name,
    Products.product_unit_price,
    Products.product_unit_size,
    Products.product_description
FROM
    cte_products
LEFT JOIN Ref_Product_Types ON cte_products.product_type_description = Ref_Product_Types.product_type_description
LEFT JOIN Products ON Ref_Product_Types.product_type_code = Products.product_type_code;


----------------
-- ORDERS PAGE--
----------------

-- SELECT query
SELECT
    Customer_Orders.order_id,
    Customer_Orders.customer_id,
    Customers.first_name,
    Customers.last_name,
    Customers.customer_phone_primary,
    Ref_Card_Types.card_type_description,
    Customer_Orders.card_last_four,
    IF(
        Customer_Orders.order_picked_up_yn,
        'Yes',
        'No'
    ) AS order_picked_up_yn,
    IF(
        Customer_Orders.order_paid_yn,
        'Yes',
        'No'
    ) AS order_paid_yn,
    DATE_FORMAT(Customer_Orders.datetime_order_placed, '%Y-%m-%dT%H:%i') AS datetime_order_placed,
    SUM(
        Customer_Orders_Products.quantity * Products.product_unit_price
    ) AS der_total_order_price,
    Customer_Orders.order_detail
FROM
    Customer_Orders
LEFT JOIN Customers ON Customer_Orders.customer_id = Customers.customer_id
LEFT JOIN Ref_Card_Types ON Customer_Orders.card_type = Ref_Card_Types.card_type_code
LEFT JOIN Customer_Orders_Products ON Customer_Orders.order_id = Customer_Orders_Products.order_id
LEFT JOIN Products ON Customer_Orders_Products.product_id = Products.product_id
GROUP BY Customer_Orders.order_id;

-- INSERT query
INSERT INTO `Customer_Orders`(
    `customer_id`,
    `card_type_code`,
    `card_last_four`,
    `order_picked_up_yn`,
    `order_paid_yn`,
    `datetime_order_placed`,
    `order_detail`
)
VALUES(:val1, :val2, :val3, :val4, :val5, :val6, :val7);

-- UPDATE query
UPDATE
    `Customer_Orders`
SET
    `customer_id` = :val1,
    `card_type_code` = :val2,
    `card_last_four` = :val3,
    `order_picked_up_yn` = :val4,
    `order_paid_yn` = :val5,
    `datetime_order_placed` = :val6,
    `order_detail` = :val7
WHERE
    `order_id` = :val8;

-- DELETE query
DELETE
FROM
    `Customer_Orders`
WHERE
    `order_id` = :val1;


----------------------------
--Customer_Orders_Products--
----------------------------

-- SELECT query
SELECT
    Customer_Orders.order_id,
    Products.product_id,
    Products.product_name,
    Products.product_unit_price,
    Customer_Orders_Products.quantity
FROM
    Customer_Orders
JOIN Customer_Orders_Products USING(order_id)
JOIN Products USING(product_id)
LEFT JOIN Customers USING(customer_id)
ORDER BY
    Customer_Orders.order_id;

-- INSERT query
INSERT INTO `Customer_Orders_Products`(
    `order_id`,
    `product_id`,
    `quantity`
)
VALUES(:val1, :val2, :val3);

-- UPDATE query
UPDATE
    `Customer_Orders_Products`
SET
    `quantity` = :val1
WHERE
    `order_id` = :val2 AND `product_id` = :val3;

-- DELETE query
DELETE
FROM
    `Customer_Orders_Products`
WHERE
    `order_id` = :val1 AND `product_id` = :val2;

---------------
-- REFERENCES--
---------------

-- SELECT query for Ref_Product_Types
SELECT
    child.product_type_code,
    child.product_type_description,
    parent.product_type_description AS parent_product_type_description
FROM
    Ref_Product_Types child
LEFT JOIN Ref_Product_Types parent ON
    child.parent_product_type_code = parent.product_type_code;

-- SELECT query for Ref_Card_Types
SELECT
    `card_type_code`, 
    `card_type_description`
FROM
    `Ref_Card_Types`;

-- INSERT query for Ref_Product_Types
INSERT INTO `Ref_Product_Types`(
    `product_type_description`,
    `parent_product_type_code`
)
VALUES(:val1, :val2);

-- INSERT query for Ref_Card_Types
INSERT INTO `Ref_Card_Types`(
    `card_type_description`
)
VALUES(:val1);

-- UPDATE query for Ref_Product_Types
UPDATE
    `Ref_Product_Types`
SET
    `product_type_description` = :val1,
    `parent_product_type_code` = :val2
WHERE
    `product_type_code` = :val3;

-- UPDATE query for Ref_Card_Types
UPDATE
    `Ref_Card_Types`
SET
    `card_type_description` = :val1
WHERE
    `card_type_code` = :val2;

-- DELETE query for Ref_Product_Types
DELETE
FROM
    `Ref_Product_Types`
WHERE
    `product_type_code` = :val1;

-- DELETE query for Ref_Card_Types
DELETE
FROM
    `Ref_Card_Types`
WHERE
    `card_type_code` = :val1;

