/**
 * seed.js — Sonali Coldrinks & Bakery (TiDB Cloud)
 * Run once: node seed.js
 */
const dotenv = require('dotenv');
dotenv.config();
const { connectDB, pool } = require('./config/db');
const MenuItem = require('./models/MenuItem');

const sampleItems = [
  // ── SIZZLER ──
  { name: 'Chocolate Brownie Sizzler', description: 'Hot sizzling chocolate brownie dessert', price: 120, category: 'Sizzler', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', available: true },
  { name: "Coconut's Pruwnie Sizzler", description: 'Coconut brownie sizzler with rich flavour', price: 135, category: 'Sizzler', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', available: true },

  // ── MASTANI ──
  { name: 'Mango Mastani', description: 'Thick mango shake with ice cream scoop', price: 90, category: 'Mastani', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', available: true },
  { name: 'Pineapple Mastani', description: 'Thick pineapple shake with ice cream scoop', price: 95, category: 'Mastani', image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400', available: true },
  { name: 'Strawberry Mastani', description: 'Thick strawberry shake with ice cream scoop', price: 100, category: 'Mastani', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', available: true },
  { name: 'Rose Mastani', description: 'Thick rose flavour shake with ice cream scoop', price: 90, category: 'Mastani', image: 'https://images.unsplash.com/photo-1619158401201-8d5a353f9ab3?w=400', available: true },
  { name: 'Mix Fruit Mastani', description: 'Mixed fruit thick shake with ice cream', price: 105, category: 'Mastani', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', available: true },
  { name: 'Blueberry Mastani', description: 'Thick blueberry shake with ice cream scoop', price: 110, category: 'Mastani', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', available: true },

  // ── MOCKTAIL ──
  { name: 'Green Mint Mojito', description: 'Fresh mint, lime & soda mocktail', price: 90, category: 'Mocktail', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', available: true },
  { name: 'Virgin Mojito', description: 'Classic non-alcoholic mojito with mint & lime', price: 85, category: 'Mocktail', image: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400', available: true },
  { name: 'Blue Lagoon', description: 'Blue curacao flavour tropical mocktail', price: 95, category: 'Mocktail', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', available: true },
  { name: 'Jeera Mint Masala', description: 'Refreshing cumin and mint spiced drink', price: 75, category: 'Mocktail', image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400', available: true },
  { name: 'Rose Tim Tim', description: 'Sweet rose flavoured fizzy mocktail', price: 80, category: 'Mocktail', image: 'https://images.unsplash.com/photo-1596803244618-8dea9b57e2e7?w=400', available: true },

  // ── LASSI ──
  { name: 'Ghamandi Lassi', description: 'Rich and creamy traditional sweet lassi', price: 75, category: 'Lassi', image: 'https://images.unsplash.com/photo-1625865881222-7958a3e49dc3?w=400', available: true },
  { name: 'Ghamandi Ice Cream Lassi', description: 'Creamy lassi topped with ice cream scoop', price: 90, category: 'Lassi', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400', available: true },

  // ── MOMOS ──
  { name: 'Veg Momos (Steam)', description: 'Steamed veg dumplings with chutney', price: 95, category: 'Momos', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', available: true },
  { name: 'Schezwan Momos (Steam)', description: 'Steamed momos with spicy schezwan filling', price: 105, category: 'Momos', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400', available: true },
  { name: 'Red Gravy Momos (Steam)', description: 'Steamed momos in spicy red chilli gravy', price: 115, category: 'Momos', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', available: true },
  { name: 'White Gravy Momos (Steam)', description: 'Steamed momos in creamy white gravy', price: 115, category: 'Momos', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400', available: true },
  { name: 'Paneer Momos (Fried)', description: 'Crispy fried paneer-stuffed momos', price: 130, category: 'Momos', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', available: true },
  { name: 'Paneer Afghani Momos', description: 'Creamy afghani style paneer momos', price: 135, category: 'Momos', image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', available: true },

  // ── DESHI KULLAD ──
  { name: 'Kullad Veggi Paneer Tikka', description: 'Tandoor tikka served in a traditional kullad', price: 130, category: 'Deshi Kullad', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', available: true },
  { name: 'Kullad Paneer Tikka', description: 'Classic paneer tikka in earthen kullad', price: 140, category: 'Deshi Kullad', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', available: true },
  { name: 'Kullad Paneer Afghani Tikka', description: 'Rich creamy afghani paneer tikka in kullad', price: 165, category: 'Deshi Kullad', image: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400', available: true },
  { name: 'Kullad Creamy Corn', description: 'Sweet creamy corn served in earthen kullad', price: 110, category: 'Deshi Kullad', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', available: true },

  // ── SHAKES ──
  { name: 'Cold Coffee', description: 'Chilled coffee with cream, perfectly sweetened', price: 75, category: 'Shakes', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', available: true },
  { name: 'Cold Coffee with Crush', description: 'Cold coffee with a fruit crush swirl', price: 85, category: 'Shakes', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', available: true },
  { name: 'Cold Coffee with Ice Cream', description: 'Rich cold coffee topped with ice cream', price: 95, category: 'Shakes', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', available: true },
  { name: 'Thick Pineapple Shake', description: 'Thick creamy pineapple milkshake', price: 85, category: 'Shakes', image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400', available: true },
  { name: 'Thick Butter Scotch Shake', description: 'Thick butterscotch flavoured milkshake', price: 85, category: 'Shakes', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400', available: true },
  { name: 'Thick Strawberry Shake', description: 'Thick fresh strawberry milkshake', price: 80, category: 'Shakes', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400', available: true },
  { name: 'Thick Blueberry Shake', description: 'Thick blueberry milkshake', price: 95, category: 'Shakes', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', available: true },
  { name: 'Thick Mango Shake', description: 'Thick Alphonso mango milkshake', price: 80, category: 'Shakes', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', available: true },
  { name: 'Thick Chocolata Shake', description: 'Thick rich chocolate milkshake', price: 85, category: 'Shakes', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', available: true },
  { name: 'Thick Oreo Shake', description: 'Creamy Oreo cookie milkshake', price: 95, category: 'Shakes', image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400', available: true },
  { name: 'Thick Kit Kat Shake', description: 'Kit Kat chocolate bar milkshake', price: 110, category: 'Shakes', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400', available: true },
  { name: 'Thick Chocolate Brownie Shake', description: 'Milkshake blended with chocolate brownie', price: 110, category: 'Shakes', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', available: true },
  { name: 'Thick Anjeer Shake', description: 'Thick fig (anjeer) milkshake', price: 140, category: 'Shakes', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', available: true },
  { name: 'Thick Kalkatta Paan Shake', description: 'Unique paan-flavoured thick shake', price: 130, category: 'Shakes', image: 'https://images.unsplash.com/photo-1619158401201-8d5a353f9ab3?w=400', available: true },
  { name: 'Cad B Shake', description: 'Special Cadbury chocolate milkshake', price: 120, category: 'Shakes', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', available: true },

  // ── SANDWICH ──
  { name: 'Plain Sandwich', description: 'Simple toasted sandwich with fresh veggies', price: 70, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400', available: true },
  { name: 'Butter Sandwich', description: 'Toasted sandwich with butter spread', price: 80, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', available: true },
  { name: 'Corn Sandwich', description: 'Grilled sandwich with sweet corn filling', price: 110, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400', available: true },
  { name: 'Veg Cheese Grill Sandwich', description: 'Grilled veggie sandwich loaded with cheese', price: 115, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400', available: true },
  { name: 'Veg Paneer Corn Sandwich', description: 'Paneer and corn grilled sandwich', price: 120, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', available: true },
  { name: 'Veg Paneer Tikka Sandwich', description: 'Spiced paneer tikka grilled sandwich', price: 135, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', available: true },
  { name: 'Masala Butter Pizza', description: 'Open toast masala pizza sandwich', price: 130, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', available: true },
  { name: 'Schezwan Cheese Grill Sandwich', description: 'Spicy schezwan cheese grilled sandwich', price: 140, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400', available: true },
  { name: 'Cheese Chatpata Sandwich', description: 'Tangy chatpata masala cheese sandwich', price: 155, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400', available: true },
  { name: 'Veg Bahubali Cheese Sandwich', description: 'Loaded Bahubali special mega sandwich', price: 170, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400', available: true },
  { name: 'Bombay Chatpata Sandwich', description: 'Mumbai style chatpata grilled sandwich', price: 165, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400', available: true },
  { name: 'Paneer Tikka Sandwich', description: 'Tandoor paneer tikka in grilled sandwich', price: 190, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400', available: true },

  // ── FRENCH FRIES ──
  { name: 'Salted French Fries', description: 'Golden crispy fries with sea salt', price: 80, category: 'French Fries', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', available: true },
  { name: 'Masala French Fries', description: 'Indian spiced fries with chaat masala', price: 95, category: 'French Fries', image: 'https://images.unsplash.com/photo-1584929650015-b52f3adc9c00?w=400', available: true },
  { name: 'Peri Peri French Fries', description: 'Spicy peri peri seasoned crispy fries', price: 120, category: 'French Fries', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400', available: true },
  { name: 'Cheese French Fries', description: 'Fries drenched in melted cheese sauce', price: 135, category: 'French Fries', image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400', available: true },
  { name: 'Magic Masala French Fries', description: 'Secret magic masala blend fries', price: 125, category: 'French Fries', image: 'https://images.unsplash.com/photo-1625921705770-c8c59e8e5bf0?w=400', available: true },

  // ── SHOTS / SNACKS ──
  { name: 'Potato Cheese Shots (15 pcs)', description: 'Crispy fried potato cheese bites - 15 pieces', price: 110, category: 'Shots & Snacks', image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400', available: true },
  { name: 'Veg Nuggets (10 pcs)', description: 'Crispy golden veg nuggets - 10 pieces', price: 120, category: 'Shots & Snacks', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', available: true },
  { name: 'Potato Chilli Garlic Shots (15 pcs)', description: 'Spicy chilli garlic potato shots - 15 pieces', price: 115, category: 'Shots & Snacks', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', available: true },
  { name: 'Simless Masala (10 pcs)', description: 'Masala flavoured crispy bites - 10 pieces', price: 115, category: 'Shots & Snacks', image: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=400', available: true },
  { name: 'Salted Simless (10 pcs)', description: 'Classic salted crispy bites - 10 pieces', price: 110, category: 'Shots & Snacks', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400', available: true },

  // ── PASTA ──
  { name: 'Red Sauce Pasta', description: 'Pasta in rich tangy tomato sauce', price: 150, category: 'Pasta', image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400', available: true },
  { name: 'White Sauce Pasta', description: 'Creamy béchamel white sauce pasta', price: 180, category: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', available: true },

  // ── PIZZA ──
  { name: 'Butter Cheese Pizza', description: 'Classic butter and cheese pizza', price: 185, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', available: true },
  { name: 'Tomato Sauce Pizza', description: 'Simple tomato sauce base pizza', price: 105, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', available: true },
  { name: 'Butter Pizza', description: 'Buttery soft base pizza', price: 210, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=400', available: true },
  { name: 'Onion Capsicum Pizza', description: 'Onion and capsicum loaded pizza', price: 130, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', available: true },
  { name: 'Wild Spicy Pizza', description: 'Extra spicy wild pizza for spice lovers', price: 205, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', available: true },
  { name: 'Paneer Cheese Pizza', description: 'Paneer and cheese loaded pizza', price: 175, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400', available: true },
  { name: 'Onion Mushroom Pizza', description: 'Onion and mushroom topped pizza', price: 260, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1520201163981-8cc95007e71d?w=400', available: true },
  { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella & fresh basil', price: 255, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', available: true },
  { name: 'Cheese Sweet Corn Pizza', description: 'Sweet corn with double cheese melt', price: 280, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400', available: true },
  { name: 'Veg Garlic Pizza', description: 'Garlic flavoured veg pizza', price: 260, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400', available: true },
  { name: 'Paneer Tikka Pizza', description: 'Spiced paneer tikka on cheesy base', price: 275, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', available: true },
  { name: 'Paneer Peri Peri Pizza', description: 'Paneer with spicy peri peri seasoning', price: 280, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400', available: true },
  { name: 'Tandoor Veggie Pizza', description: 'Tandoor style veggie loaded pizza', price: 245, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400', available: true },
  { name: 'Double Veg Cheese Pizza', description: 'Double loaded veg and cheese pizza', price: 210, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', available: true },
  { name: 'Bahubal Italian Pizza', description: 'Special Italian style Bahubali mega pizza', price: 385, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400', available: true },
  { name: 'Veg Farm House Pizza', description: 'Farm fresh vegetables on pizza', price: 385, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', available: true },

  // ── BURGER ──
  { name: 'Veg Burger', description: 'Classic garden fresh veggie burger', price: 80, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', available: true },
  { name: 'Veg Cheese Burger', description: 'Veg burger with extra cheese slice', price: 100, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', available: true },
  { name: 'Mexican Burger', description: 'Spicy Mexican style burger with salsa', price: 120, category: 'Burgers', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400', available: true },
  { name: 'Tandoor Burger', description: 'Tandoor grilled patty burger', price: 110, category: 'Burgers', image: 'https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=400', available: true },
  { name: 'Paneer Tikka Burger', description: 'Spiced paneer tikka burger with mint chutney', price: 130, category: 'Burgers', image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400', available: true },
  { name: 'Classic Burger', description: 'Timeless classic burger with fresh veggies', price: 110, category: 'Burgers', image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?w=400', available: true },
  { name: 'Cheese Burger', description: 'Double cheese loaded burger', price: 140, category: 'Burgers', image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400', available: true },

  // ── GARLIC BREAD ──
  { name: 'Garlic Chili Bread Butter', description: 'Toasted garlic bread with chili butter', price: 90, category: 'Garlic Bread', image: 'https://images.unsplash.com/photo-1619531040576-f9416740661d?w=400', available: true },
  { name: 'Garlic Cheese Corn Bread Butter', description: 'Garlic bread with cheese and sweet corn', price: 110, category: 'Garlic Bread', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400', available: true },
  { name: "Garlic Dev's Bread Butter", description: "Special Dev's garlic bread butter", price: 130, category: 'Garlic Bread', image: 'https://images.unsplash.com/photo-1646166419149-6f0c65e10e64?w=400', available: true },

  // ── CAKES ──
  { name: 'Chocolate Truffle Cake', description: 'Rich dark chocolate layers with silky ganache', price: 480, category: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true },
  { name: 'Red Velvet Cake', description: 'Moist red velvet with cream cheese frosting', price: 520, category: 'Cakes', image: 'https://images.unsplash.com/photo-1586788680434-30d324626f4c?w=400', available: true },
  { name: 'Black Forest Cake', description: 'Layers of chocolate sponge, cream & cherries', price: 500, category: 'Cakes', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400', available: true },
  { name: 'Pineapple Cake', description: 'Fresh pineapple cream cake, light & fluffy', price: 450, category: 'Cakes', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', available: true },
  { name: 'Butterscotch Cake', description: 'Caramel butterscotch chips heaven', price: 460, category: 'Cakes', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400', available: true },

  // ── PASTRIES ──
  { name: 'Black Forest Pastry', description: 'Classic cherry and cream with choco shavings', price: 80, category: 'Pastries', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400', available: true },
  { name: 'Mango Mousse Pastry', description: 'Light and airy mango cream on sponge base', price: 90, category: 'Pastries', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', available: true },
  { name: 'Chocolate Pastry', description: 'Double chocolate fudge pastry', price: 85, category: 'Pastries', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400', available: true },

  // ── ICE CREAMS ──
  { name: 'Chocolate Ice Cream', description: 'Rich dark chocolate double scoop', price: 60, category: 'Ice Creams', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', available: true },
  { name: 'Vanilla Ice Cream', description: 'Classic creamy vanilla double scoop', price: 55, category: 'Ice Creams', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', available: true },
  { name: 'Strawberry Ice Cream', description: 'Fresh strawberry bliss double scoop', price: 65, category: 'Ice Creams', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', available: true },
  { name: 'Mango Ice Cream', description: 'Alphonso mango summer scoop', price: 70, category: 'Ice Creams', image: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=400', available: true },
  { name: 'Butterscotch Ice Cream', description: 'Caramel butterscotch chips delight', price: 65, category: 'Ice Creams', image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400', available: true },

  // ── COOKIES ──
  { name: 'Chocolate Chip Cookies', description: 'Freshly baked with generous chocolate chips, pack of 6', price: 120, category: 'Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', available: true },
  { name: 'Butter Cookies', description: 'Melt-in-mouth classic butter cookies, pack of 6', price: 100, category: 'Cookies', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400', available: true },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🗑  Clearing existing menu items...');
    await MenuItem.deleteMany();
    console.log('🌱 Inserting menu items...');
    await MenuItem.insertMany(sampleItems);
    console.log(`✅ Seeded ${sampleItems.length} items into TiDB Cloud!`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};
seed();
