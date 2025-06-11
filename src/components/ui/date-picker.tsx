import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { FormControl } from "./form";

interface IDatePickerProps {
  value?: Date;
  onChange?: ( date: Date | undefined ) => void;
  disabled?: { before?: Date; after?: Date };
  placeholder?: string;
}

export function DatePicker({ value, onChange, disabled, placeholder = "Pick a date" }: IDatePickerProps ) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format( value, "P" ) : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}