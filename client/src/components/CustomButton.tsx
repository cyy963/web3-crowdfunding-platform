// Define an interface for the component's props
interface CustomButtonProps {
  btnType: "button" | "submit" | "reset"; // restricts button type to specific string values
  title: string;
  handleClick: () => void; // specifies that handleClick should be a function that returns void
  styles?: string; // styles is optional
}

const CustomButton: React.FC<CustomButtonProps> = ({ btnType, title, handleClick, styles = '' }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
}

export default CustomButton;