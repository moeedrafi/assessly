import { useFieldContext } from "@/hooks/form-context";

export const TextArea = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  const field = useFieldContext<string>();

  return (
    <div className="w-full flex flex-col gap-1">
      <label
        htmlFor={field.name}
        className="after:content-['*'] after:ml-1 after:text-red-500"
      >
        {label}
      </label>
      <textarea
        required
        id={field.name}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        aria-invalid={!field.state.meta.isValid}
        onChange={(e) => field.handleChange(e.target.value)}
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
