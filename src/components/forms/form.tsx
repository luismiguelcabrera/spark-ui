"use client";

import { type ComponentProps } from "react";
import { FormProvider } from "react-hook-form";
import type { FieldValues, UseFormReturn, SubmitHandler } from "react-hook-form";
import { cn } from "../../lib/utils";

type FormProps<T extends FieldValues> = Omit<ComponentProps<"form">, "onSubmit"> & {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
};

function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className={cn(className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export { Form };
export type { FormProps };
