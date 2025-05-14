
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { FiPlusCircle, FiCalendar, FiClock, FiUser, FiCheck } from "react-icons/fi";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: string;
  description?: string;
}

interface LeadTasksProps {
  tasks: Task[];
  onAddTask: (task: any) => void;
}

const LeadTasks = ({ tasks, onAddTask }: LeadTasksProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("call");
  const [assignedTo, setAssignedTo] = useState("Subramanian Iyer");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setTaskTitle("");
    setTaskDate("");
    setTaskTime("");
    setTaskDescription("");
    setTaskType("call");
    setAssignedTo("Subramanian Iyer");
    setIsCompleted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() && taskDate) {
      onAddTask({
        title: taskTitle,
        dueDate: taskDate,
        time: taskTime,
        description: taskDescription,
        type: taskType,
        assignedTo: assignedTo,
        status: isCompleted ? "completed" : "pending",
      });
      resetForm();
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FiPlusCircle className="mr-2 h-4 w-4" />
              Add task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="completed"
                    checked={isCompleted}
                    onCheckedChange={(checked) => setIsCompleted(checked === true)}
                  />
                  <Label htmlFor="completed">Mark as completed</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="title" className="flex items-center">
                    Title <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter title of task"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Start typing the details about the task..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="taskType">Task type</Label>
                  <Select value={taskType} onValueChange={setTaskType}>
                    <SelectTrigger id="taskType">
                      <SelectValue placeholder="Select a task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate" className="flex items-center">
                      Due date <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="dueDate"
                        type="date"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        required
                      />
                      <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dueTime">Time</Label>
                    <div className="relative">
                      <Input
                        id="dueTime"
                        type="time"
                        value={taskTime}
                        onChange={(e) => setTaskTime(e.target.value)}
                      />
                      <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger id="owner" className="flex items-center">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Subramanian Iyer">Subramanian Iyer</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!taskTitle.trim() || !taskDate}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.status === "completed"}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUser className="h-3 w-3" />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCheck className="h-3 w-3" />
                        <span>{task.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Create a new task to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTasks;
