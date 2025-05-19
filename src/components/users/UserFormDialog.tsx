
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserResponse } from "@/types";
import { newUserSchema, editUserSchema, NewUserFormValues, EditUserFormValues } from "@/schemas/user-schemas";

type UserFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewUserFormValues | EditUserFormValues) => Promise<void>;
  user?: UserResponse | null;
  type: 'add' | 'edit';
};

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  type,
}) => {
  // Determine if we're adding or editing a user
  const isAddMode = type === 'add';
  
  // Use different form schemas and types based on mode
  if (isAddMode) {
    // Form for adding a new user
    return <AddUserForm isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />;
  } else {
    // Form for editing an existing user
    return <EditUserForm isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} user={user} />;
  }
};

// Component for adding a new user
const AddUserForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewUserFormValues) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
    },
  });

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
      });
    }
  }, [isOpen, reset]);

  // Submit handler with loading state
  const onFormSubmit = async (data: NewUserFormValues) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error is handled by the parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" {...register("mobile")} />
            {errors.mobile && (
              <p className="text-sm text-destructive">{errors.mobile.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component for editing an existing user
const EditUserForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditUserFormValues) => Promise<void>;
  user?: UserResponse | null;
}> = ({ isOpen, onClose, onSubmit, user }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    // Important: Using empty defaults initially
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
    },
  });

  // Reset form with user data when dialog opens or user changes
  React.useEffect(() => {
    if (isOpen && user) {
      // This properly sets the form values from the user data
      reset({
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      });
    }
  }, [isOpen, user, reset]);

  // Submit handler with loading state
  const onFormSubmit = async (data: EditUserFormValues) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error is handled by the parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input id="contactNumber" {...register("contactNumber")} />
            {errors.contactNumber && (
              <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
