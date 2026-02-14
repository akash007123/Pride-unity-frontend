import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Volunteer, volunteerApi } from '@/services/volunteerApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteVolunteerModalProps {
  volunteer: Volunteer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteVolunteerModal({ volunteer, open, onOpenChange }: DeleteVolunteerModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => volunteerApi.deleteVolunteer(id),
    onSuccess: () => {
      toast.success('Volunteer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['volunteerStats'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete volunteer');
    },
  });

  const handleDelete = () => {
    if (!volunteer) return;
    deleteMutation.mutate(volunteer.id);
  };

  if (!volunteer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Volunteer
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this volunteer? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-medium">{volunteer.fullName}</p>
            <p className="text-sm text-muted-foreground">{volunteer.email}</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
