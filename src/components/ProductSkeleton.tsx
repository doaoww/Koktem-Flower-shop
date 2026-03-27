export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-50 animate-pulse">
      <div className="h-56 bg-rose-100" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-rose-100 rounded w-3/4" />
        <div className="h-4 bg-rose-50 rounded w-full" />
        <div className="h-4 bg-rose-50 rounded w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 bg-rose-100 rounded w-20" />
          <div className="h-8 bg-rose-100 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
}
