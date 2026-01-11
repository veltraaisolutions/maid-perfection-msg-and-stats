import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Briefcase, PoundSterling, Loader2 } from "lucide-react";

interface Job {
  id: string;
  booking_date_time: string | null;
  Booking_status: string | null;
  price?: number | null;
  // future fields will appear in console
  [key: string]: any;
}

export default function Dashboard() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["maid_to_perfection_leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<Job>("maid_to_perfection_leads")
        .select("*")
        .eq("Booking_status", "Booked")
        .order("booking_date_time", { ascending: true });

      if (error) throw error;

      console.log("Dashboard jobs fetched from DB:", data); // 🔹 log all fields for future reference
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
      </DashboardLayout>
    );
  }

  const totalJobs = jobs.length;
  const totalRevenue = jobs.reduce(
    (sum, job) => sum + Number(job.price ?? 0),
    0
  );

  // Prepare chart data by booking date
  const chartDataMap: Record<string, { bookings: number; revenue: number }> =
    {};
  jobs.forEach((job) => {
    if (!job.booking_date_time) return;
    const dateStr = new Date(job.booking_date_time).toLocaleDateString(); // DD/MM/YYYY
    if (!chartDataMap[dateStr])
      chartDataMap[dateStr] = { bookings: 0, revenue: 0 };
    chartDataMap[dateStr].bookings += 1;
    chartDataMap[dateStr].revenue += Number(job.price ?? 0);
  });

  // Convert map to array for chart
  const chartData = Object.entries(chartDataMap).map(([date, val]) => ({
    date,
    bookings: val.bookings,
    revenue: val.revenue,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Jobs & revenue overview</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            title="Total Jobs"
            value={totalJobs}
            subtitle="All booked jobs"
            icon={Briefcase}
            variant="highlight"
          />
          <MetricCard
            title="Total Revenue"
            value={`£${totalRevenue.toLocaleString()}`}
            subtitle="Revenue from booked jobs"
            icon={PoundSterling}
            variant="highlight"
          />
        </div>

        {/* Revenue Chart */}
        <RevenueChart data={chartData} />
      </div>
    </DashboardLayout>
  );
}
