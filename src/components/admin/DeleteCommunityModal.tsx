import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityMember, communityApi } from '@/services/communityApi';
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

interface DeleteCommunityModalProps {
  member: CommunityMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCommunityModal({ member, open, onOpenChange }: DeleteCommunityModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => communityApi.deleteMember(id),
    onSuccess: () => {
      toast.success('Community member deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['communityMembers'] });
      queryClient.invalidateQueries({ queryKey: ['communityStats'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete community member');
    },
  });

  const handleDelete = () => {
    if (!member) return;
    deleteMutation.mutate(member.id);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Community Member
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this community member? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
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
