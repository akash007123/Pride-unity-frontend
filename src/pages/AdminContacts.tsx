import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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
import { Eye, Edit, Trash2, Search, MessageSquare, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { contactApi, Contact } from '@/services/contactApi';
import { ViewContactModal } from '@/components/admin/ViewContactModal';
import { EditContactModal } from '@/components/admin/EditContactModal';
import { DeleteContactModal } from '@/components/admin/DeleteContactModal';

const ITEMS_PER_PAGE = 10;

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  read: 'secondary',
  replied: 'outline',
  archived: 'secondary',
};

export default function AdminContacts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['contacts', page, search, statusFilter],
    queryFn: () =>
      contactApi.getContacts({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter,
        search: search || undefined,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setEditModalOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handleContactUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
    queryClient.invalidateQueries({ queryKey: ['contactStats'] });
  };

  const handleContactDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
    queryClient.invalidateQueries({ queryKey: ['contactStats'] });
  };

  const totalPages = data?.pagination.pages || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts Management</h1>
          <p className="text-muted-foreground">
            Manage and respond to contact form submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {stats?.data?.total || 0} Total Contacts
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats?.data?.byStatus?.new || 0}</div>
            <p className="text-sm text-muted-foreground">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats?.data?.byStatus?.read || 0}</div>
            <p className="text-sm text-muted-foreground">Read</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats?.data?.byStatus?.replied || 0}</div>
            <p className="text-sm text-muted-foreground">Replied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats?.data?.byStatus?.archived || 0}</div>
            <p className="text-sm text-muted-foreground">Archived</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Failed to load contacts</p>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No contact submissions yet'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="font-medium">{contact.name}</div>
                      <div className="md:hidden text-sm text-muted-foreground">
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{contact.mobile}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm truncate max-w-[200px] block">
                        {contact.subject}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[contact.status] || 'secondary'}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(contact)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contact)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact)}
                          title="Delete"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modals */}
      <ViewContactModal
        contact={selectedContact}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />

      <EditContactModal
        contact={selectedContact}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onContactUpdated={handleContactUpdated}
      />

      <DeleteContactModal
        contact={selectedContact}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onContactDeleted={handleContactDeleted}
      />
    </div>
  );
}
