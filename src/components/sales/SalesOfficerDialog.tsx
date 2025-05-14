
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { SalesOfficer } from "@/pages/dashboard/SalesOfficers";

interface SalesOfficerDialogProps {
  officer: SalesOfficer | null;
  open: boolean;
  onClose: () => void;
  onSave: (officer: SalesOfficer) => void;
}

const SalesOfficerDialog: React.FC<SalesOfficerDialogProps> = ({
  officer,
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SalesOfficer>({
    id: "",
    name: "",
    email: "",
    phone: "",
    status: "active",
    dateJoined: new Date().toISOString().split("T")[0],
    performance: "good",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (officer) {
      setFormData(officer);
    } else {
      // Reset form for a new officer
      setFormData({
        id: Date.now().toString(), // Generate a temporary ID
        name: "",
        email: "",
        phone: "",
        status: "active",
        dateJoined: new Date().toISOString().split("T")[0],
        performance: "good",
      });
    }
    setErrors({});
  }, [officer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        onSave(formData);
        toast.success(`${officer ? "Updated" : "Created"} sales officer successfully`);
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Error saving sales officer:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{officer ? "Edit" : "Add"} Sales Officer</DialogTitle>
          <DialogDescription>
            {officer 
              ? "Update the sales officer's information below." 
              : "Fill out the form below to add a new sales officer."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateJoined">Date Joined</Label>
              <Input
                id="dateJoined"
                name="dateJoined"
                type="date"
                value={formData.dateJoined}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="performance">Performance</Label>
              <Select
                value={formData.performance}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  performance: value as "excellent" | "good" | "average" | "poor" 
                })}
              >
                <SelectTrigger id="performance">
                  <SelectValue placeholder="Select performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{officer ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesOfficerDialog;
