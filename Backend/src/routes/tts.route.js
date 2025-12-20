import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const VOICE_ID = "4RZ84U1b4WCqpu57LvIq"; // ✅ YOUR voice ID

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs Error:", errorText);
      return res.status(500).json({ error: "ElevenLabs TTS failed" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.json({
      audio: `data:audio/mp3;base64,${buffer.toString("base64")}`,
    });
  } catch (err) {
    console.error("❌ TTS Server Crash:", err);
    res.status(500).json({ error: "TTS server error" });
  }
});

export default router;
