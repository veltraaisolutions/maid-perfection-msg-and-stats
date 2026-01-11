import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle, MapPin, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Job {
  id: string;
  client_name: string;
  address: string;
  access_code?: string;
  start_time: string;
  end_time?: string;
  status: string;
  cleaner_confirmed: boolean;
  cleaners?: {
    name: string;
    color_code: string;
  };
}

interface WeeklyCalendarProps {
  jobs: Job[];
}

const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

export function WeeklyCalendar({ jobs }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: number) => {
    setCurrentDate(addDays(currentDate, direction * 7));
  };

  const getJobsForDay = (day: Date) => {
    return jobs.filter((job) => {
      const jobDate = new Date(job.start_time);
      return isSameDay(jobDate, day);
    });
  };

  const getJobPosition = (job: Job) => {
    const startTime = new Date(job.start_time);
    const hour = startTime.getHours();
    const minutes = startTime.getMinutes();
    const top = ((hour - 7) * 60 + minutes) * (60 / 60); // pixels per hour
    return { top: `${top}px` };
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateWeek(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-semibold text-foreground">
          {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateWeek(1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-3 text-center text-xs text-muted-foreground"></div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-3 text-center border-l border-border ${
                  isSameDay(day, new Date()) ? "bg-primary/5" : ""
                }`}
              >
                <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
                <p className={`text-lg font-semibold ${
                  isSameDay(day, new Date()) ? "text-primary" : "text-foreground"
                }`}>
                  {format(day, "d")}
                </p>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 h-[60px] border-b border-border/50">
                <div className="p-2 text-xs text-muted-foreground text-right pr-4 pt-0">
                  {format(new Date().setHours(hour, 0), "h a")}
                </div>
                {weekDays.map((day) => (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="relative border-l border-border/30"
                  />
                ))}
              </div>
            ))}

            {/* Job Blocks */}
            {weekDays.map((day, dayIndex) => {
              const dayJobs = getJobsForDay(day);
              return dayJobs.map((job) => {
                const position = getJobPosition(job);
                return (
                  <Tooltip key={job.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          absolute left-0 right-0 mx-1 p-2 rounded-lg cursor-pointer
                          transition-all duration-200 hover:scale-[1.02] hover:z-10
                        `}
                        style={{
                          top: position.top,
                          left: `calc(${12.5 * (dayIndex + 1)}% + 4px)`,
                          width: "calc(12.5% - 8px)",
                          height: "50px",
                          backgroundColor: job.cleaners?.color_code 
                            ? `${job.cleaners.color_code}30`
                            : "hsl(var(--muted))",
                          borderLeft: `3px solid ${job.cleaners?.color_code || "hsl(var(--muted-foreground))"}`,
                        }}
                      >
                        <p className="text-xs font-medium text-foreground truncate">
                          {job.client_name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-xs text-muted-foreground truncate flex-1">
                            {job.cleaners?.name || "Unassigned"}
                          </p>
                          {job.cleaner_confirmed && (
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="max-w-[250px] p-3 bg-popover border-border"
                    >
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">{job.client_name}</p>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{job.address}</span>
                        </div>
                        {job.access_code && (
                          <div className="flex items-center gap-2 text-sm">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground font-mono">{job.access_code}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {job.cleaner_confirmed ? (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Confirmed
                            </span>
                          ) : (
                            <span className="text-xs text-yellow-400">Awaiting Confirmation</span>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
