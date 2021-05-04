-- SQL Database Setup

-- Setup for All Database Tables:

-- Drop Existing Tables:

DROP TABLE IF EXISTS `Customer_Orders_Products`;
DROP TABLE IF EXISTS `Customer_Orders`;
DROP TABLE IF EXISTS `Ref_Card_Types`;
DROP TABLE IF EXISTS `Products`;
DROP TABLE IF EXISTS `Ref_Product_Types`;
DROP TABLE IF EXISTS `Customers`;

-- Customers Table Setup:

CREATE TABLE `Customers` (
`customer_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
`first_name` varchar(255) NOT NULL,
`middle_name` varchar(255),
`last_name` varchar(255) NOT NULL,
`customer_phone_primary` varchar(18) NOT NULL,
`customer_phone_secondary` varchar(18),
`customer_email` varchar(255),
`address_line_1` varchar(255),
`address_line_2` varchar(255),
`city` varchar(255),
`zip_code` varchar(5),
`state` char(2),
`customer_info` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Ref_Product_Types Table Setup:

CREATE TABLE `Ref_Product_Types` (
  `product_type_code` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_type_description` varchar(255),
  `parent_product_type_code` int(11),
   FOREIGN KEY (parent_product_type_code) REFERENCES Ref_Product_Types(product_type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Products Table Setup:

CREATE TABLE `Products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_type_code` int(11) NOT NULL,
  `product_unit_price` decimal(10, 2),
  `product_name` varchar(255) NOT NULL,
  `product_description` varchar(255),
  `product_unit_size` varchar(255),
   FOREIGN KEY (product_type_code) REFERENCES Ref_Product_Types(product_type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Ref_Card_Types Table Setup:

CREATE TABLE `Ref_Card_Types` (
  `card_type_code` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `card_type_description` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Customer_Orders Table Setup:

CREATE TABLE Customer_Orders(
  `order_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` int(11) NOT NULL,
  `card_type` int(11),
  `card_last_four` char(4),
  `datetime_order_placed` datetime,
  `order_picked_up_yn` tinyint(1) NOT NULL DEFAULT 0,
  `order_paid_yn` tinyint(1) NOT NULL DEFAULT 0,
  `der_total_order_price` decimal(10, 2),
  `order_detail` varchar(255),
   FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
   FOREIGN KEY (card_type) REFERENCES Ref_Card_Types(card_type_code)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- Customer_Orders_Products Table Setup:

CREATE TABLE Customer_Orders_Products(
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
   FOREIGN KEY (order_id) REFERENCES Customer_Orders(order_id),
   FOREIGN KEY (product_id) REFERENCES Products(product_id),
  `quantity` int(11) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- TO DO: Figure out how to create a generated column for `der_total_order_price`
-- Need to take customer id from customer table, then look up order id, then find product id(s)
-- then mulitply by unit price, then sum all values


-- alter Customer_Orders Table:

-- ALTER `Customer_Orders`
-- ADD COLUMN `sub_price` decimal(10, 2)
-- GENERATED ALWAYS AS
--  		(SELECT `product_unit_price` FROM `Products`WHERE `product_id` =
--          	(SELECT `product_id` FROM `Customer_Orders_Products` WHERE `order_id` = `Customer_Orders.order_id`)
--         )
-- STORED;

-- TO DO: Need to add some data into the `Customer_Orders_Products` table

-- Insertion Statements for Sample DB Data (Optional):

  INSERT INTO `Ref_Card_Types` (`card_type_description`) VALUES
  ('Cash'),('American Express'), ('Discover'), ('Mastercard'), ('Visa');

  INSERT INTO `Customers` (`first_name`, `last_name`, `customer_phone_primary`,
  `customer_email`, `address_line_1`, `city`, `zip_code`, `state`) VALUES
  ('Boog', 'Powell', '888-848-2473', 'boog@orioles.com', '323 West Camden Street', 'Baltimore', '21201', 'MD'),
  ('Kevin', 'Plank', '888-727-6687', 'kevin@underarmour.com', '1020 Hull Street', 'Baltimore', '21230', 'MD');

  INSERT INTO `Ref_Product_Types` (`product_type_description`) VALUES ('Maryland Blue Crabs');

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Maryland Blue Crabs - Large', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Maryland Blue Crabs - Extra Large', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Ref_Product_Types` (`product_type_description`) VALUES
  ('Old Bay'), ('Crab Mallet'), ('Claw Cracker'), ('Paper Table Cover');

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '79.99', 'Dozen Large Crabs Live', 'Maryland Blue Crabs - Large (Live)', 'Dozen'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '79.99', 'Dozen Large Crabs Steamed', 'Maryland Blue Crabs - Large (Steamed)', 'Dozen'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '99.99', 'Dozen Extra Large Crabs Live', 'Maryland Blue Crabs - Extra Large (Live)', 'Dozen'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Extra Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '99.99', 'Dozen Extra Large Crabs Steamed', 'Maryland Blue Crabs - Extra Large (Steamed)', 'Dozen'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Extra Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '299.99', 'Bushel Large Crabs Live', 'Maryland Blue Crabs - Large (Live)', 'Bushel'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '299.99', 'Bushel Large Crabs Steamed', 'Maryland Blue Crabs - Large (Steamed)', 'Bushel'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '349.99', 'Bushel Extra Large Crabs Live', 'Maryland Blue Crabs - Extra Large (Live)', 'Bushel'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Extra Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '349.99', 'Bushel Extra Large Crabs Steamed', 'Maryland Blue Crabs - Extra Large (Steamed)', 'Bushel'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Extra Large';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '4.99', 'Old Bay', 'Old Bay - 2.62 oz', '2.62 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Old Bay';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '8.99', 'Old Bay', 'Old Bay - 16 oz', '16 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Old Bay';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '12.99', 'Old Bay', 'Old Bay - 22 oz', '22 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Old Bay';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '2.99', 'Crab Mallet', 'Crab Mallet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Crab Mallet';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '2.99', 'Claw Cracker', 'Claw Cracker', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Claw Cracker';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '11.99', 'Paper Table Cover', 'Paper Table Cover - 40 inches x 100 feet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Paper Table Cover';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Visa'),
            '1234', '2021-05-01 12:34:33', 0, 1
     FROM `Customers`
     WHERE `first_name` = 'Boog' AND `last_name` = 'Powell';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Visa'),
            '1234', '2021-05-01 16:04:25', 0, 1
     FROM `Customers`
     WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank';
