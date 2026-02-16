import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Ticket,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Archive,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { eventApi, Event } from '@/services/eventApi';
import { Link } from 'react-router-dom';
import { ViewEventModal } from '@/components/admin/ViewEventModal';
import { EditEventModal } from '@/components/admin/EditEventModal';
import { DeleteEventModal } from '@/components/admin/DeleteEventModal';
import { AddEventModal } from '@/components/admin/AddEventModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ITEMS_PER_PAGE = 10;

const statusVariants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string }> = {
  draft: { variant: 'outline', className: 'border-gray-500 text-gray-600' },
  published: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
  cancelled: { variant: 'destructive', className: 'bg-red-500 hover:bg-red-600' },
  completed: { variant: 'secondary', className: 'bg-blue-500 hover:bg-blue-600' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
} as const;

export default function AdminEvents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['adminEvents', page, search, statusFilter],
    queryFn: () =>
      eventApi.getAdminEvents({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter,
        search: search || undefined,
      }),
  });

  console.log('Admin Events:', data, 'Error:', error);

  const { data: stats, error: statsError } = useQuery({
    queryKey: ['eventStats'],
    queryFn: () => eventApi.getStats(),
  });

  console.log('Event Stats:', stats, 'Error:', statsError);

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

  // Sort data locally since API doesn't support sorting
  const sortedData = data?.data ? [...data.data].sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    return sortOrder === 'asc' 
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  }) : [];

  const handleExport = () => {
    console.log('Exporting events...');
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header with Animated Gradient */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.h1 
              className="text-3xl font-bold tracking-tight"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Events Management
            </motion.h1>
            <motion.p 
              className="mt-2 text-white/80"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your events and registrations
            </motion.p>
            {statsError && (
              <p className="mt-2 text-red-300 text-sm">
                Failed to load stats. Please refresh.
              </p>
            )}
          </div>
          <motion.div 
            className="mt-4 md:mt-0 flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {stats?.data?.total || 0} Events
            </Badge>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setAddModalOpen(true)} className="btn-pride">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats Pills */}
        <motion.div 
          className="mt-6 flex flex-wrap gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.draft || 0}</span> draft
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.published || 0}</span> published
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.totalRegistrations || 0}</span> registrations
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.completed || 0}</span> completed
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards with Hover Effects */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="border-l-4 border-l-purple-500 overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.total ?? '-'}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="border-l-4 border-l-green-500 overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.published ?? '-'}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="border-l-4 border-l-blue-500 overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Registrations</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.totalRegistrations ?? '-'}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="border-l-4 border-l-gray-500 overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gray-500/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Draft</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.draft ?? '-'}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9 pr-20"
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={() => setSearch('')}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`transition-colors ${showFilters ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
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

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <Select value={sortBy} onValueChange={(value: 'date' | 'title') => setSortBy(value)}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                        >
                          {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Table with Row Animations */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Skeleton className="h-16 w-full" />
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-12 text-center"
              >
                <div className="rounded-full bg-destructive/10 w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <Calendar className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Failed to load events</h3>
                <p className="text-muted-foreground mb-4">There was an error loading the events. Please try again.</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </motion.div>
            ) : data?.data.length === 0 ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-12 text-center"
              >
                <div className="rounded-full bg-muted w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {search || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No events yet. Create your first event!'}
                </p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Event</TableHead>
                      <TableHead className="font-semibold">Date & Time</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Attendees</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {sortedData.map((event, index) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                          className="group"
                        >
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
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {event.location.length > 25 
                                ? `${event.location.substring(0, 25)}...` 
                                : event.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge 
                                variant={statusVariants[event.status]?.variant || 'outline'}
                                className={statusVariants[event.status]?.className}
                              >
                                {event.status}
                              </Badge>
                            </motion.div>
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
                            <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                >
                                  <Link to={`/admin/events/${event.id}/registrations`}>
                                    <Ticket className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(event)}
                                  title="View"
                                  className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(event)}
                                  title="Edit"
                                  className="hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-950"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(event)}
                                  title="Delete"
                                  className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Publish Event</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as Draft</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                                  <DropdownMenuItem>Cancel Event</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Registrations</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    Cancel Event
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination with Animation */}
      {totalPages > 1 && (
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:scale-105 transition-transform'}
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (page > 3) {
                    pageNum = page - 3 + i;
                  }
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className="cursor-pointer hover:scale-105 transition-transform"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:scale-105 transition-transform'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
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
    </motion.div>
  );
}
