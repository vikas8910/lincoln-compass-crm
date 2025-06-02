import React from "react";
import { Button } from "../ui/button";

type EmptyStateProps = {
  text: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  text,
  icon,
  buttonText,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
      <div className="mb-4">{icon}</div>
      <p className="mb-4 max-w-md text-sm">{text}</p>
      <Button onClick={onClick}>{buttonText}</Button>
    </div>
  );
};

export default EmptyState;
