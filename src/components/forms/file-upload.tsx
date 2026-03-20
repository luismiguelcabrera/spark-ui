import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { ProgressBar } from "../data-display/progress-bar";

type FileUploadZoneProps = HTMLAttributes<HTMLDivElement> & {
  accept?: string;
};

const FileUploadZone = forwardRef<HTMLDivElement, FileUploadZoneProps>(
  ({ accept, className, role = "button", tabIndex = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={role}
        tabIndex={tabIndex}
        aria-label={props["aria-label"] ?? "Upload files"}
        className={cn(
          s.uploadZone,
          "px-6 py-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none transition-colors duration-150",
          className
        )}
        {...props}
      >
        <div className={cn(s.iconBox, "w-12 h-12 rounded-xl bg-muted mb-3")}>
          <Icon name="cloud_upload" size="lg" className="text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-secondary">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {accept ?? "PNG, JPG, PDF up to 10MB"}
        </p>
      </div>
    );
  }
);
FileUploadZone.displayName = "FileUploadZone";

type FileItem = {
  name: string;
  size: string;
  progress?: number;
  icon?: string;
  status?: "uploading" | "complete" | "error";
};

type FileUploadItemProps = HTMLAttributes<HTMLDivElement> & {
  file: FileItem;
};

const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  ({ file, className, ...props }, ref) => {
    const statusIcon =
      file.status === "complete"
        ? "check_circle"
        : file.status === "error"
          ? "error"
          : undefined;

    return (
      <div ref={ref} className={cn(s.uploadItem, className)} {...props}>
        <div className={s.uploadItemIcon}>
          <Icon name={file.icon ?? "description"} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-secondary truncate">
              {file.name}
            </p>
            {statusIcon && (
              <Icon
                name={statusIcon}
                size="sm"
                className={cn(
                  file.status === "complete" ? "text-success" : "text-destructive"
                )}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{file.size}</p>
          {file.progress !== undefined && file.status === "uploading" && (
            <ProgressBar value={file.progress} size="sm" className="mt-2" />
          )}
        </div>
      </div>
    );
  }
);
FileUploadItem.displayName = "FileUploadItem";

export { FileUploadZone, FileUploadItem };
export type { FileUploadZoneProps, FileUploadItemProps, FileItem };
