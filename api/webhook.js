const { handleUpdate } = require("../index.js");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Ошибка в webhook:", error);
      res.status(500).json({ ok: false });
    }
  } else {
    res
      .status(200)
      .send("Cedric desserts bot is running. Webhook работает.");
  }
};
