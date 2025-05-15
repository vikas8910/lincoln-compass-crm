
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, Plus, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface LeadTasksProps {
  leadId: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  assignedTo: string;
}

const LeadTasks: React.FC<LeadTasksProps> = ({ leadId }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up on pricing discussion',
      dueDate: '2023-06-05',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Jane Smith',
    },
    {
      id: '2',
      title: 'Send product documentation',
      dueDate: '2023-05-30',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'John Doe',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Jane Smith',
  });

  const handleAddTask = () => {
    if (!newTask.title) {
      toast.error('Task title is required');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      dueDate: newTask.dueDate!,
      priority: newTask.priority as 'high' | 'medium' | 'low',
      status: 'pending',
      assignedTo: newTask.assignedTo!,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Jane Smith',
    });
    setShowForm(false);
    toast.success('Task added successfully');
  };

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } 
        : task
    ));
    
    const updatedTask = tasks.find(task => task.id === id);
    if (updatedTask) {
      const newStatus = updatedTask.status === 'completed' ? 'pending' : 'completed';
      toast.success(`Task marked as ${newStatus}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tasks</h3>
        {!showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Task Title</label>
              <Input 
                placeholder="Enter task title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-[calc(33%-0.5rem)]">
                <label className="text-sm font-medium block mb-1">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(new Date(newTask.dueDate), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                      onSelect={(date) => setNewTask({...newTask, dueDate: date ? format(date, 'yyyy-MM-dd') : undefined})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="w-full sm:w-[calc(33%-0.5rem)]">
                <label className="text-sm font-medium block mb-1">Priority</label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({...newTask, priority: value as 'high' | 'medium' | 'low'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-[calc(33%-0.5rem)]">
                <label className="text-sm font-medium block mb-1">Assigned To</label>
                <Select 
                  value={newTask.assignedTo} 
                  onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Robert Johnson">Robert Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddTask}>
                Save Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No tasks created for this lead yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id} className={cn(task.status === 'completed' ? 'bg-muted/50' : '')}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.status === 'completed'}
                    onCheckedChange={() => handleToggleStatus(task.id)}
                    className="mt-1"
                  />
                  <div>
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={cn(
                        "font-medium text-sm cursor-pointer",
                        task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs">
                        {task.assignedTo}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadTasks;
