// src/app/contact/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-[#42669B]" style={{ backgroundImage: "url(/assets/lander/Background.svg)", backgroundSize: "cover" }}>
      <Link href="/">
      <Image src="/assets/lander/Logo.svg" style={{ position: "fixed", top: 20, left: 20 }} width={100} height={100} alt="Company Culture Match Logo" />
      </Link>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 z-[20]">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[4rem] text-center text-[#42669B]">
          For Companies
        </h1>
        <p className="text-center text-2xl">
          Looking to find the perfect cultural fit and getting valuable insight on your team?
        </p>
        <p className="text-2xl">
          Contact Team <span className="font-bold">Galaktisen suuri menestys </span>at Junction 2024 to learn more about our solutions!
        </p>
        <p className="text-lg">
          Or send email at <a href="mailto:asdas@asdas.com" className="underline text-[#2A4060] hover:text-[#42669B]">contact@1statoffa.com</a>
        </p>
      </div>
    </main>
  );
}
