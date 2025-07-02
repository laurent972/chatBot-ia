import Image from "next/image";
import Chat from "./component/Chat";

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-col pb-5 h-view">
      <header className="py-3 p-5 text-center">
        <Image
          src="/img/chatbotai-logo.png"
          width={250}
          height={88}
          priority={true}
          alt="a cat with boots AI"
        />
        🍕 v-1 italien 🇮🇹
      </header>
      <Chat />
    </main>
  );
}
