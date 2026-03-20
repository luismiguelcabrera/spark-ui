/* eslint-disable @typescript-eslint/no-explicit-any -- resolver works with any schema library */

/**
 * Creates a form resolver from a Zod schema.
 * Zero-dependency — duck-types the Zod `safeParse` interface so no zod import needed.
 *
 * @example
 * ```tsx
 * import { z } from "zod";
 * import { useForm, zodResolver } from "spark-ui";
 *
 * const schema = z.object({
 *   email: z.string().email("Invalid email"),
 *   password: z.string().min(8, "Too short"),
 * });
 *
 * const form = useForm({
 *   initialValues: { email: "", password: "" },
 *   resolver: zodResolver(schema),
 * });
 * ```
 */
export function zodResolver<T extends Record<string, any>>(
  schema: {
    safeParse: (data: T) => { success: boolean; error?: { issues: Array<{ path: (string | number)[]; message: string }> } };
  },
): (values: T) => Partial<Record<keyof T, string>> {
  return (values: T) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Partial<Record<keyof T, string>> = {};
    for (const issue of result.error!.issues) {
      const path = issue.path.join(".") as keyof T;
      // First error per field wins
      if (!errors[path]) {
        errors[path] = issue.message;
      }
    }
    return errors;
  };
}

/**
 * Creates a form resolver from a Yup schema.
 * Zero-dependency — duck-types the Yup `validateSync` interface.
 *
 * @example
 * ```tsx
 * import * as yup from "yup";
 * import { useForm, yupResolver } from "spark-ui";
 *
 * const schema = yup.object({
 *   email: yup.string().email().required(),
 *   password: yup.string().min(8).required(),
 * });
 *
 * const form = useForm({
 *   initialValues: { email: "", password: "" },
 *   resolver: yupResolver(schema),
 * });
 * ```
 */
export function yupResolver<T extends Record<string, any>>(
  schema: {
    validateSync: (data: T, options?: any) => T;
  },
): (values: T) => Partial<Record<keyof T, string>> {
  return (values: T) => {
    try {
      schema.validateSync(values, { abortEarly: false });
      return {};
    } catch (err: any) {
      const errors: Partial<Record<keyof T, string>> = {};
      if (err?.inner && Array.isArray(err.inner)) {
        for (const e of err.inner) {
          const path = (e.path ?? "") as keyof T;
          if (path && !errors[path]) {
            errors[path] = e.message;
          }
        }
      }
      return errors;
    }
  };
}
