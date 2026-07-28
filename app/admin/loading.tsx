export default function AdminLoading() {
  return (
    <div className="w-full h-full p-6 space-y-6 animate-pulse">
      <div className="h-28 bg-slate-200 rounded-2xl w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl w-full" />
        ))}
      </div>

      <div className="h-64 bg-slate-200 rounded-xl w-full" />
    </div>
  );
}
