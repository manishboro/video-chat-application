import { Link } from "react-router-dom";
import clsx from "clsx";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useStyles } from "./styles";

interface CustomButtonProps {
  text: string;
  href?: string;
  className?: string;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined;
  type?: "submit" | "button" | undefined;
  IconDirection?: "right" | "left";
  loading?: boolean;
  Icon?: any;
  enableIcon?: boolean;
  style?: React.CSSProperties;
  fn?: any;
}

const GetIcon = ({ Icon }: { Icon: any }) => {
  const classes = useStyles();

  return (
    <>
      {Icon && typeof Icon === "object" && <Icon className={classes.icon} />}
      {Icon && typeof Icon === "function" && Icon()}
    </>
  );
};

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  href,
  className,
  variant = "contained",
  color = "primary",
  type = "button",
  Icon,
  enableIcon = true,
  IconDirection = "right",
  loading = false,
  fn = () => null,
  style,
}) => {
  const classes = useStyles();

  return (
    <Button
      variant={variant}
      color={color}
      type={type}
      className={clsx(classes.root, className)}
      // classes={{ label: classes.label }}
      onClick={() => (fn ? fn() : null)}
      disabled={loading}
      style={{ ...style }}
    >
      {!loading ? (
        href ? (
          <Link to={href}>
            <div className={classes.button}>
              {IconDirection === "right" && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {text}{" "}
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {Icon && enableIcon ? <GetIcon Icon={Icon} /> : <NavigateNextIcon className={classes.icon} />}
                  </span>
                </div>
              )}

              {IconDirection === "left" && (
                <div>
                  {Icon && enableIcon ? <GetIcon Icon={Icon} /> : <NavigateNextIcon className={classes.icon} />} {text}
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className={classes.button}>
            {text} {Icon && enableIcon ? <GetIcon Icon={Icon} /> : <NavigateNextIcon className={classes.icon} />}
          </div>
        )
      ) : (
        <div className={classes.button}>
          <CircularProgress color="secondary" style={{ height: "30px", width: "30px", margin: "auto" }} />
        </div>
      )}
    </Button>
  );
};

export default CustomButton;
