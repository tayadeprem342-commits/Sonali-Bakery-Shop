/**
 * fix_images.js — Updates all menu item images to unique, dish-matching photos
 * Run: node fix_images.js
 */
const dotenv = require('dotenv');
dotenv.config();
const { connectDB, pool } = require('./config/db');

const imageMap = [
  // SIZZLER
  ['Chocolate Brownie Sizzler',       'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400'],
  ["Coconut's Pruwnie Sizzler",       'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'],

  // MASTANI
  ['Mango Mastani',                   'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400'],
  ['Pineapple Mastani',               'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400'],
  ['Strawberry Mastani',              'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400'],
  ['Rose Mastani',                    'https://images.unsplash.com/photo-1619158401201-8d5a353f9ab3?w=400'],
  ['Mix Fruit Mastani',               'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400'],
  ['Blueberry Mastani',               'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400'],

  // MOCKTAIL
  ['Green Mint Mojito',               'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'],
  ['Virgin Mojito',                   'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400'],
  ['Blue Lagoon',                     'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'],
  ['Jeera Mint Masala',               'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400'],
  ['Rose Tim Tim',                    'https://images.unsplash.com/photo-1596803244618-8dea9b57e2e7?w=400'],

  // LASSI
  ['Ghamandi Lassi',                  'https://images.unsplash.com/photo-1625865881222-7958a3e49dc3?w=400'],
  ['Ghamandi Ice Cream Lassi',        'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400'],

  // MOMOS
  ['Veg Momos (Steam)',               'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400'],
  ['Schezwan Momos (Steam)',          'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400'],
  ['Red Gravy Momos (Steam)',         'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'],
  ['White Gravy Momos (Steam)',       'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400'],
  ['Paneer Momos (Fried)',            'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400'],
  ['Paneer Afghani Momos',            'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400'],

  // DESHI KULLAD
  ['Kullad Veggi Paneer Tikka',       'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'],
  ['Kullad Paneer Tikka',             'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400'],
  ['Kullad Paneer Afghani Tikka',     'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400'],
  ['Kullad Creamy Corn',              'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],

  // SHAKES
  ['Cold Coffee',                     'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'],
  ['Cold Coffee with Crush',          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
  ['Cold Coffee with Ice Cream',      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'],
  ['Thick Pineapple Shake',           'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400'],
  ['Thick Butter Scotch Shake',       'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400'],
  ['Thick Strawberry Shake',          'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400'],
  ['Thick Blueberry Shake',           'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400'],
  ['Thick Mango Shake',               'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400'],
  ['Thick Chocolata Shake',           'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'],
  ['Thick Oreo Shake',                'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400'],
  ['Thick Kit Kat Shake',             'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400'],
  ['Thick Chocolate Brownie Shake',   'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'],
  ['Thick Anjeer Shake',              'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400'],
  ['Thick Kalkatta Paan Shake',       'https://images.unsplash.com/photo-1619158401201-8d5a353f9ab3?w=400'],
  ['Cad B Shake',                     'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'],

  // SANDWICH
  ['Plain Sandwich',                  'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400'],
  ['Butter Sandwich',                 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'],
  ['Corn Sandwich',                   'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400'],
  ['Veg Cheese Grill Sandwich',       'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400'],
  ['Veg Paneer Corn Sandwich',        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'],
  ['Veg Paneer Tikka Sandwich',       'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'],
  ['Masala Butter Pizza',             'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
  ['Schezwan Cheese Grill Sandwich',  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400'],
  ['Cheese Chatpata Sandwich',        'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400'],
  ['Veg Bahubali Cheese Sandwich',    'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400'],
  ['Bombay Chatpata Sandwich',        'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400'],
  ['Paneer Tikka Sandwich',           'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400'],

  // FRENCH FRIES
  ['Salted French Fries',             'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'],
  ['Masala French Fries',             'https://images.unsplash.com/photo-1584929650015-b52f3adc9c00?w=400'],
  ['Peri Peri French Fries',          'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400'],
  ['Cheese French Fries',             'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400'],
  ['Magic Masala French Fries',       'https://images.unsplash.com/photo-1625921705770-c8c59e8e5bf0?w=400'],

  // SHOTS & SNACKS
  ['Potato Cheese Shots (15 pcs)',    'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400'],
  ['Veg Nuggets (10 pcs)',            'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'],
  ['Potato Chilli Garlic Shots (15 pcs)', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400'],
  ['Simless Masala (10 pcs)',         'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=400'],
  ['Salted Simless (10 pcs)',         'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400'],

  // PASTA
  ['Red Sauce Pasta',                 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400'],
  ['White Sauce Pasta',               'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'],

  // PIZZA
  ['Butter Cheese Pizza',             'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400'],
  ['Tomato Sauce Pizza',              'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'],
  ['Butter Pizza',                    'https://images.unsplash.com/photo-1548369937-47519962c11a?w=400'],
  ['Onion Capsicum Pizza',            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
  ['Wild Spicy Pizza',                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'],
  ['Paneer Cheese Pizza',             'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400'],
  ['Onion Mushroom Pizza',            'https://images.unsplash.com/photo-1520201163981-8cc95007e71d?w=400'],
  ['Margherita Pizza',                'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'],
  ['Cheese Sweet Corn Pizza',         'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400'],
  ['Veg Garlic Pizza',                'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400'],
  ['Paneer Tikka Pizza',              'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400'],
  ['Paneer Peri Peri Pizza',          'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400'],
  ['Tandoor Veggie Pizza',            'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400'],
  ['Double Veg Cheese Pizza',         'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'],
  ['Bahubal Italian Pizza',           'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400'],
  ['Veg Farm House Pizza',            'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'],

  // BURGERS
  ['Veg Burger',                      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400'],
  ['Veg Cheese Burger',               'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'],
  ['Mexican Burger',                  'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400'],
  ['Tandoor Burger',                  'https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=400'],
  ['Paneer Tikka Burger',             'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400'],
  ['Classic Burger',                  'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?w=400'],
  ['Cheese Burger',                   'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400'],

  // GARLIC BREAD
  ['Garlic Chili Bread Butter',       'https://images.unsplash.com/photo-1619531040576-f9416740661d?w=400'],
  ['Garlic Cheese Corn Bread Butter', 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400'],
  ["Garlic Dev's Bread Butter",       'https://images.unsplash.com/photo-1646166419149-6f0c65e10e64?w=400'],

  // CAKES
  ['Chocolate Truffle Cake',          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'],
  ['Red Velvet Cake',                 'https://images.unsplash.com/photo-1586788680434-30d324626f4c?w=400'],
  ['Black Forest Cake',               'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400'],
  ['Pineapple Cake',                  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'],
  ['Butterscotch Cake',               'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400'],

  // PASTRIES
  ['Black Forest Pastry',             'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400'],
  ['Mango Mousse Pastry',             'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'],
  ['Chocolate Pastry',                'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400'],

  // ICE CREAMS
  ['Chocolate Ice Cream',             'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'],
  ['Vanilla Ice Cream',               'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400'],
  ['Strawberry Ice Cream',            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400'],
  ['Mango Ice Cream',                 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=400'],
  ['Butterscotch Ice Cream',          'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400'],

  // COOKIES
  ['Chocolate Chip Cookies',          'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400'],
  ['Butter Cookies',                  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400'],
];

const run = async () => {
  try {
    await connectDB();
    console.log(`🖼️  Updating images for ${imageMap.length} items...`);
    let updated = 0;
    for (const [name, image] of imageMap) {
      const [result] = await pool.query(
        'UPDATE menu_items SET image = ? WHERE name = ?',
        [image, name]
      );
      if (result.affectedRows > 0) updated++;
    }
    console.log(`✅ Updated ${updated} / ${imageMap.length} items`);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
};
run();
