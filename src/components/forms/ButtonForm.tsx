import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type ButtonFormProps = {
  label: string;
  type?: "button" | "reset" | "submit" | undefined;
  beforeIcon?: IconDefinition;
  afterIcon?: IconDefinition;
  onClick?: () => void;
  variant?: "text" | "contained" | "outlined";
  size?: "small" | "medium" | "large";
  className?: string;
};

const ButtonForm: React.FC<ButtonFormProps> = (props: ButtonFormProps) => {
  const {
    label,
    type,
    beforeIcon,
    afterIcon,
    onClick,
    variant = "text",
    size = "medium",
    className = "",
  } = props;

  const baseClasses = "font-semibold rounded transition duration-300";
  const variantClasses: Record<string, string> = {
    text: "text-blue-500 hover:bg-blue-100",
    contained: "bg-blue-500 text-white hover:bg-blue-600",
    outlined:
      "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  };

  const sizeClasses: Record<string, string> = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    
      <button type={type} className={classes}>
        {beforeIcon && <FontAwesomeIcon icon={beforeIcon} className="mr-2" />}
        {label}
        {afterIcon && <FontAwesomeIcon icon={afterIcon} className="ml-2" />}
      </button>
    
  );
};

export default ButtonForm;
