"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github
};

export function SocialLinks({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { socialLinks } = useSiteContent();
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {socialLinks.filter(link => link.href).map((link) => {
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
