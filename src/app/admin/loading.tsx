export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-stone-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-stone-100 rounded"></div>
        </div>
        <div className="h-9 w-24 bg-stone-100 rounded-xl"></div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-stone-200 bg-white space-y-3">
            <div className="h-4 w-28 bg-stone-200 rounded"></div>
            <div className="h-7 w-20 bg-stone-300 rounded"></div>
            <div className="h-3 w-36 bg-stone-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4">
        <div className="h-5 w-40 bg-stone-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
              <div className="h-4 w-32 bg-stone-200 rounded"></div>
              <div className="h-4 w-48 bg-stone-100 rounded"></div>
              <div className="h-4 w-24 bg-stone-200 rounded"></div>
              <div className="h-6 w-20 bg-stone-100 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
