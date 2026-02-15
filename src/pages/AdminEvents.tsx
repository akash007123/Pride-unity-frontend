import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Edit, Trash2, Search, Calendar, MapPin, Users, Plus } from 'lucide-react';
import { eventApi, Event } from '@/services/eventApi';
import { ViewEventModal } from '@/components/admin/ViewEventModal';
import { EditEventModal } from '@/components/admin/EditEventModal';
import { DeleteEventModal } from '@/components/admin/DeleteEventModal';
import { AddEventModal } from '@/components/admin/AddEventModal';

const ITEMS_PER_PAGE = 10;

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  published: 'default',
  cancelled: 'destructive',
  completed: 'secondary',
};

export default function AdminEvents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminEvents', page, search, statusFilter],
    queryFn: () =>
      eventApi.getAdminEvents({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter,
        search: search || undefined,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ['eventStats'],
    queryFn: () => eventApi.getStats(),
  });

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setViewModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setDeleteModalOpen(true);
  };

  const handleEventUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    queryClient.invalidateQueries({ queryKey: ['eventStats'] });
  };

  const handleEventDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    queryClient.invalidateQueries({ queryKey: ['eventStats'] });
  };

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    queryClient.invalidateQueries({ queryKey: ['eventStats'] });
  };

  const totalPages = data?.pagination.pages || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Manage your events and registrations</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="btn-pride">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats?.data?.total || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats?.data?.byStatus?.published || 0}</p>
              </div>
              <Badge variant="default">{stats?.data?.byStatus?.published || 0}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registrations</p>
                <p className="text-2xl font-bold">{stats?.data?.totalRegistrations || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">{stats?.data?.byStatus?.draft || 0}</p>
              </div>
              <Badge variant="outline">{stats?.data?.byStatus?.draft || 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-destructive">
                    Error loading events. Please try again.
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No events found. Create your first event!
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {event.description.substring(0, 50)}...
                        </p>
                        {event.featured && (
                          <Badge variant="outline" className="text-xs">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {event.location.length > 25 
                          ? `${event.location.substring(0, 25)}...` 
                          : event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[event.status] || 'outline'}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {event.currentAttendees}
                          {event.maxAttendees && ` / ${event.maxAttendees}`}
                        </p>
                        {event.spotsLeft !== null && event.spotsLeft < 50 && event.spotsLeft > 0 && (
                          <p className="text-xs text-amber-500">{event.spotsLeft} spots left</p>
                        )}
                        {event.isSoldOut && (
                          <p className="text-xs text-red-500">Sold Out</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  onClick={() => setPage(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modals */}
      {selectedEvent && (
        <>
          <ViewEventModal
            event={selectedEvent}
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
          />
          <EditEventModal
            event={selectedEvent}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onEventUpdated={handleEventUpdated}
          />
          <DeleteEventModal
            event={selectedEvent}
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onEventDeleted={handleEventDeleted}
          />
        </>
      )}
      <AddEventModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}
