/**
 * @fileoverview Reusable Form components built with React Hook Form and Zod for type-safe forms.
 * @description This file exports various components for building forms (Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage)
 *   that integrate seamlessly with `react-hook-form` and `zod` for validation. It's based on the Shadcn UI form pattern.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a consistent and accessible foundation for all forms in the application.
 *   - To simplify form creation by abstracting away boilerplate related to React Hook Form context.
 *   - To ensure proper error display and accessibility for form fields.
 *
 * FILEPATH: `app/components/ui/form.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `react-hook-form`: Core dependency for form state management and validation.
 *   - `@hookform/resolvers/zod`: Used to integrate Zod schemas with React Hook Form.
 *   - `zod`: For defining robust schema validations for form inputs.
 *   - `react`: For creating React components and hooks.
 *   - `class-variance-authority (cn)`: For conditional styling.
 *   - `lucide-react`: For icons (e.g., Loader2 for loading states).
 *   - `app/(orion_admin)/admin/profile/page.tsx`: Consumes these form components for the user profile editing UI.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `react-hook-form` and `zod` are installed and correctly configured in the project.
 *   - Assumes proper CSS utilities (like Tailwind CSS classes for Shadcn) are available for styling.
 *
 * NOTES:
 *   - This file is a foundational UI component for enabling data input throughout the Orion application.
 *   - The `Form` component uses React Context to pass down form state implicitly to child components.
 *   - The error `Cannot find module '@/components/ui/form'` indicates that this file either did not exist or was not correctly placed/processed by the build system.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Custom Input Types**: Extend the `FormControl` to support more complex input types (e.g., file uploads, date pickers) by providing render props or specific sub-components.
 *   - **Accessibility Enhancements**: Further refine ARIA attributes and keyboard navigation support.
 *   - **Performance**: For very large forms, consider optimizing re-renders with `memo` or `useCallback` where appropriate, though React Hook Form is already highly optimized.
 */
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof Label>) {
  const { error, formItemId } = useFormItem();

  return <Label className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />;
}

function FormControl({ ...props }: React.ComponentPropsWithoutRef<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormItem();

  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormItem();

  return <p id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />;
}

function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormItem();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p id={formMessageId} className={cn('text-[0.8rem] font-medium text-destructive', className)} {...props}>
      {body}
    </p>
  );
}

type FieldPath<TFieldValues extends FieldValues> = string; // Simplified for this context
type FieldValues = Record<string, any>; // Simplified for this context
type ControllerProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = any; // Simplified for this context

function useFormItem() {
  const { name } = React.useContext(FormFieldContext);
  const id = React.useContext(FormItemContext);

  const { formState, getFieldState } = useFormContext();

  const fieldState = getFieldState(name, formState);

  const formItemId = id?.id;
  const formDescriptionId = `${formItemId}-form-item-description`;
  const formMessageId = `${formItemId}-form-item-message`;

  return {
    id,
    name,
    formItemId,
    formDescriptionId,
    formMessageId,
    ...fieldState,
  };
}

export { useFormContext, Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
