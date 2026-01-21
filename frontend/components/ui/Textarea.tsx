import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LabelWithTooltip, TooltipContent } from "./Tooltip";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  tooltipContent?: TooltipContent;
}

export function Textarea({ label, error, className, tooltipContent, ...props }: TextareaProps) {
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
            </label>
          )}
        </>
      )}
      <textarea
        className={cn(
          "input",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
