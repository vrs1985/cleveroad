
// BEGIN CREATE DATABASES
CREATE DATABASE phones
DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    INDEX (item_id )
) ;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount INT NOT NULL,
    order_date TIMESTAMP,
    INDEX (order_id)
);

CREATE TABLE items_orders (
    order_id INT NOT NULL ,
    item_id INT NOT NULL,
     FOREIGN KEY (order_id) REFERENCES orders(order_id),
     FOREIGN KEY (item_id) REFERENCES items(item_id)
);
// END CREATE DATABASES

// BEGIN SELECT DATA
SELECT * FROM orders WHERE amount > 500 AND order_date > NOW() - INTERVAL 7 DAY ;
- выбрать все заказы за последнюю неделю с общем суммой заказа > $500

SELECT items_orders.order_id, items.manufacturer FROM items INNER JOIN items_orders
ON items_orders.item_id = items.item_id
WHERE items.manufacturer LIKE '%samsung%'
 GROUP BY items_orders.order_id;
 - выбрать заказы, в которых присутствуют телефоны модели "Samsung"
// END SELECT DATA


// INSERT DATA IN OUR TABLES
INSERT INTO `items`(`manufacturer`, `model`, `description`, `price`) VALUES ("samsung", "S6 edge+", "2016, August. Released 2016, September", "700");
INSERT INTO `orders`(`user_id`) VALUES ("111");
SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1; -- id последнего заказа
SELECT item_id FROM items WHERE model = 'S6 edge+'; -- id выбраной модели
INSERT INTO `items_orders`(`order_id`, `item_id`) VALUES ("1","1");

SELECT SUM(price) FROM items INNER JOIN items_orders ON items_orders.item_id = items.item_id
WHERE items_orders.order_id = 1;
-- получаем общую сумму заказа которую можно записать в табл orders

UPDATE `orders` SET `amount`=2425 WHERE order_id = 1;
-- обновляем общую стоимость заказа

SELECT items_orders.order_id, SUM(price) FROM items INNER JOIN items_orders
ON items_orders.item_id = items.item_id GROUP BY items_orders.order_id;
-- делаем выборку по всем заказам


