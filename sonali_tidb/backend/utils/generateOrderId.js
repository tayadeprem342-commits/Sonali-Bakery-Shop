// generate a short, human-readable order ID like #BKR-10045
const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-5); // last 5 digits of timestamp
  return `BKR-${timestamp}`;
};

module.exports = generateOrderId;
