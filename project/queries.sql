-- SQL Queries for Website


-- COMMON QUERIES (Javascript functions)

-- getColumns = (data, tableName, distinct) => a promise with query results
  -- data: {cols: [col1, ...], criteria:{criteriaKey1: criteriaVal1}}
  -- tableName: name of the table
  -- distinct: bool true/false
SELECT :col1, :col2, ... FROM :tableName WHERE :criteriaKey1 = :criteriaVal1 AND criteriaKey2 = :criteriaVal2 ...;

-- addRowServer = (data, tableName) => a promise with success message
  -- data: {cols: {colKey1: colVal1, ...}}
  -- tableName: name of the table
INSERT INTO :tableName (:colKey1, :colKey2, ...) VALUES (:colVal1, :colval2, ...);

-- editRowServer = (data, tableName) => a promise with success message
  -- data: {ids: {idKey1: idVal1, ...} cols: {colKey1: colVal1, ...}}
  -- tableName: name of the table
UPDATE :tableName SET :colKey1 = :colVal1, :colKey2 = :colVal2, ... WHERE :idKey1 = :idVal1 AND :idKey2 = :idVal2 ...;

-- deleteRowServer = (data, tableName) => a promise with success message
  -- data: {ids: {idKey1: idVal1, ...}}
  -- tableName: name of the table
DELETE FROM :tableName WHERE :idKey1 = :idVal1 AND :idKey2 = :idVal2 ...;


-- PRODUCTS PAGE

-- Display Products
SELECT `product_id`, `product_type_description`, `product_name`, `product_unit_price`, `product_unit_size`, `product_description`
     FROM `Products` LEFT JOIN `Ref_Product_Types` ON Products.product_type_code = Ref_Product_Types.product_type_code;
   
-- Display all products that have parent_product_type_code as an ancestor
WITH RECURSIVE cte_products 
AS (
      SELECT product_type_code, parent_product_type_code, product_type_description FROM Ref_Product_Types WHERE product_type_code = ?
      UNION ALL
      SELECT child.product_type_code,
         child.parent_product_type_code,
         child.product_type_description
      FROM Ref_Product_Types AS child
      JOIN cte_products AS parent ON parent.product_type_code = child.parent_product_type_code
    )
SELECT cte_products.product_type_description, Products.product_name, Products.product_unit_price, Products.product_unit_size, Products.product_description
FROM cte_products LEFT JOIN Ref_Product_Types ON cte_products.product_type_description = Ref_Product_Types.product_type_description LEFT JOIN Products ON Ref_Product_Types.product_type_code = Products.product_type_code;

-- ORDERS PAGE

-- Display Customer_Orders
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

-- Display Products on each Customer_Order
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
JOIN Customers USING(customer_id)
ORDER BY
    Customer_Orders.order_id;
   
-- REFERENCES

-- Display Ref_Product_Types
SELECT
    child.product_type_code,
    child.product_type_description,
    parent.product_type_description AS parent_product_type_description
FROM
    Ref_Product_Types child
LEFT JOIN Ref_Product_Types parent ON
    child.parent_product_type_code = parent.product_type_code;

