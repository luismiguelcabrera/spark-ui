import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { ProgressBar } from "../data-display/progress-bar";

type FileUploadZoneProps = {
  accept?: string;
  className?: string;
};

function FileUploadZone({ accept, className }: FileUploadZoneProps) {
  return (
    <div className={cn(s.uploadZone, "px-6 py-10", className)}>
      <div className={cn(s.iconBox, "w-12 h-12 rounded-xl bg-slate-100 mb-3")}>
        <Icon name="cloud_upload" size="lg" className="text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-secondary">
        Drop files here or click to upload
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {accept ?? "PNG, JPG, PDF up to 10MB"}
      </p>
    </div>
  );
}

type FileItem = {
  name: string;
  size: string;
  progress?: number;
  icon?: string;
  status?: "uploading" | "complete" | "error";
};

type FileUploadItemProps = {
  file: FileItem;
  className?: string;
};

function FileUploadItem({ file, className }: FileUploadItemProps) {
  const statusIcon =
    file.status === "complete"
      ? "check_circle"
      : file.status === "error"
        ? "error"
        : undefined;

  return (
    <div className={cn(s.uploadItem, className)}>
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
                file.status === "complete" ? "text-green-500" : "text-red-500"
              )}
            />
          )}
        </div>
        <p className="text-xs text-slate-400">{file.size}</p>
        {file.progress !== undefined && file.status === "uploading" && (
          <ProgressBar value={file.progress} size="sm" className="mt-2" />
        )}
      </div>
    </div>
  );
}

export { FileUploadZone, FileUploadItem };
export type { FileUploadZoneProps, FileUploadItemProps, FileItem };
