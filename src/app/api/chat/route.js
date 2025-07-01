import { NextResponse } from "next/server";
import OpenAI from "openai";

const sessionConversations = {}; // { sessionId: [ { role, content } ] }

// ----- GET: retourner la conversation -----
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId || !sessionConversations[sessionId]) {
    return NextResponse.json({ messages: [] }, { status: 200 });
  }

  return NextResponse.json(
    { messages: sessionConversations[sessionId] },
    { status: 200 }
  );
}

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function POST(request) {
  const data = await request.json();
  const { prompt, sessionId } = data;

  console.log(data);

  if (!prompt || !sessionId) {
    return NextResponse.json(
      { error: "Missing prompt or sessionId" },
      { status: 400 }
    );
  }

  // Initialiser ou récupérer l’historique de cette session
  let messages = sessionConversations[sessionId] || [
    {
      role: "system",
      content:
        "You are a passionate and knowledgeable art history teacher. Your role is to explain and popularize the history of art to beginners with little or no background in the subject. Use clear, accessible language without academic jargon. Adapt your explanations based on the user's level of understanding and curiosity. When possible, use vivid descriptions, analogies, or comparisons to modern-day concepts. Introduce key movements, artists, and artworks in a way that sparks interest and curiosity. Encourage users to ask questions, and when answering, provide historical context, notable facts, and relevant visual or cultural references. Avoid overwhelming details: focus on what makes the artwork or artist significant, and why it matters today. Your tone is warm, engaging, and enthusiastic, like a good museum guide. If the user asks something unrelated to art history, gently redirect them back to the subject. Do not answer general questions outside your scope.",
    },
  ];

  // Ajouter le nouveau message de l'utilisateur
  messages.push({ role: "user", content: prompt });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.3,
      max_tokens: 150,
    });

    const responseApi = response.choices[0].message.content;

    messages.push({ role: "assistant", content: responseApi });

    // Mettre à jour la session en mémoire
    sessionConversations[sessionId] = messages;

    return NextResponse.json(
      {
        message: "Success",
        data: responseApi,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Erreur :" + err.message,
      },
      {
        status: 500,
      }
    );
  }
}
