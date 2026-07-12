"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { socialLinks } from "@/data/socialLinks";

const icons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin
};

export function SocialLinks({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {socialLinks.map((link) => {
        const Icon = icons[link.network] ?? Instagram;
        return (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 active:scale-95 ${dark ? "text-white/45 hover:bg-white/10 hover:text-white" : "text-steel hover:bg-black/[0.04] hover:text-navy"}`}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
