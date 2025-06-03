import EmptyState from "@/components/common/EmptyState";
import { TaskForm } from "@/components/common/TaskForm";
import { useState } from "react";
import { MdChecklist } from "react-icons/md";

export const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <EmptyState
        text="Add tasks from the CRM."
        icon={<MdChecklist size={48} className="text-blue-400" />}
        buttonText="Add Task"
        onClick={() => setIsOpen(true)}
      />
      <TaskForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
