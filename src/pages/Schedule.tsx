import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { Loader2, CalendarDays } from "lucide-react";
// You may need to install date-fns-tz: npm install date-fns-tz
import { toZonedTime } from "date-fns-tz";

export default function Schedule() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["booked-leads-schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maid_to_perfection_leads")
        .select(
          `
          id,
          "fullName",
          "fullAddress",
          booking_date_time,
          cleaner_name,
          "Booking_status"
        `
        )
        .eq("Booking_status", "Booked")
        .not("booking_date_time", "is", null);

      if (error) throw error;

      return (data as any[]).map((lead) => {
        // FORCE THE TIME TO LONDON (UK)
        const utcDate = new Date(lead.booking_date_time);
        const londonDate = toZonedTime(utcDate, "Europe/London");

        return {
          id: lead.id,
          // We pass the ISO string of the London-zoned time
          start_time: londonDate.toISOString(),
          client_name: lead["fullName"] || "No Name",
          address: lead["fullAddress"] || "No Address Provided",
          status: lead["Booking_status"] || "Booked",
          cleaner_confirmed: true,
          cleaners: {
            name: lead.cleaner_name || "Unassigned",
            color_code: lead.cleaner_name ? "#f6ca15" : "#6b7280",
          },
        };
      });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-[#f6ca15]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex items-center justify-between px-2 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-[#f6ca15]" />
              Cleaner Schedule (UK Time)
            </h1>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-[#0a0a0a] border border-border rounded-xl overflow-hidden shadow-2xl">
          <div className="h-full overflow-y-auto">
            <WeeklyCalendar jobs={(jobs as any) || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
