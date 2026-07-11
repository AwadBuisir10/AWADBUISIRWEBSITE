const stages = ["Build", "Automate", "Grow", "Lead"];

/** Wide-screen editorial progress rail driven by the document scroll timeline. */
export function ExecutionRail() {
  return (
    <aside className="execution-rail" aria-hidden="true">
      <span className="execution-rail__track">
        <span className="execution-rail__progress" />
      </span>
      <ol className="execution-rail__labels">
        {stages.map((stage, index) => (
          <li key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {stage}
          </li>
        ))}
      </ol>
    </aside>
  );
}
