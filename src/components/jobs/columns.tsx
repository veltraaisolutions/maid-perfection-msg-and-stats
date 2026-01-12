"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/pages/Jobs";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Trash2,
  User,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import { formatDate } from "./JobsTable";

export const columns = (onCancelJob: (job: Job) => void): ColumnDef<Job>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Client Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "fullAddress",
    header: "Address",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.getValue("fullAddress")}
      >
        {row.getValue("fullAddress")}
      </div>
    ),
  },
  {
    accessorKey: "postcode",
    header: "Postcode",
  },
  {
    accessorKey: "serviceType",
    header: "Service",
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
  },
  {
    accessorKey: "bedrooms",
    header: () => <div className="text-center">Beds</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("bedrooms")}</div>
    ),
  },
  {
    accessorKey: "bathrooms",
    header: () => <div className="text-center">Baths</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("bathrooms")}</div>
    ),
  },
  {
    accessorKey: "bookingDateTime",
    header: "Booking Date/Time",
    cell: ({ row }) => (
      <div className="whitespace-nowrap font-medium text-blue-600">
        {formatDate(row.getValue("bookingDateTime"))}
      </div>
    ),
  },
  {
    accessorKey: "timeline",
    header: "Timeline",
  },
  {
    accessorKey: "requirements",
    header: "Special Requirements",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] italic text-muted-foreground truncate"
        title={row.getValue("requirements")}
      >
        {row.getValue("requirements") || "None"}
      </div>
    ),
  },
  {
    accessorKey: "lastCleanDate",
    header: "Last Clean",
  },
  {
    accessorKey: "cleanerName",
    header: "Assigned Cleaner",
    cell: ({ row }) => (
      <div className="font-bold text-[#f6ca15]">
        {row.getValue("cleanerName") || "UNASSIGNED"}
      </div>
    ),
  },
  {
    accessorKey: "cleanerPhone",
    header: "Cleaner Phone",
  },
  {
    accessorKey: "bookingStatus",
    header: "Status",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
        {row.getValue("bookingStatus")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Cancel</div>,
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onCancelJob(job)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
