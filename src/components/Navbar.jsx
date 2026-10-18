import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/content.js';
import Button from './Button.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape or when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 768px)');
    const onResize = (e) => e.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`on-navy sticky top-0 z-40 bg-navy-900 text-white transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(8,22,43,0.25)]' : ''
      }`}
    >
      <nav aria-label="Primary" className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" className="flex items-baseline gap-2 text-[1.05rem] font-semibold tracking-tight" onClick={close}>
          <span className="font-bold">NU</span>
          <span aria-hidden="true" className="text-white/35">|</span>
          <span>Employer Apprenticeships</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-[0.95rem] text-white/80 transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href="#inquiry" ctaId="become_partner" ctaLocation="nav" className="px-4 py-2.5">
            Become an Employer Partner
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 md:hidden motion-safe:animate-panel-in">
          <ul className="container-page flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close} className="block border-b border-white/10 py-3.5 text-lg text-white/90">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pb-3 pt-5">
              <Button href="#inquiry" ctaId="become_partner" ctaLocation="mobile_nav" onClick={close} className="w-full">
                Become an Employer Partner
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
