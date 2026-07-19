import type { ProjectStackLayer } from "@/data/projects";

export type ProjectStackProps = {
  layers: ProjectStackLayer[];
  variant?: "detailed" | "compact";
};

export function ProjectStack({ layers, variant = "detailed" }: ProjectStackProps) {
  if (variant === "compact") {
    return <CompactStack layers={layers} />;
  }

  return <DetailedStack layers={layers} />;
}

function DetailedStack({ layers }: Pick<ProjectStackProps, "layers">) {
  const layerCount = String(layers.length).padStart(2, "0");

  return (
    <section aria-label="Stack map" className="relative overflow-hidden rounded-xl border border-line bg-white shadow-card">
      <span
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-seafoam-600 via-cyan to-signal"
        aria-hidden="true"
      />

      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-navy">Stack map</h4>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-steel">
          {layerCount} {layers.length === 1 ? "layer" : "layers"}
        </p>
      </header>

      <ol className="grid grid-cols-1 gap-px bg-line md:grid-cols-[repeat(auto-fit,minmax(10.5rem,1fr))]">
        {layers.map((layer, index) => (
          <li key={`${layer.label}-${layer.tool}`} className="relative min-w-0 bg-white px-5 py-5">
            <span
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-seafoam-600/70 via-cyan/60 to-transparent"
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-seafoam-700">Layer</span>
              <span className="font-mono text-[9px] tabular-nums text-fog">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h5 className="mt-5 font-display text-lg font-medium tracking-[-0.015em] text-navy">{layer.label}</h5>
            <p className="mt-2 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] text-seafoam-700">{layer.tool}</p>
            <p className="mt-4 text-sm leading-6 text-slate">{layer.responsibility}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CompactStack({ layers }: Pick<ProjectStackProps, "layers">) {
  return (
    <section aria-label="Project stack" className="rounded-lg border border-white/10 bg-[#071b25] px-3 py-3">
      <h4 className="sr-only">Stack map</h4>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-x-2 gap-y-3">
        {layers.map((layer, index) => (
          <li key={`${layer.label}-${layer.tool}`} className="min-w-0">
            <div className="mb-2 flex items-center" aria-hidden="true">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-seafoam-400/50 bg-[#071b25] font-mono text-[7px] tabular-nums text-seafoam-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index < layers.length - 1 ? (
                <span className="h-px min-w-2 flex-1 bg-gradient-to-r from-seafoam-400/55 to-cyan/15" />
              ) : null}
            </div>
            <p className="break-words font-mono text-[8px] uppercase leading-3 tracking-[0.1em] text-white/45">{layer.label}</p>
            <p className="mt-1 text-[11px] font-medium leading-4 text-white/85">{layer.tool}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
