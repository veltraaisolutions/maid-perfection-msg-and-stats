"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/pages/Jobs";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpDown } from "lucide-react";
import { formatDate } from "./JobsTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// List of your cleaners
const CLEANERS = ["bob doe", "Jane Smith", "John Wilson", "Alice May"];

export const columns = (
  onCancelJob: (job: Job) => void,
  onUpdateSuccess: () => void
): ColumnDef<Job>[] => [
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
  // {
  //   accessorKey: "email",
  //   header: "Email",
  // },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "fullAddress",
    header: "Address",
  },
  {
    accessorKey: "postcode",
    header: "Postcode",
  },
  {
    accessorKey: "serviceType",
    header: "Service",
  },
  // {
  //   accessorKey: "frequency",
  //   header: "Frequency",
  // },
  // {
  //   accessorKey: "bedrooms",
  //   header: "Beds",
  // },
  // {
  //   accessorKey: "bathrooms",
  //   header: "Baths",
  // },
  {
    accessorKey: "bookingDateTime",
    header: "Booking Date/Time",
    cell: ({ row }) => formatDate(row.getValue("bookingDateTime")),
  },
  // {
  //   accessorKey: "timeline",
  //   header: "Timeline",
  // },
  // {
  //   accessorKey: "requirements",
  //   header: "Requirements",
  // },
  // {
  //   accessorKey: "lastCleanDate",
  //   header: "Last Clean",
  // },
  {
    accessorKey: "cleanerName",
    header: "Cleaner Name",
    cell: ({ row }) => {
      const job = row.original;

      const handleAssign = async (newName: string) => {
        const { error } = await supabase
          .from("maid_to_perfection_leads")
          .update({ cleaner_name: newName })
          .eq("id", job.id);

        if (error) {
          toast.error("Failed to assign cleaner");
        } else {
          toast.success(`Assigned ${newName} successfully!`);
          onUpdateSuccess();
        }
      };

      return (
        <Select
          defaultValue={job.cleanerName || ""}
          onValueChange={handleAssign}
        >
          <SelectTrigger className="w-[180px] h-8 border-[#f6ca15]/50 focus:ring-[#f6ca15] bg-background">
            <SelectValue placeholder="Select Cleaner" />
          </SelectTrigger>
          <SelectContent>
            {CLEANERS.map((name) => (
              <SelectItem
                key={name}
                value={name}
              >
                {name}
              </SelectItem>
            ))}
            <SelectItem
              value="Unassigned"
              className="text-muted-foreground"
            >
              None
            </SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "cleanerPhone",
    header: "Cleaner Phone",
  },
  {
    accessorKey: "bookingStatus",
    header: "Status",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Cancel</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onCancelJob(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
