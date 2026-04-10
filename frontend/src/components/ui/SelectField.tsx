import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";

type SelectFieldOption = {
  value: string | number;
  label: string | React.ReactNode;
};

type SelectFieldProps = {
  label: string;
  required?: boolean;
  options: SelectFieldOption[];
  placeholder?: string;
};

export const SelectField = ({
  label,
  required,
  options,
  placeholder,
}: SelectFieldProps) => {
  const field = useFieldContext<string | number>();
  const isSubmitting = useStore(field.form.store, (s) => s.isSubmitting);

  return (
    <div className="w-full flex flex-col gap-1">
      <label
        htmlFor={field.name}
        className={`font-semibold text-sm text-muted-foreground ${
          required ? "after:content-['*'] after:ml-1 after:text-red-500" : ""
        }`}
      >
        {label}
      </label>

      <select
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        disabled={isSubmitting}
        onChange={(e) => {
          const value = e.target.value;
          field.handleChange(isNaN(Number(value)) ? value : Number(value));
        }}
        className="bg-light px-3 py-2.5 ring-1 ring-color rounded-lg focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {field.state.meta.isTouched && !field.state.meta.isValid && (
        <em role="alert" className="text-sm text-red-500">
          {field.state.meta.errors.map((err) => err?.message).join(", ")}
        </em>
      )}
    </div>
  );
};
