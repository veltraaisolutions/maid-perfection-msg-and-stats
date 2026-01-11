import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { Loader2 } from "lucide-react";

export default function Schedule() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs-with-cleaners-schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          cleaners (name, color_code)
        `)
        .neq("status", "Cancelled")
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cleaner Schedule</h1>
          <p className="text-muted-foreground">Weekly calendar view of all jobs</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-muted-foreground">Legend:</span>
          {jobs?.slice(0, 4).map((job) => job.cleaners && (
            <div key={job.cleaners.name} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: job.cleaners.color_code }}
              />
              <span className="text-sm text-foreground">{job.cleaners.name}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <WeeklyCalendar jobs={jobs || []} />
      </div>
    </DashboardLayout>
  );
}
