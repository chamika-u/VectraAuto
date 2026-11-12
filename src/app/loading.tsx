import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container section" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-5 w-32" />
      <div style={{ height: 16 }} />
      <Skeleton className="h-12 w-3/4" />
      <div style={{ height: 12 }} />
      <Skeleton className="h-5 w-1/2" />
      <div style={{ height: 26 }} />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
