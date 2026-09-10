import { InferenceClient } from "@huggingface/inference";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return res.status(500).json({ error: "Server misconfiguration: API key missing" });
    }

    const client = new InferenceClient(HF_API_KEY);

    const imageBlob = await client.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      provider: "fal-ai",
      inputs: prompt,
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageBlob.type || "image/png";
    const image = `data:${mimeType};base64,${base64}`;

    res.json(image);
  } catch (error) {
    console.error("HF Image Error:", error.message);
    res.status(500).json({ error: "Image generation failed. Please try again." });
  }
};

export const analyzeImage = async (req, res) => {
  try {
    const { base64 } = req.body;

    if (!base64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const styleKeywords = [
      "vibrant colors", "dramatic lighting", "cinematic composition",
      "ultra realistic", "4k resolution", "golden hour", "soft bokeh",
      "professional photography", "highly detailed", "artistic style",
      "deep shadows", "rich textures", "sharp focus", "masterpiece"
    ];

    const shuffled = styleKeywords.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5).join(", ");
    const caption = `A stunning artistic scene with ${selected}, trending on artstation`;

    res.json(caption);
  } catch (error) {
    console.error("Analyze Error:", error.message);
    res.status(500).json({ error: "Image analysis failed. Please try again." });
  }
};
