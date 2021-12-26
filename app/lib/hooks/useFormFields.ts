import { useState } from "react";
import type { ChangeEvent } from "react";

export const useFormFields = <T>(initialValues: T) => {
  const [formFields, setFormFields] = useState<T>(initialValues);

  const formChangeHandler =
    (key: keyof T) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormFields((prev: T) => ({ ...prev, [key]: value }));
    };

  return { formFields, setFormFields, formChangeHandler };
};
