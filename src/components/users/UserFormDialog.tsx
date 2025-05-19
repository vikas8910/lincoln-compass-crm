
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
  
  // Use different form schemas based on mode
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewUserFormValues | EditUserFormValues>({
    resolver: zodResolver(isAddMode ? newUserSchema : editUserSchema),
    defaultValues: isAddMode
      ? {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobile: "",
        }
      : user
      ? {
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
        }
      : {},
  });

  // Reset form when dialog opens/closes or user changes
  React.useEffect(() => {
    if (isOpen) {
      if (isAddMode) {
        reset({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobile: "",
        });
      } else if (user) {
        reset({
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
        });
      }
    }
  }, [isOpen, user, reset, isAddMode]);

  // Submit handler with loading state
  const onFormSubmit = async (data: NewUserFormValues | EditUserFormValues) => {
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
          <DialogTitle>{isAddMode ? "Add New User" : "Edit User"}</DialogTitle>
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

          {/* Only show password fields for adding new users */}
          {isAddMode && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && "password" in errors && (
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
                {errors.confirmPassword && "confirmPassword" in errors && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" {...register("mobile")} />
                {errors.mobile && "mobile" in errors && (
                  <p className="text-sm text-destructive">{errors.mobile.message}</p>
                )}
              </div>
            </>
          )}

          {/* ContactNumber field for edit mode */}
          {!isAddMode && (
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" {...register("contactNumber")} />
              {errors.contactNumber && "contactNumber" in errors && (
                <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isAddMode ? "Add User" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
