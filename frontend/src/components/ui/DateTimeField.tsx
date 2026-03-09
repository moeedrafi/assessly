import { useFieldContext } from "@/hooks/form-context";

type DateTimeFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const DateTimeField = ({
  label,
  required,
  ...props
}: DateTimeFieldProps) => {
  const field = useFieldContext<string>();

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
      <input
        id={field.name}
        name={field.name}
        type="datetime-local"
        value={field.state.value}
        aria-invalid={!field.state.meta.isValid}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
      />
      {field.state.meta.isTouched && !field.state.meta.isValid && (
        <em role="alert" className="text-sm text-red-500">
          {field.state.meta.errors.map((err) => err?.message).join(", ")}
        </em>
      )}
    </div>
  );
};
