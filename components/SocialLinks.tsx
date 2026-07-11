"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { socialLinks } from "@/data/socialLinks";

const icons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin
};

export function SocialLinks({ className = "" }: { className?: string }) {
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
              className="flex h-11 w-11 items-center justify-center rounded-full text-steel transition-colors duration-150 hover:bg-black/[0.04] hover:text-navy active:scale-95"
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
