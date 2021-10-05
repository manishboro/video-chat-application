import clsx from "clsx";

import { FormControl, FormHelperText, OutlinedInput } from "@mui/material";

import { useStyles } from "./styles";

interface CustomTextFieldProps {
  id: string;
  type?: string;
  label: string;
  value: string;
  handleChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  handleblur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  endAdornment?: React.ReactNode | undefined;
  labelWidth: number;
  customHelperText?: string;
  errors?: boolean;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  type = "text",
  label,
  value,
  handleChange,
  handleblur,
  endAdornment = undefined,
  customHelperText = "",
  errors,
  touched,
  required = true,
  disabled = false,
  style = {},
  inputStyle = {},
}) => {
  const classes = useStyles();

  let helperText = errors && touched ? errors : customHelperText;

  return (
    <FormControl
      className={clsx(classes.textField)}
      variant="outlined"
      required={required}
      error={errors && touched ? true : false}
      style={{ ...style }}
    >
      <OutlinedInput
        id={id}
        type={type}
        value={value}
        name={id}
        onBlur={handleblur}
        onChange={handleChange}
        placeholder={label}
        disabled={disabled}
        endAdornment={endAdornment}
        className={classes.textField}
        style={{ ...inputStyle }}
      />

      {helperText && <FormHelperText className={classes.formHelperText}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomTextField;
