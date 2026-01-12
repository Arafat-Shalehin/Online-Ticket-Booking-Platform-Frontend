import React from "react";
import { Card, CardContent, CardHeader } from "../../Components/ui/card";

const Block = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const TicketDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 space-y-3">
          <Block className="h-4 w-24" />
          <Block className="h-9 w-3/5" />
          <Block className="h-4 w-2/5" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Left */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="h-64 w-full bg-muted animate-pulse" />
            </div>

            <Card>
              <CardHeader>
                <Block className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <Block className="h-3 w-16" />
                      <Block className="mt-2 h-5 w-36" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Block className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Block key={i} className="h-8 w-28 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <Block className="h-4 w-32" />
                <Block className="h-10 w-40" />
                <Block className="h-9 w-full rounded-md" />
                <div className="space-y-2">
                  <Block className="h-4 w-full" />
                  <Block className="h-4 w-5/6" />
                  <Block className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <Block className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsSkeleton;
