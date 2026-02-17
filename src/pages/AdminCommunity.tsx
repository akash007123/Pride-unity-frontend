import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Users, 
  Mail, 
  Phone, 
  BookOpen,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Archive,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { communityApi, CommunityMember } from '@/services/communityApi';
import { ViewCommunityModal } from '@/components/admin/ViewCommunityModal';
import { EditCommunityModal } from '@/components/admin/EditCommunityModal';
import { DeleteModal } from '@/components/admin/DeleteModal';
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
  pending: { variant: 'default', className: 'bg-amber-500 hover:bg-amber-600' },
  approved: { variant: 'secondary', className: 'bg-green-500 hover:bg-green-600' },
  rejected: { variant: 'destructive', className: 'bg-red-500 hover:bg-red-600' },
  archived: { variant: 'outline', className: 'border-gray-500 text-gray-600' },
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

export default function AdminCommunity() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['communityMembers', page, search, statusFilter],
    queryFn: () =>
      communityApi.getMembers({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter,
        search: search || undefined,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ['communityStats'],
    queryFn: () => communityApi.getStats(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => communityApi.deleteMember(id),
    onSuccess: () => {
      toast.success('Community member deleted successfully');
      handleMemberDeleted();
      setDeleteModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete community member');
    },
  });

  const handleView = (member: CommunityMember) => {
    setSelectedMember(member);
    setViewModalOpen(true);
  };

  const handleEdit = (member: CommunityMember) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleDelete = (member: CommunityMember) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleMemberUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['communityMembers'] });
    queryClient.invalidateQueries({ queryKey: ['communityStats'] });
  };

  const handleMemberDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['communityMembers'] });
    queryClient.invalidateQueries({ queryKey: ['communityStats'] });
  };

  const totalPages = data?.pagination.pages || 1;

  // Sort data locally since API doesn't support sorting
  const sortedData = data?.data ? [...data.data].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    return sortOrder === 'asc' 
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) : [];

  const handleExport = () => {
    console.log('Exporting community members...');
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 p-8 text-white"
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
              Community Members
            </motion.h1>
            <motion.p 
              className="mt-2 text-white/80"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage community registration submissions
            </motion.p>
          </div>
          <motion.div 
            className="mt-4 md:mt-0 flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Users className="h-4 w-4 mr-2" />
              {stats?.data?.total || 0} Total
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
            <span className="font-semibold">{stats?.data?.byStatus?.pending || 0}</span> pending
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.approved || 0}</span> approved
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.rejected || 0}</span> rejected
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.archived || 0}</span> archived
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards with Hover Effects */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="border-l-4 border-l-amber-500 overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.pending || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-amber-500" />
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
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.approved || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="border-l-4 border-l-red-500 overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.rejected || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserX className="h-6 w-6 text-red-500" />
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
                  <p className="text-sm text-muted-foreground">Archived</p>
                  <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.archived || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Archive className="h-6 w-6 text-gray-500" />
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
                    placeholder="Search by name, email, or education..."
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
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
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
                        <Select value={sortBy} onValueChange={(value: 'date' | 'name') => setSortBy(value)}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
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

      {/* Members Table with Row Animations */}
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
                  <Users className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Failed to load community members</h3>
                <p className="text-muted-foreground mb-4">There was an error loading the members. Please try again.</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </motion.div>
            ) : data?.data.length === 0 ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-12 text-center"
              >
                <div className="rounded-full bg-muted w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-muted-foreground">
                  {search || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No community registrations yet'}
                </p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">Contact Info</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">Education</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">Date</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {sortedData.map((member, index) => (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                          className="group"
                        >
                          <TableCell>
                            <div className="font-medium">{member.name}</div>
                            <div className="md:hidden text-sm text-muted-foreground">
                              {member.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{member.mobile}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{member.education}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge 
                                variant={statusVariants[member.status]?.variant || 'secondary'}
                                className={statusVariants[member.status]?.className}
                              >
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(member.createdAt), 'MMM d, yyyy')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(member)}
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
                                  onClick={() => handleEdit(member)}
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
                                  onClick={() => handleDelete(member)}
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
                                  <DropdownMenuItem>Approve Member</DropdownMenuItem>
                                  <DropdownMenuItem>Reject Member</DropdownMenuItem>
                                  <DropdownMenuItem>Archive Member</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Block User
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
      <ViewCommunityModal
        member={selectedMember}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
      <EditCommunityModal
        member={selectedMember}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Community Member"
        description="Are you sure you want to delete this community member? This action cannot be undone."
        item={selectedMember ? { name: selectedMember.name, email: selectedMember.email } : undefined}
        onConfirm={() => selectedMember && deleteMutation.mutate(selectedMember.id)}
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
