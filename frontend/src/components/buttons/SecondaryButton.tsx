import { FC, ComponentType } from "react";

interface SecondaryButtonProps {
  label: string;
  Icon?: ComponentType<{ className?: string }> | null;
}

const SecondaryButton: FC<SecondaryButtonProps> = ({ label, Icon }) => {
  return (
    <button className="flex justify-center items-center px-7 py-4 border shadow-md hover:shadow-lg text-md leading-none rounded-3xl border-yellow-500">
      {label}
      {Icon && <Icon className="inline-block ml-2" />}
    </button>
  );
};

export default SecondaryButton;