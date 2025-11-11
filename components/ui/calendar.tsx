"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type Formatters } from "react-day-picker"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onClearSelection?: () => void
}

function Calendar({ className, classNames, showOutsideDays = true, onClearSelection, ...props }: CalendarProps) {
  const formatters: Partial<Formatters> = {
    formatWeekdayName: (weekday) => {
      return weekday.toLocaleDateString('es-ES', { weekday: 'narrow' })
    },
  }

  return (
    <div className="flex flex-col">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        locale={es}
        weekStartsOn={1}
        formatters={formatters}
        classNames={{
          months: "flex flex-row space-x-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium capitalize",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          button_previous: "absolute left-1",
          button_next: "absolute right-1",
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex",
          weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          week: "flex w-full mt-2",
          day_button: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal rounded-md"
          ),
          day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          range_start: "day-range-start !bg-primary !text-primary-foreground rounded-l-md",
          range_end: "day-range-end !bg-primary !text-primary-foreground rounded-r-md",
          selected:
            "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground font-bold",
          today: "bg-accent text-accent-foreground font-semibold border-2 border-primary",
          outside:
            "day-outside text-muted-foreground/50 opacity-50",
          disabled: "text-muted-foreground opacity-50 line-through",
          range_middle: 
            "aria-selected:bg-primary/20 aria-selected:text-primary rounded-none",
          hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
      {onClearSelection && (
        <div className="flex justify-center px-3 pb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="w-full"
          >
            Limpiar selección
          </Button>
        </div>
      )}
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
