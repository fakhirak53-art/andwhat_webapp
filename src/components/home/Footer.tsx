import Link from "next/link";
import Image from "next/image";

const footerNavLinks = [
  { label: "Home", href: "/" },
  { label: "For Teachers", href: "#" },
  { label: "For Students", href: "#" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Top section */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
          {/* Logo + address */}
          <div className="lg:w-72 flex-shrink-0">
            <Image src="/logo.png" alt="AndWhat Logo" width={140} height={40} />
            <div className="mt-5 text-[13px] text-gray-500 leading-relaxed space-y-1">
              <p>
                <span className="font-semibold text-gray-700">Corporate Head Office:</span>{" "}
                Lorem ipsum dolor sit amet consectetur adipiscing elit
              </p>
              <p>
                <span className="font-semibold text-gray-700">Phone:</span> 843-496-7759
              </p>
              <p>
                <span className="font-semibold text-gray-700">Fax:</span> 02-222264303
              </p>
              <p>
                <span className="font-semibold text-gray-700">Email:</span> lorem ipsm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav links row */}
      <div className="border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 py-5">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {footerNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium text-gray-700 hover:text-[#0048AE] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <Link
              href="#"
              className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-[13px] text-gray-400">©2026 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
