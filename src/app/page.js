import Image from "next/image";
import Chat from "./component/Chat";

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-col b-5">
      <header className="py-3 p-5">
        <Image
          src="/img/chatbotai-logo.png"
          width={250}
          height={88}
          priority={true}
          alt="a cat with boots AI"
        />
      </header>
      <Chat />
    </main>
  );
}
