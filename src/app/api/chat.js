import OpenAI, { Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI();

export async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed, please try use POST" });
  }

  try {
    console.log("toto");

    const prompt = req.body.prompt;
    console.log(prompt);

    const gptResponse = await openai.responses.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: "Write a one-sentence bedtime story about a unicorn.",
        },
        {
          role: "user",
          content: "What was a positive news story from today?",
        },
      ],
    });

    console.log(gptResponse);
    return res
      .status(200)
      .json({ message: "Success", data: gptResponse.data.choices[0].message });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal server error" });
  }
}
