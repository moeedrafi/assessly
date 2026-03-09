import { TextArea } from "@/components/ui/TextArea";
import { createFormHook } from "@tanstack/react-form";
import { TextField } from "@/components/ui/TextField";
import { NumberField } from "@/components/ui/NumberField";
import { SelectField } from "@/components/ui/SelectField";
import { fieldContext, formContext } from "./form-context";
import { DateTimeField } from "@/components/ui/DateTimeField";
import { SubscribeButton } from "@/components/ui/SubscribeButton";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    TextArea,
    DateTimeField,
    SelectField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
