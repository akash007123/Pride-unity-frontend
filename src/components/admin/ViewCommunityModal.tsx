import { CommunityMember } from '@/services/communityApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, BookOpen, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ViewCommunityModalProps {
  member: CommunityMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  approved: 'secondary',
  rejected: 'destructive',
  archived: 'outline',
};

export function ViewCommunityModal({ member, open, onOpenChange }: ViewCommunityModalProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Community Member Details
          </DialogTitle>
          <DialogDescription>
            View registration details for {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant={statusVariants[member.status] || 'default'} className="text-sm px-3 py-1">
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Name:</span>
              <span className="font-medium">{member.name}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Email:</span>
              <span className="font-medium">{member.email}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Mobile:</span>
              <span className="font-medium">{member.mobile}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Education:</span>
              <span className="font-medium">{member.education}</span>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Registered:</span>
              <span className="font-medium">
                {format(new Date(member.createdAt), 'PPP p')}
              </span>
            </div>

            {member.notes && (
              <div className="flex items-start gap-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground w-24">Notes:</span>
                <span className="font-medium">{member.notes}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
