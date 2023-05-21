import "./globals.css";
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamJuree,
} from "next/font/google";

import Copyright from "@/components/Copyright";
import Hero from "@/components/Hero";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";

import { cookies } from "next/headers";

// aqui é configurado a fonte
// subset define o unicode
// Roboto possui _Flex então ela é adaptável a tudo o quanto fizermos com ela
// já a baiJam não, então precisamos definir o weight a qual iremos usar a fonte
/*Para integrar com o tailwind nós usamos a propriedade variable
que define um nome para a variável que a fonte criará no css
o next importa a fonte e define um nome para ela no css var(--font-nomefonte)
procure usar o nome da fonte mesmo
 */
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const baiJamjuree = BaiJamJuree({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bai-jamjuree",
});

export const metadata = {
  title: "NLW Spacetime",
  description:
    "Uma cápsula do tempo construída com react, nextjs, tailwind e typescript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // acessar o cookie que contém o token
  const isAuthenticated = cookies().has("token");
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-700 font-sans text-gray-100`}
      >
        <main className="grid min-h-screen grid-cols-2">
          {/*Coluna da esquerda */}
          <div
            className="
        relative
       flex
      flex-col
      items-start
         justify-between
         overflow-hidden 
        border-r 
        border-white/10 
        bg-[url('../assets/bg-stars.svg')] 
        bg-cover
        px-28
        py-16"
          >
            {/*blur */}
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />
            {/*stripes */}
            <div className="border-white/1- absolute bottom-0 right-0  top-0 w-2  bg-stripes"></div>

            {isAuthenticated ? <Profile /> : <SignIn />}

            <Hero />
            <Copyright />
          </div>
          {/*Coluna da direita */}
          <div className="flex max-h-screen flex-col overflow-y-scroll bg-[url('../assets/bg-stars.svg')] bg-cover">
            {children}
          </div>
        </main>
        );
      </body>
    </html>
  );
}
