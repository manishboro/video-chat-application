import { TextField } from "@mui/material";

import { useStyles } from "./styles";

interface CustomTextFieldProps {
  id: string;
  type?: string;
  label?: string;
  value: string | undefined;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleblur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  endAdornment?: React.ReactNode | undefined;
  labelWidth?: number;
  customHelperText?: string;
  errors?: boolean;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  customRef?: any;
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
  customRef,
  style = {},
  inputStyle = {},
}) => {
  const classes = useStyles();

  return (
    <TextField
      id={id}
      variant="outlined"
      type={type}
      value={value}
      label={label}
      error={errors && touched}
      helperText={errors && touched ? errors : customHelperText}
      onChange={handleChange}
      onBlur={handleblur}
      required={required}
      className={classes.textField}
      classes={{ root: classes.textField }}
      inputProps={{ ref: customRef }}
      disabled={disabled}
      style={{ ...style }}
    />
  );
};

export default CustomTextField;
