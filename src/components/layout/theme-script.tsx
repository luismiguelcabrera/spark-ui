type ThemeScriptProps = {
  /** localStorage key for persisted theme. Default: "spark-ui-theme" */
  storageKey?: string;
  /** Fallback when no stored preference exists. Default: "system" */
  defaultTheme?: "light" | "dark" | "system";
  /** HTML attribute set on <html>. Default: "data-theme" */
  attribute?: string;
  /** CSP nonce for the inline script */
  nonce?: string;
};

/**
 * Renders a synchronous `<script>` that applies the stored or
 * system-preferred theme **before** React hydrates, preventing
 * flash-of-wrong-theme (FOWT).
 *
 * Place this component inside `<head>` (Next.js `<Head>`, Remix
 * `links`, or plain HTML).
 *
 * ```tsx
 * <head>
 *   <ThemeScript defaultTheme="system" />
 * </head>
 * ```
 */
function ThemeScript({
  storageKey = "spark-ui-theme",
  defaultTheme = "system",
  attribute = "data-theme",
  nonce,
}: ThemeScriptProps) {
  // The script body is a self-executing IIFE that runs synchronously.
  // It must be pure vanilla JS — no React, no imports.
  const script = `(function(){try{var d=document.documentElement,k="${storageKey}",a="${attribute}",s=localStorage.getItem(k)||"${defaultTheme}";if(s==="system"||s!=="light"&&s!=="dark"){s=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}d.setAttribute(a,s)}catch(e){}})()`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      nonce={nonce}
    />
  );
}

ThemeScript.displayName = "ThemeScript";

export { ThemeScript };
export type { ThemeScriptProps };
