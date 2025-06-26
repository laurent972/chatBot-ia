import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ReactQueryProvider>
          {children} <ReactQueryDevtools />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
