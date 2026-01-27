"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LabelWithTooltip, TooltipContent } from "./Tooltip";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  tooltipContent?: TooltipContent;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, tooltipContent, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <>
            {tooltipContent ? (
              <LabelWithTooltip
                label={label}
                tooltipContent={tooltipContent}
                required={props.required}
                htmlFor={props.id}
              />
            ) : (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
          </>
        )}
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
