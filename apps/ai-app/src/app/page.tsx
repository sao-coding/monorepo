import Link from "next/link";

const HomePage = () => {
  const links = [
    { href: "/img2text", label: "Image to Text" },
    { href: "/translate", label: "Translate" },
    { href: "/asr", label: "ASR" },
    { href: "/tts", label: "TTS" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-blue-500 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default HomePage;
