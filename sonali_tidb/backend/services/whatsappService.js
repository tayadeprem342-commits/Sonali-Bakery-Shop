const axios = require('axios');

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

// helper to send a plain text WhatsApp message
const sendWhatsAppMessage = async (to, message) => {
  try {
    // phone numbers must be in international format without +
    const cleanNumber = to.replace(/\D/g, '');

    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: cleanNumber,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`📱 WhatsApp message sent to ${cleanNumber}`);
  } catch (error) {
    // don't crash the order flow if WhatsApp fails
    console.error('❌ WhatsApp send failed:', error.response?.data || error.message);
  }
};

// notify bakery owner about a new incoming order
const notifyOwner = async (order) => {
  const itemList = order.items
    .map((item) => `  • ${item.name} x${item.quantity}`)
    .join('\n');

  const paymentLabel = order.paymentMethod === 'online' ? 'Paid Online ✅' : 'Cash on Delivery 💵';

  const message =
    `🍰 *New Order Received!*\n\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Phone:* ${order.phone}\n\n` +
    `*Items:*\n${itemList}\n\n` +
    `*Total:* ₹${order.totalPrice}\n` +
    `*Payment:* ${paymentLabel}\n` +
    `*Address:* ${order.address}`;

  await sendWhatsAppMessage(process.env.OWNER_PHONE, message);
};

// send order confirmation to the customer
const confirmOrderToCustomer = async (order) => {
  const paymentLine = order.paymentMethod === 'online'
    ? `*Payment:* Received via UPI ✅\n\n`
    : `*Payment:* Cash on Delivery — ₹${order.totalPrice} due at delivery\n\n`;

  const message =
    `✅ *Order Confirmed!*\n\n` +
    `Hi ${order.customerName}, your order has been received.\n\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Status:* Pending\n` +
    paymentLine +
    `We'll notify you as your order progresses.\n` +
    `Thank you for ordering from us! 🎂`;

  await sendWhatsAppMessage(order.phone, message);
};

// notify customer when order status changes
const notifyStatusUpdate = async (order) => {
  const statusMessages = {
    accepted: `Your order #${order.orderId} has been *accepted* and will be prepared soon! 👍`,
    preparing: `Great news! Your order #${order.orderId} is now being *prepared* 🍰`,
    out_for_delivery: `Your order #${order.orderId} is *on the way*! 🛵`,
    delivered: `Your order #${order.orderId} has been *delivered*. Enjoy! 😊`,
    cancelled: `Sorry, your order #${order.orderId} has been *cancelled*. Please contact us for details.`,
  };

  const message = statusMessages[order.status];
  if (message) {
    await sendWhatsAppMessage(order.phone, message);
  }
};

module.exports = { notifyOwner, confirmOrderToCustomer, notifyStatusUpdate };
