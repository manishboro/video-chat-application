// import clsx from "clsx";

// import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";

// import { useStyles } from "./styles";

// interface CustomTextFieldProps {
//   id: string;
//   type?: string;
//   label?: string;
//   placeholder: string;
//   value: string | undefined;
//   handleChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
//   handleblur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
//   endAdornment?: React.ReactNode | undefined;
//   labelWidth: number;
//   customHelperText?: string;
//   errors?: boolean;
//   touched?: boolean;
//   required?: boolean;
//   disabled?: boolean;
//   style?: React.CSSProperties;
//   inputStyle?: React.CSSProperties;
// }

// const CustomTextField: React.FC<CustomTextFieldProps> = ({
//   id,
//   type = "text",
//   label,
//   placeholder = "",
//   value,
//   handleChange,
//   handleblur,
//   endAdornment = undefined,
//   customHelperText = "",
//   errors,
//   touched,
//   required = true,
//   disabled = false,
//   style = {},
//   inputStyle = {},
// }) => {
//   const classes = useStyles();

//   let helperText = errors && touched ? errors : customHelperText;

//   return (
//     <FormControl
//       className={clsx(classes.textField)}
//       variant="outlined"
//       required={required}
//       error={errors && touched ? true : false}
//       style={{ ...style }}
//     >
//       {label && (
//         <InputLabel htmlFor={id} className={classes.formLabel}>
//           {label}
//         </InputLabel>
//       )}

//       <OutlinedInput
//         id={id}
//         type={type}
//         value={value}
//         name={id}
//         onBlur={handleblur}
//         onChange={handleChange}
//         placeholder={placeholder}
//         disabled={disabled}
//         endAdornment={endAdornment}
//         className={classes.textField}
//         style={{ ...inputStyle }}
//       />

//       {helperText && <FormHelperText className={classes.formHelperText}>{helperText}</FormHelperText>}
//     </FormControl>
//   );
// };

// export default CustomTextField;

import { TextField } from "@mui/material";

import { useStyles } from "./styles";

interface CustomTextFieldProps {
  id: string;
  type?: string;
  label?: string;
  value: string | undefined;
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
      required={required}
      className={classes.textField}
      classes={{ root: classes.textField }}
      inputProps={{ /* style: { fontSize: "1.7rem", padding: "1.5rem", ...inputStyle },*/ ref: customRef }}
      // InputLabelProps={{ style: { fontSize: "1.7rem" } }}
      disabled={disabled}
      style={{ ...style }}
    />
  );
};

export default CustomTextField;
