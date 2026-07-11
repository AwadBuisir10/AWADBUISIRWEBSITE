import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-steel">
          © {new Date().getFullYear()} Awad Buisir · Boston, MA
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
