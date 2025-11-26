const { handleUpdate } = require("../index.js");

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      await handleUpdate(req.body);
      return res.status(200).json({ ok: true });
    }

    return res.status(200).send("Cedric desserts bot is running.");
  } catch (err) {
    console.error("Ошибка в webhook:", err);
    res.status(500).json({ ok: false });
  }
};
