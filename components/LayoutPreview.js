export default function LayoutPreview({ layout_type }) {
  if (!layout_type) return null;

  const common = 'rounded-lg shadow-md animate-pulse bg-white/10 backdrop-blur';

  const layouts = {
    carousel: (
      <div className="flex gap-2 overflow-x-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${common} w-32 h-48 shrink-0`} />
        ))}
      </div>
    ),
    grid: (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`${common} h-24`} />
        ))}
      </div>
    ),
    moodboard: (
      <div className="flex flex-wrap gap-2">
        <div className={`${common} w-40 h-32`} />
        <div className={`${common} w-24 h-40`} />
        <div className={`${common} w-32 h-32`} />
      </div>
    ),
    timeline: (
      <div className="flex flex-col gap-3 border-l border-white/20 pl-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${common} h-6 w-2/3`} />
        ))}
      </div>
    ),
    storyboard: (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${common} h-20 w-full`} />
        ))}
      </div>
    ),
    gallery: (
      <div className="grid grid-cols-4 gap-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`${common} h-20`} />
        ))}
      </div>
    ),
  };

  return (
    <div className="p-4 bg-black/20 rounded-xl border border-white/10 mt-2">
      <p className="mb-2 text-sm font-semibold uppercase text-white/60">
        {layout_type} preview
      </p>
      {layouts[layout_type] || <p className="text-white/40">Unknown layout</p>}
    </div>
  );
}
