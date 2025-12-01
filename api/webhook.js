const { handleUpdate } = require("../index.js");

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      let body = "";

      // собираем тело запроса
      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const update = JSON.parse(body);

          // вызываем твою функцию обработки
          await handleUpdate(update);

          res.status(200).json({ ok: true });
        } catch (err) {
          console.error("JSON parse/update error:", err);
          res.status(500).json({ ok: false });
        }
      });

    } else {
      res.status(200).send("Webhook works");
    }
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ ok: false });
  }
};
