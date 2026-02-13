import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Contact } from '@/services/contactApi';
import { contactApi } from '@/services/contactApi';
import { Trash2 } from 'lucide-react';

interface DeleteContactModalProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactDeleted: () => void;
}

export function DeleteContactModal({
  contact,
  open,
  onOpenChange,
  onContactDeleted,
}: DeleteContactModalProps) {
  const handleDelete = async () => {
    if (!contact) return;

    try {
      await contactApi.deleteContact(contact.id);
      onContactDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  if (!contact) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Contact
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this contact from {contact.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-medium">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.email}</p>
          <p className="text-sm text-muted-foreground truncate">{contact.subject}</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
