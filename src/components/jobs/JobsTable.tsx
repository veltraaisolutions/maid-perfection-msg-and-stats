import React from "react";
import { Trash2 } from "lucide-react";

interface Job {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  fullAddress?: string | null;
  serviceType?: string | null;
  frequency?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  lastCleanDate?: string | null;
  bookingDateTime?: string | null;
  bookingStatus?: string | null;
}

interface JobsTableProps {
  jobs: Job[];
  onCancelJob: (job: Job) => void;
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function JobsTable({ jobs, onCancelJob }: JobsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border border-border rounded-md">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3 min-w-[140px]">Client Name</th>
            <th className="p-3 min-w-[200px]">Email</th>
            <th className="p-3 min-w-[120px]">Phone</th>
            <th className="p-3 min-w-[200px]">Address</th>
            <th className="p-3 min-w-[120px]">Service Type</th>
            <th className="p-3 min-w-[100px]">Frequency</th>
            <th className="p-3 text-center min-w-[80px]">Bedrooms</th>
            <th className="p-3 text-center min-w-[80px]">Bathrooms</th>
            <th className="p-3 text-center min-w-[140px]">Last Clean Date</th>
            <th className="p-3 text-center min-w-[160px]">Booking Date/Time</th>
            <th className="p-3 text-center min-w-[120px]">Status</th>
            <th className="p-3 text-center min-w-[80px]">Delete</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 && (
            <tr>
              <td
                colSpan={12}
                className="p-6 text-center text-muted-foreground"
              >
                No jobs found.
              </td>
            </tr>
          )}
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-t border-border hover:bg-muted/30 transition-colors"
            >
              <td className="p-3 whitespace-normal break-words">
                {job.fullName || "-"}
              </td>
              <td className="p-3 whitespace-normal break-words">
                {job.email || "-"}
              </td>
              <td className="p-3">{job.phone || "-"}</td>
              <td className="p-3 whitespace-normal break-words">
                {job.fullAddress || "-"}
              </td>
              <td className="p-3">{job.serviceType || "-"}</td>
              <td className="p-3">{job.frequency || "-"}</td>
              <td className="p-3 text-center">{job.bedrooms ?? 0}</td>
              <td className="p-3 text-center">{job.bathrooms ?? 0}</td>
              <td className="p-3 text-center">
                {formatDate(job.lastCleanDate)}
              </td>
              <td className="p-3 text-center">
                {formatDate(job.bookingDateTime)}
              </td>
              <td className="p-3 text-center">{job.bookingStatus || "-"}</td>
              <td className="p-3 text-center">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this job?")) {
                      onCancelJob(job);
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
