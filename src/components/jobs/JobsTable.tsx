import React from "react";
import { Job } from "@/pages/Jobs";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface JobsTableProps {
  jobs: Job[];
  onCancelJob: (job: Job) => void;
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  // Using UK formatting as requested
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  });
}

export function JobsTable({ jobs, onCancelJob }: JobsTableProps) {
  return (
    <div className="w-full">
      <DataTable
        columns={columns(onCancelJob)}
        data={jobs}
      />
    </div>
  );
}
