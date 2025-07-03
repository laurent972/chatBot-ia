"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Chat from "./component/Chat";

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-col ">
      <header className="pt-1 p-2 text-center shadow-lg w-full  sticky top-0 bg-white">
        <>
          <Image
            src="/img/chatbotai-logo.png"
            width={200}
            height={70}
            priority={true}
            alt="a cat with boots AI"
            className="mx-auto"
          />
          🍕 v-1 italien 🇮🇹
        </>
      </header>
      <Chat />
    </main>
  );
}
