export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div
        className="w-24 h-3 rounded-full mb-3"
        style={{ background: "rgba(255,255,255,0.08)", animation: "skeleton-pulse 1.6s ease-in-out infinite" }}
      />
      <div
        className="w-64 h-9 rounded-lg mb-2"
        style={{ background: "rgba(255,255,255,0.08)", animation: "skeleton-pulse 1.6s ease-in-out infinite 0.1s" }}
      />
      <div
        className="w-96 max-w-full h-4 rounded-full mb-10"
        style={{ background: "rgba(255,255,255,0.06)", animation: "skeleton-pulse 1.6s ease-in-out infinite 0.2s" }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl"
            style={{
              background: "#121316",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: `skeleton-pulse 1.6s ease-in-out infinite ${i * 0.12}s`,
            }}
          >
            <div className="w-32 h-4 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="w-20 h-3 rounded-full mt-4" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
