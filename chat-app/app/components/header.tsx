import Link from "next/link";

const links = [
  { href: "/demo", label: "お試し" },
  { href: "/group", label: "グループ" },
  { href: "/about", label: "About" },
];

const Header = () => {
  return (
    <header className="border-b flex items-center h-14 px-4">
      <h1 className="mr-8">
        <Link href="/">Home</Link>
      </h1>
      <nav className="flex gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
