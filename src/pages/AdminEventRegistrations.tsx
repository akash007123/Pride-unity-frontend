import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { ArrowLeft, Search, Download, Mail, Phone, Calendar, User, Ticket } from 'lucide-react';
import { eventApi, EventRegistration, Event } from '@/services/eventApi';

const ITEMS_PER_PAGE = 10;

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  cancelled: 'destructive',
  waitlisted: 'outline',
};

const paymentStatusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'default',
  pending: 'outline',
  failed: 'destructive',
  refunded: 'secondary',
};

export default function AdminEventRegistrations() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const { data: eventData } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getEvent(id!),
    enabled: !!id,
  });

  const event = eventData?.data;

  const { data, isLoading, error } = useQuery({
    queryKey: ['eventRegistrations', id, page, statusFilter],
    queryFn: () =>
      eventApi.getEventRegistrations(id!, {
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter,
      }),
    enabled: !!id,
  });

  const filteredRegistrations = data?.data.filter((reg) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      reg.firstName.toLowerCase().includes(searchLower) ||
      reg.lastName.toLowerCase().includes(searchLower) ||
      reg.email.toLowerCase().includes(searchLower) ||
      reg.ticketId.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = data?.pagination.pages || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Event Registrations</h1>
            {event && (
              <p className="text-muted-foreground">{event.title}</p>
            )}
          </div>
        </div>
        <Button variant="outline" className="btn-pride">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Event Info Card */}
      {event && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Attendees</p>
                  <p className="font-medium">
                    {event.currentAttendees}
                    {event.maxAttendees && ` / ${event.maxAttendees}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                  <p className="font-medium">{data?.pagination.total || 0}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={statusVariants[event.status] || 'outline'}>
                  {event.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ticket ID..."
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-destructive">
                    Error loading registrations. Please try again.
                  </TableCell>
                </TableRow>
              ) : filteredRegistrations?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No registrations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations?.map((registration: EventRegistration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {registration.firstName} {registration.lastName}
                        </p>
                        {registration.accessibilityNeeds && (
                          <p className="text-xs text-muted-foreground">
                            Accessibility: {registration.accessibilityNeeds}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {registration.email}
                        </div>
                        {registration.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {registration.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {registration.ticketId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[registration.status] || 'outline'}>
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={paymentStatusVariants[registration.paymentStatus] || 'outline'}>
                        {registration.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {registration.amount === 0 ? 'Free' : `$${registration.amount}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(registration.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(registration.createdAt).toLocaleTimeString()}
                        </p>
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
    </div>
  );
}
