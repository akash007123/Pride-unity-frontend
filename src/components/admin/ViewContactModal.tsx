import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Contact } from '@/services/contactApi';
import { format } from 'date-fns';
import { Mail, Phone, MessageSquare, Calendar, FileText } from 'lucide-react';

interface ViewContactModalProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  read: 'secondary',
  replied: 'outline',
  archived: 'secondary',
};

export function ViewContactModal({ contact, open, onOpenChange }: ViewContactModalProps) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contact Details
          </DialogTitle>
          <DialogDescription>
            View contact message details
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge variant={statusVariants[contact.status] || 'secondary'}>
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <span className="text-sm font-medium text-muted-foreground">Name</span>
            <p className="text-sm">{contact.name}</p>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <span className="text-sm font-medium text-muted-foreground">Email</span>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                {contact.email}
              </a>
            </div>
          </div>

          {/* Mobile */}
          <div className="grid gap-2">
            <span className="text-sm font-medium text-muted-foreground">Mobile</span>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${contact.mobile}`} className="text-sm hover:underline">
                {contact.mobile}
              </a>
            </div>
          </div>

          {/* Subject */}
          <div className="grid gap-2">
            <span className="text-sm font-medium text-muted-foreground">Subject</span>
            <p className="text-sm font-medium">{contact.subject}</p>
          </div>

          {/* Message */}
          <div className="grid gap-2">
            <span className="text-sm font-medium text-muted-foreground">Message</span>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="grid gap-2">
              <span className="text-sm font-medium text-muted-foreground">Notes</span>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created: {format(new Date(contact.createdAt), 'PPP p')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Updated: {format(new Date(contact.updatedAt), 'PPP p')}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
