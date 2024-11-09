interface PowerButtonProps {
  onClick: () => void;
}

const PowerButton = ({ onClick }: PowerButtonProps) => {

  return (
    <div className="w-full h-full flex items-center justify-center rounded-[100%] bg-red-500 cursor-pointer" onClick={onClick}>
    </div>
  );
}

export default PowerButton;