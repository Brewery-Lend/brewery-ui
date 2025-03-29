'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ConnectWallet from './ConnectWallet';

interface HeaderProps {
  usdcBalance?: bigint;
}

export default function Header({ usdcBalance }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/borrow', label: 'Borrow' },
    { href: '/lend', label: 'Lend' },
    // { href: '/my-loans', label: 'My Portfolio' },
    // { href: '/assets', label: 'RWA Assets' },
  ];

  const isCurrentPath = (path: string) => pathname === path;

  return (
    <header className="bg-[#121212] border-b border-[#303030] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* <Link href="/" className="flex items-center" onClick={closeMenu}>
                <div className="relative h-10 w-10 mr-2">
                  <Image
                    src="/espresso-logo.png"
                    alt="Espresso RWA Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <span className="text-[#D48C3D] text-xl font-bold">Espresso</span>
                  <span className="text-white text-xl font-bold ml-1">RWA</span>
                </div>
              </Link> */}
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isCurrentPath(link.href)
                      ? 'bg-[#1A1A1A] text-[#D48C3D] border-b-2 border-[#D48C3D]'
                      : 'text-gray-300 hover:text-[#D48C3D]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex md:items-center">
            <ConnectWallet usdcBalance={usdcBalance} />
          </div>
          <div className="flex md:hidden items-center">
            <div className="flex items-center mr-2">
              <ConnectWallet usdcBalance={usdcBalance} />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#D48C3D] hover:bg-[#1A1A1A] focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#1A1A1A]`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isCurrentPath(link.href)
                  ? 'bg-[#252525] text-[#D48C3D]'
                  : 'text-gray-300 hover:bg-[#252525] hover:text-[#D48C3D]'
              }`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 