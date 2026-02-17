import React from 'react';
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
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  item?: {
    name?: string;
    email?: string;
    title?: string;
    subject?: string;
    [key: string]: string | undefined;
  };
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteModal({
  open,
  onOpenChange,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  item,
  onConfirm,
  isPending = false,
}: DeleteModalProps) {
  // Get display values from item
  const getDisplayValues = () => {
    if (!item) return null;
    
    const values = Object.values(item).filter(v => v);
    if (values.length === 0) return null;
    
    return values;
  };

  const displayValues = getDisplayValues();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {displayValues && (
          <div className="rounded-md bg-muted p-3">
            {displayValues.map((value, index) => (
              <p key={index} className={index === 0 ? "font-medium" : "text-sm text-muted-foreground"}>
                {value}
              </p>
            ))}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteModal;
