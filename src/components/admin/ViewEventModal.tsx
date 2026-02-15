import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, DollarSign, Tag, Star, ExternalLink, Ticket } from 'lucide-react';
import { Event } from '@/services/eventApi';
import { useNavigate } from 'react-router-dom';

interface ViewEventModalProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  published: 'default',
  cancelled: 'destructive',
  completed: 'secondary',
};

export function ViewEventModal({ event, open, onOpenChange }: ViewEventModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            Event Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariants[event.status] || 'outline'}>
              {event.status}
            </Badge>
            {event.featured && (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                <Star className="h-3 w-3 mr-1" /> Featured
              </Badge>
            )}
            {event.isSoldOut && (
              <Badge variant="destructive">Sold Out</Badge>
            )}
            {event.isFree && (
              <Badge className="bg-green-500">Free</Badge>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" /> {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{event.date}</p>
                {event.endDate && (
                  <p className="text-xs text-muted-foreground">to {event.endDate}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{event.time}</p>
                {event.endTime && (
                  <p className="text-xs text-muted-foreground">to {event.endTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{event.location}</p>
              {event.isOnline && <Badge variant="outline" className="mt-1">Online Event</Badge>}
            </div>
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">{event.isFree ? 'Free' : `₹${event.price}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">
                  {event.currentAttendees}
                  {event.maxAttendees ? ` / ${event.maxAttendees}` : ' (Unlimited)'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground text-sm">{event.description}</p>
          </div>

          {/* Full Description */}
          {event.fullDescription && (
            <div>
              <h4 className="font-medium mb-2">Full Details</h4>
              <div 
                className="text-muted-foreground text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: event.fullDescription }}
              />
            </div>
          )}

          {/* Schedule */}
          {event.schedule && event.schedule.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Schedule</h4>
              <div className="space-y-2">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex gap-3 p-2 rounded bg-muted/50">
                    <span className="font-medium text-primary text-sm w-20">{item.time}</span>
                    <span className="text-sm">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer */}
          <div className="p-3 rounded-lg bg-muted">
            <h4 className="font-medium mb-2">Organizer</h4>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/20 text-primary">
                  {event.organizer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{event.organizer.name}</p>
                {event.organizer.email && (
                  <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(`/events/${event.slug || event.id}`)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Button>
            <Button 
              className="flex-1 btn-pride"
              onClick={() => {
                onOpenChange(false);
                navigate(`/admin/events/${event.id}/registrations`);
              }}
            >
              <Ticket className="h-4 w-4 mr-2" />
              View Registrations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
