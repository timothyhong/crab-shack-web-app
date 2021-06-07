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
`customer_info` varchar(255),
UNIQUE KEY (`first_name`, `last_name`, `customer_phone_primary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Ref_Product_Types Table Setup:

CREATE TABLE `Ref_Product_Types` (
  `product_type_code` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_type_description` varchar(255) NOT NULL UNIQUE,
  `parent_product_type_code` int(11),
   FOREIGN KEY (parent_product_type_code) REFERENCES Ref_Product_Types(product_type_code) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Products Table Setup:

CREATE TABLE `Products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_type_code` int(11),
  `product_unit_price` decimal(10, 2) unsigned,
  `product_name` varchar(255) NOT NULL UNIQUE,
  `product_description` varchar(255),
  `product_unit_size` varchar(255),
   FOREIGN KEY (product_type_code) REFERENCES Ref_Product_Types(product_type_code) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Ref_Card_Types Table Setup:

CREATE TABLE `Ref_Card_Types` (
  `card_type_code` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `card_type_description` varchar(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Customer_Orders Table Setup:

CREATE TABLE Customer_Orders(
  `order_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` int(11),
  `card_type_code` int(11),
  `card_last_four` char(4),
  `datetime_order_placed` datetime,
  `order_picked_up_yn` tinyint(1) NOT NULL DEFAULT 0,
  `order_paid_yn` tinyint(1) NOT NULL DEFAULT 0,
  `order_detail` varchar(255),
   FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL,
   FOREIGN KEY (card_type_code) REFERENCES Ref_Card_Types(card_type_code) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- Customer_Orders_Products Table Setup:

CREATE TABLE Customer_Orders_Products(
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) unsigned NOT NULL, 
   FOREIGN KEY (order_id) REFERENCES Customer_Orders(order_id) ON DELETE CASCADE,
   FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
   CONSTRAINT PRIMARY KEY (order_id, product_id)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- Ref_Card_Types

  INSERT INTO `Ref_Card_Types` (`card_type_description`) VALUES
  ('Cash'),('American Express'), ('Discover'), ('Mastercard'), ('Visa'), ('Dogecoin');

-- Customers

  INSERT INTO `Customers` (`first_name`, `last_name`, `customer_phone_primary`,
  `customer_email`, `address_line_1`, `city`, `zip_code`, `state`) VALUES
  ('Boog', 'Powell', '888-848-2473', 'boog@orioles.com', '323 West Camden Street', 'Baltimore', '21201', 'MD'),
  ('Kevin', 'Plank', '888-727-6687', 'kevin@underarmour.com', '1020 Hull Street', 'Baltimore', '21230', 'MD'),
  ('Kevin', 'Smith', '999-987-6543', 'kevinsmith@gmail.com', '1240 Pratt Street', 'Baltimore', '21212', 'MD'),
  ('Weston', 'Powell', '123-456-7890', null, null, null, null, null);

  INSERT INTO `Customers` (`first_name`, `middle_name`, `last_name`, `customer_phone_primary`, `customer_phone_secondary`,
  `customer_email`, `address_line_1`, `address_line_2`, `city`, `zip_code`, `state`, `customer_info`) VALUES
  ('Earl', 'Papa Bear', 'Banks', '410-111-2222', '410-222-1111', 'papabear@morganstate.edu', '17 Roland Avenue', 'Apt. 2B', 'Baltimore', '21211', 'MD', 'great guy'),
  ('Thurgood', null, 'Marshall', '111-222-3333', null, 'thurgoodmarshall@supremecourt.gov', '120 Martin Luther King Blvd', null, 'Baltimore', '21201', 'MD', null),
  ('Earl', null, 'Grey', '410-999-8765', null, 'earlgrey@besttea.com', '122 Union Avenue', 'Apt 17', 'Baltimore', '21212', 'MD', null);

-- Ref_Product_Types

  INSERT INTO `Ref_Product_Types` (`product_type_description`) VALUES ('Maryland Blue Crabs'), ('Extras');

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Utensils', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Extras';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Maryland Crab Cakes', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Maryland Blue Crabs - Medium', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Maryland Blue Crabs - Large', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Maryland Blue Crabs - Extra Large', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Old Bay', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Extras';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Crab Mallet', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Utensils';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Claw Cracker', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Utensils';

  INSERT INTO `Ref_Product_Types` (`product_type_description`, `parent_product_type_code`)
     SELECT 'Paper Table Cover', `product_type_code`
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Extras';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '64.99', 'Dozen Medium Crabs Live', 'Maryland Blue Crabs - Medium (Live)', 'Dozen'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Medium';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '64.99', 'Dozen Medium Crabs Steamed', 'Maryland Blue Crabs - Medium (Steamed)', 'Dozen'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Medium';

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
     SELECT `product_type_code`, '249.99', 'Bushel Medium Crabs Live', 'Maryland Blue Crabs - Medium (Live)', 'Bushel'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Medium';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '249.99', 'Bushel Medium Crabs Steamed', 'Maryland Blue Crabs - Medium (Steamed)', 'Bushel'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs - Medium';

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
     SELECT `product_type_code`, '4.99', 'Old Bay (Small)', 'Old Bay - 2.62 oz', '2.62 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Old Bay';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '8.99', 'Old Bay (Medium)', 'Old Bay - 16 oz', '16 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Old Bay';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '12.99', 'Old Bay (Large)', 'Old Bay - 22 oz', '22 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Old Bay';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '2.99', 'Crab Mallet (Regular)', 'Crab Mallet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Crab Mallet';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '9.99', 'Crab Mallet (XL)', 'Heavy duty crab mallet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Crab Mallet';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '2.99', 'Claw Cracker (Regular)', 'Claw Cracker', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Claw Cracker';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '9.99', 'Claw Cracker (XL)', 'Heavy duty claw cracker', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Claw Cracker';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '19.99', 'Paper Table Cover (White)', 'Paper Table Cover (White) - 40 inches x 100 feet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Paper Table Cover';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '19.99', 'Paper Table Cover (Black)', 'Paper Table Cover (Black) - 40 inches x 100 feet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Paper Table Cover';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '24.99', 'Paper Table Cover (Maryland Flag)', 'Paper Table Cover (Maryland Flag) - 40 inches x 100 feet', '1'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Paper Table Cover';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '16.99', 'Maryland Specialty Roll', 'Deep fried Maryland Blue Crab, tuna, and jalapeno topped w/ caviar, scallions and a combination of our spicy mayo and eel sauce', '1 roll'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Blue Crabs';

  INSERT INTO `Products` (`product_type_code`, `product_unit_price`, `product_name`, `product_description`, `product_unit_size`)
     SELECT `product_type_code`, '18.99', 'Maryland Jumbo Lump Crab Cake (7 oz)', 'Our famous hand made, succulent crab cake mixed with a blend of secret ingredients and Old Bay', '7 oz'
     FROM `Ref_Product_Types`
     WHERE `product_type_description` = 'Maryland Crab Cakes';

-- Customer_Orders
  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Visa'),
            '1234', '2021-05-01 12:34:33', 1, 1
     FROM `Customers`
     WHERE `first_name` = 'Boog' AND `last_name` = 'Powell';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Visa'),
            '2222', '2021-05-01 16:04:25', 1, 1
     FROM `Customers`
     WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Cash'),
            null, '2021-05-10 12:08:52', 0, 1
     FROM `Customers`
     WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`, `order_detail`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Cash'),
            null, '2021-05-17 02:14:33', 1, 0, 'not paid'
     FROM `Customers`
     WHERE `first_name` = 'Kevin' AND `last_name` = 'Smith';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`, `order_detail`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'American Express'),
            '9284', '2021-05-12 09:32:17', 0, 1, 'extra napkins'
     FROM `Customers`
     WHERE `first_name` = 'Weston' AND `last_name` = 'Powell';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`, `order_detail`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Mastercard'),
            '7777', '1999-01-17 22:32:19', 1, 1, null
     FROM `Customers`
     WHERE `first_name` = 'Earl' AND `last_name` = 'Banks';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`, `order_detail`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Discover'),
            '9999', '1982-01-01 17:22:54', 1, 1, null
     FROM `Customers`
     WHERE `first_name` = 'Thurgood' AND `last_name` = 'Marshall';

  INSERT INTO `Customer_Orders` (`customer_id`, `card_type_code`, `card_last_four`, `datetime_order_placed`,
  `order_picked_up_yn`, `order_paid_yn`, `order_detail`)
     SELECT `customer_id`, (SELECT `card_type_code` FROM `Ref_Card_Types` WHERE `card_type_description` = 'Cash'),
            null, '2021-10-31 22:22:22', 0, 1, null
     FROM `Customers`
     WHERE `first_name` = 'Earl' AND `last_name` = 'Grey';

-- Customer_Orders_Products

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Boog' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-01 12:34:33'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Dozen Medium Crabs Live'), 3);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Boog' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-01 12:34:33'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Dozen Extra Large Crabs Steamed'), 2);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Boog' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-01 12:34:33'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Claw Cracker (XL)'), 7);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank') AND `datetime_order_placed` = '2021-05-01 16:04:25'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Bushel Extra Large Crabs Live'), 2);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank') AND `datetime_order_placed` = '2021-05-10 12:08:52'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Bushel Medium Crabs Steamed'), 4);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank') AND `datetime_order_placed` = '2021-05-10T12:08:52'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Old Bay (Large)'), 4);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Kevin' AND `last_name` = 'Plank') AND `datetime_order_placed` = '2021-05-10 12:08:52'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Paper Table Cover (White)'), 2);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Kevin' AND `last_name` = 'Smith') AND `datetime_order_placed` = '2021-05-17 02:14:33'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Claw Cracker (Regular)'), 2000);   

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Weston' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-12 09:32:17'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Paper Table Cover (Maryland Flag)'), 2);   

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Weston' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-12 09:32:17'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Old Bay (Medium)'), 12);  

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Weston' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-12 09:32:17'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Dozen Large Crabs Live'), 10);  

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Weston' AND `last_name` = 'Powell') AND `datetime_order_placed` = '2021-05-12 09:32:17'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Bushel Medium Crabs Live'), 10);

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Earl' AND `last_name` = 'Banks') AND `datetime_order_placed` = '1999-01-17 22:32:19'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Bushel Large Crabs Live'), 5);    

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Earl' AND `last_name` = 'Banks') AND `datetime_order_placed` = '1999-01-17 22:32:19'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Paper Table Cover (Maryland Flag)'), 1);    

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Thurgood' AND `last_name` = 'Marshall') AND `datetime_order_placed` = '1982-01-01 17:22:54'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Crab Mallet (XL)'), 99); 

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Thurgood' AND `last_name` = 'Marshall') AND `datetime_order_placed` = '1982-01-01 17:22:54'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Bushel Extra Large Crabs Steamed'), 50); 

  INSERT INTO `Customer_Orders_Products` (`order_id`, `product_id`, `quantity`) VALUES
    ((SELECT `order_id` FROM `Customer_Orders` WHERE `customer_id` = (SELECT `customer_id` FROM `Customers` WHERE `first_name` = 'Earl' AND `last_name` = 'Grey') AND `datetime_order_placed` = '2021-10-31 22:22:22'),
    (SELECT `product_id` FROM `Products` WHERE `product_name` = 'Dozen Medium Crabs Steamed'), 1); 