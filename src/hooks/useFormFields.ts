import React from "react";

interface FormFieldsType {
  [key: string]: string | number;
}

function useFormFields(initialValues: FormFieldsType) {
  const [values, setFormFields] = React.useState<FormFieldsType>(initialValues);

  const handleChange = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  return { values, setFormFields, handleChange };
}

export default useFormFields;
