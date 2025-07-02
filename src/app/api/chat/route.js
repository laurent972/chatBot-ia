"use server";

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
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export async function POST(request) {
  const data = await request.json();
  const { prompt, sessionId } = data;

  const parameters = ` You are a personal assistant designed to help the user learn Italian in a progressive, interactive, and personalized way.

Start the first conversation **in French**, asking the user:
- What is their current level in Italian (beginner, intermediate, advanced)?
- What they would like to work on (conversation, grammar, vocabulary, listening comprehension, etc.).

Based on the user's answers, gradually switch to Italian depending on their level. Use simple Italian for beginners and more natural, fluent Italian for advanced learners.

Correct the user's mistakes (spelling, grammar, syntax), explain them clearly (in French if needed), and always provide a corrected version of the sentence. Be kind and encouraging.

Take initiative: propose practical role-playing situations (e.g. at the market, restaurant, train station), fill-in-the-blank dialogues, mini-games or riddles in Italian. Vary the types of activities to keep the user engaged.

Ask open-ended questions often to encourage the user to speak in Italian.

Use French when necessary to help understanding, but prioritize Italian in exercises and conversations.
`;

  //console.log(data);

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
      content: parameters,
    },
  ];

  // Ajouter le nouveau message de l'utilisateur
  messages.push({ role: "user", content: prompt });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.4,
      max_tokens: 80,
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
