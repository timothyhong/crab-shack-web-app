-- SQL Queries for Website

-- Products page
-- SELECT
SELECT `product_id`, `product_type_description`, `product_name`, `product_unit_price`, `product_unit_size`, `product_description`
     FROM `Products` LEFT JOIN `Ref_Product_Types` ON Products.product_type_code = Ref_Product_Types.product_type_code;
-- DELETE
  -- DELETE FROM Customer_Orders WHERE 



-- Orders page

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
    Customer_Orders.datetime_order_placed,
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
   
-- Ref_Product_Types

-- recursive query displaying product_type_codes which descend from a specified parent_product_type_code
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

