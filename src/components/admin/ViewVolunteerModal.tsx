import { Volunteer } from '@/services/volunteerApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, FileText, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface ViewVolunteerModalProps {
  volunteer: Volunteer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  contacted: 'secondary',
  approved: 'secondary',
  rejected: 'destructive',
  archived: 'outline',
};

const roleLabels: Record<string, string> = {
  events: 'Event Planning',
  outreach: 'Community Outreach',
  tech: 'Technical Support',
  creative: 'Creative & Design',
};

export function ViewVolunteerModal({ volunteer, open, onOpenChange }: ViewVolunteerModalProps) {
  if (!volunteer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Volunteer Details
          </DialogTitle>
          <DialogDescription>
            View registration details for {volunteer.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant={statusVariants[volunteer.status] || 'default'} className="text-sm px-3 py-1">
              {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Name:</span>
              <span className="font-medium">{volunteer.fullName}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Email:</span>
              <span className="font-medium">{volunteer.email}</span>
            </div>

            {volunteer.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-24">Phone:</span>
                <span className="font-medium">{volunteer.phone}</span>
              </div>
            )}

            {volunteer.availability && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-24">Availability:</span>
                <span className="font-medium">{volunteer.availability}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Roles */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Volunteer Roles</h4>
            <div className="flex flex-wrap gap-2">
              {volunteer.roles.map((role) => (
                <Badge key={role} variant="outline" className="text-sm">
                  {roleLabels[role] || role}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          {volunteer.skills && volunteer.skills.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Skills & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Message */}
          {volunteer.message && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
                <p className="text-sm bg-muted rounded-lg p-3">{volunteer.message}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Dates */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground w-24">Applied:</span>
              <span className="font-medium">
                {format(new Date(volunteer.createdAt), 'PPP p')}
              </span>
            </div>

            {volunteer.notes && (
              <div className="flex items-start gap-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground w-24">Notes:</span>
                <span className="font-medium">{volunteer.notes}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
