import { NAV_LINKS } from '../data/content.js';
import Button from './Button.jsx';

export default function Footer() {
  return (
    <footer className="on-navy bg-navy-950 text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="flex items-baseline gap-2 text-lg font-semibold tracking-tight">
            <span className="font-bold">NU</span>
            <span aria-hidden="true" className="text-white/35">|</span>
            <span>Employer Apprenticeships</span>
          </p>
          <p className="mt-3 max-w-sm text-white/65">Questions about hosting student apprentices? Start with a short inquiry.</p>
          <Button href="#inquiry" variant="light" ctaId="contact" ctaLocation="footer" className="mt-6">
            Contact the program team
          </Button>
        </div>
        <nav aria-label="Footer" className="md:col-span-7 md:justify-self-end">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:flex sm:gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-white/75 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#inquiry" className="text-white/75 hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-[0.8rem] text-white/50">
          Independent interview prototype. Illustrative content only; not an official Northeastern University website.
        </p>
      </div>
    </footer>
  );
}
