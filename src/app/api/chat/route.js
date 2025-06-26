import { NextResponse } from "next/server";
import OpenAI from "openai";

// export async function GET() {
//   return Response.json({
//     message: "Hello depuis la route GET de /api/chat 🎉",
//   });
// }

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function POST(request) {
  const data = await request.json();
  console.log(data.prompt);

  // try {
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "user",
  //         content: "Are you ok ?",
  //       },
  //     ],
  //   });

  //   const responseApi = response.choices[0].message.content;

  //   return NextResponse.json(
  //     {
  //       message: "Success",
  //       data: responseApi,
  //     },
  //     {
  //       status: 200,
  //     }
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return NextResponse.json(
  //     {
  //       message: "Erreur :" + err,
  //     },
  //     {
  //       status: 500,
  //     }
  //   );
  // }
}
