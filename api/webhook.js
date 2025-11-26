import { bot, handleUpdate } from "../index.js";

export const config = {
  api: {
    bodyParser: false, // <<< MUST HAVE ON VERCEL
  },
};

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      let body = "";

      // собираем raw-stream
      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        const update = JSON.parse(body);

        await handleUpdate(update);
        res.status(200).json({ ok: true });
      });

    } else {
      res.status(200).send("Webhook works");
    }
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ ok: false });
  }
}
