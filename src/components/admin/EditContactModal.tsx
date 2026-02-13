import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Contact } from '@/services/contactApi';
import { contactApi } from '@/services/contactApi';

interface EditContactModalProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactUpdated: () => void;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

export function EditContactModal({
  contact,
  open,
  onOpenChange,
  onContactUpdated,
}: EditContactModalProps) {
  const [status, setStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setStatus(contact.status);
      setNotes(contact.notes || '');
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsLoading(true);
    try {
      await contactApi.updateContact(contact.id, {
        status,
        notes,
      });
      onContactUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update the status and notes for this contact
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Contact Info (Read-only) */}
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">{contact.name}</p>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
              <p className="text-sm text-muted-foreground">{contact.subject}</p>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add internal notes about this contact..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
