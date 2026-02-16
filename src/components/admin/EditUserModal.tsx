import React from 'react';
import { Admin } from '@/services/authApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Admin | null;
  form: {
    name: string;
    mobile: string;
    role: string;
    status: string;
    profilePic: string;
    newPassword: string;
  };
  onFormChange: (form: EditUserModalProps['form']) => void;
  profilePicFile: File | null;
  onProfilePicChange: (file: File | null) => void;
  isProcessing: boolean;
  onSave: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onOpenChange,
  user,
  form,
  onFormChange,
  profilePicFile,
  onProfilePicChange,
  isProcessing,
  onSave,
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the details of the selected admin user
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-mobile">Mobile</Label>
              <Input
                id="edit-mobile"
                value={form.mobile}
                onChange={(e) => onFormChange({ ...form, mobile: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-profilePic">Profile Picture</Label>
              <Input
                id="edit-profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onProfilePicChange(file);
                }}
              />
              {user.profilePic && !profilePicFile && (
                <p className="text-xs text-muted-foreground truncate">
                  Current: {user.profilePic}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) => onFormChange({ ...form, role: value })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sub Admin">Sub Admin</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => onFormChange({ ...form, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-password">New Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={form.newPassword}
                onChange={(e) => onFormChange({ ...form, newPassword: e.target.value })}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isProcessing}>
            {isProcessing ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;