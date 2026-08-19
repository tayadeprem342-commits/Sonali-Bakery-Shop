-- Run this to fix all item images in TiDB Cloud
-- PowerShell: Get-Content update_images.sql | mysql --host <host> --port 4000 --ssl-mode=REQUIRED -u <user> -p

USE sonali_bakery;

-- SIZZLER
UPDATE menu_items SET image='https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400' WHERE name='Chocolate Brownie Sizzler';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' WHERE name="Coconut's Pruwnie Sizzler";

-- MASTANI
UPDATE menu_items SET image='https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' WHERE name='Mango Mastani';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400' WHERE name='Pineapple Mastani';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400' WHERE name='Strawberry Mastani';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1619158401201-8d5a353f9ab3?w=400' WHERE name='Rose Mastani';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400' WHERE name='Mix Fruit Mastani';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400' WHERE name='Blueberry Mastani';

-- MOCKTAIL
UPDATE menu_items SET image='https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' WHERE name='Green Mint Mojito';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400' WHERE name='Virgin Mojito';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' WHERE name='Blue Lagoon';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400' WHERE name='Jeera Mint Masala';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1596803244618-8dea9b57e2e7?w=400' WHERE name='Rose Tim Tim';

-- LASSI
UPDATE menu_items SET image='https://images.unsplash.com/photo-1625865881222-7958a3e49dc3?w=400' WHERE name='Ghamandi Lassi';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400' WHERE name='Ghamandi Ice Cream Lassi';

-- MOMOS
UPDATE menu_items SET image='https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' WHERE name='Veg Momos (Steam)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400' WHERE name='Schezwan Momos (Steam)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' WHERE name='Red Gravy Momos (Steam)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400' WHERE name='White Gravy Momos (Steam)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400' WHERE name='Paneer Momos (Fried)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400' WHERE name='Paneer Afghani Momos';

-- DESHI KULLAD
UPDATE menu_items SET image='https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' WHERE name='Kullad Veggi Paneer Tikka';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' WHERE name='Kullad Paneer Tikka';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400' WHERE name='Kullad Paneer Afghani Tikka';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' WHERE name='Kullad Creamy Corn';

-- SHAKES
UPDATE menu_items SET image='https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' WHERE name='Cold Coffee';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' WHERE name='Cold Coffee with Crush';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400' WHERE name='Cold Coffee with Ice Cream';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400' WHERE name='Thick Pineapple Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400' WHERE name='Thick Butter Scotch Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400' WHERE name='Thick Strawberry Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400' WHERE name='Thick Blueberry Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' WHERE name='Thick Mango Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' WHERE name='Thick Chocolata Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400' WHERE name='Thick Oreo Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400' WHERE name='Thick Kit Kat Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' WHERE name='Thick Chocolate Brownie Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400' WHERE name='Thick Anjeer Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1619158401201-8d5a353f9ab3?w=400' WHERE name='Thick Kalkatta Paan Shake';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' WHERE name='Cad B Shake';

-- SANDWICH
UPDATE menu_items SET image='https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400' WHERE name='Plain Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' WHERE name='Butter Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400' WHERE name='Corn Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400' WHERE name='Veg Cheese Grill Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' WHERE name='Veg Paneer Corn Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' WHERE name='Veg Paneer Tikka Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' WHERE name='Masala Butter Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400' WHERE name='Schezwan Cheese Grill Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400' WHERE name='Cheese Chatpata Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400' WHERE name='Veg Bahubali Cheese Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400' WHERE name='Bombay Chatpata Sandwich';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400' WHERE name='Paneer Tikka Sandwich';

-- FRENCH FRIES
UPDATE menu_items SET image='https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' WHERE name='Salted French Fries';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1584929650015-b52f3adc9c00?w=400' WHERE name='Masala French Fries';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400' WHERE name='Peri Peri French Fries';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400' WHERE name='Cheese French Fries';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1625921705770-c8c59e8e5bf0?w=400' WHERE name='Magic Masala French Fries';

-- SHOTS & SNACKS
UPDATE menu_items SET image='https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400' WHERE name='Potato Cheese Shots (15 pcs)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1562967914-608f82629710?w=400' WHERE name='Veg Nuggets (10 pcs)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' WHERE name='Potato Chilli Garlic Shots (15 pcs)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=400' WHERE name='Simless Masala (10 pcs)';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400' WHERE name='Salted Simless (10 pcs)';

-- PASTA
UPDATE menu_items SET image='https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400' WHERE name='Red Sauce Pasta';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' WHERE name='White Sauce Pasta';

-- GARLIC BREAD
UPDATE menu_items SET image='https://images.unsplash.com/photo-1619531040576-f9416740661d?w=400' WHERE name='Garlic Chili Bread Butter';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400' WHERE name='Garlic Cheese Corn Bread Butter';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1646166419149-6f0c65e10e64?w=400' WHERE name="Garlic Dev's Bread Butter";

-- PIZZAS
UPDATE menu_items SET image='https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400' WHERE name='Butter Cheese Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' WHERE name='Tomato Sauce Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1548369937-47519962c11a?w=400' WHERE name='Butter Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' WHERE name='Onion Capsicum Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' WHERE name='Wild Spicy Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400' WHERE name='Paneer Cheese Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1520201163981-8cc95007e71d?w=400' WHERE name='Onion Mushroom Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' WHERE name='Margherita Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400' WHERE name='Cheese Sweet Corn Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' WHERE name='Veg Garlic Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' WHERE name='Paneer Tikka Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400' WHERE name='Paneer Peri Peri Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400' WHERE name='Tandoor Veggie Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' WHERE name='Double Veg Cheese Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400' WHERE name='Bahubal Italian Pizza';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' WHERE name='Veg Farm House Pizza';

-- BURGERS
UPDATE menu_items SET image='https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' WHERE name='Veg Burger';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' WHERE name='Veg Cheese Burger';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400' WHERE name='Mexican Burger';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=400' WHERE name='Tandoor Burger';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400' WHERE name='Paneer Tikka Burger';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?w=400' WHERE name='Classic Burger';
UPDATE menu_items SET image='https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400' WHERE name='Cheese Burger';

SELECT CONCAT('✅ Updated ', COUNT(*), ' menu items') as result FROM menu_items;
