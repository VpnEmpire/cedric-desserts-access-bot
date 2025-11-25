const { handlePaymentWebhook } = require("../index.js");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    return handlePaymentWebhook(req, res);
  }

  res.status(200).send("Юкасса Webhook активен");
};

