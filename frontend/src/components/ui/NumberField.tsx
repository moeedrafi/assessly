import { useFieldContext } from "@/hooks/form-context";

type NumberFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const NumberField = ({
  label,
  required,
  ...props
}: NumberFieldProps) => {
  const field = useFieldContext<number>();

  return (
    <div className="w-full flex flex-col gap-1">
      <label
        htmlFor={field.name}
        className={
          required ? "after:content-['*'] after:ml-1 after:text-red-500" : ""
        }
      >
        {label}
      </label>
      <input
        type="number"
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={!field.state.meta.isValid}
        onChange={(e) => field.handleChange(Number(e.target.value))}
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
