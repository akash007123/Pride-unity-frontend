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
  Phone, 
  MapPin,
  Plus,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { customVolunteerApi, CustomVolunteer } from '@/services/customVolunteerApi';
import { useAuth } from '@/contexts/AuthContext';
import { AddCustomVolunteerModal } from '@/components/admin/AddCustomVolunteerModal';
import { ViewCustomVolunteerModal } from '@/components/admin/ViewCustomVolunteerModal';
import { EditCustomVolunteerModal } from '@/components/admin/EditCustomVolunteerModal';
import { DeleteModal } from '@/components/admin/DeleteModal';

const ITEMS_PER_PAGE = 10;

const statusVariants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string }> = {
  active: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
  inactive: { variant: 'secondary', className: 'bg-gray-500 hover:bg-gray-600' },
  archived: { variant: 'outline', className: 'border-gray-500 text-gray-600' },
};

const roleLabels: Record<string, string> = {
  Volunteer: 'Volunteer',
  Member: 'Member',
  Coordinator: 'Coordinator',
  Leader: 'Leader',
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

export default function CustomVolunteerPage() {
  const { admin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<CustomVolunteer | null>(null);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['customVolunteers', page, search, statusFilter],
    queryFn: () =>
      customVolunteerApi.getVolunteers({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter,
        search: search || undefined,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ['customVolunteerStats'],
    queryFn: () => customVolunteerApi.getStats(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customVolunteerApi.deleteVolunteer(id),
    onSuccess: () => {
      toast.success('Volunteer deleted successfully');
      handleVolunteerDeleted();
      setDeleteModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete volunteer');
    },
  });

  const handleView = (volunteer: CustomVolunteer) => {
    setSelectedVolunteer(volunteer);
    setViewModalOpen(true);
  };

  const handleEdit = (volunteer: CustomVolunteer) => {
    setSelectedVolunteer(volunteer);
    setEditModalOpen(true);
  };

  const handleDelete = (volunteer: CustomVolunteer) => {
    setSelectedVolunteer(volunteer);
    setDeleteModalOpen(true);
  };

  const handleVolunteerDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['customVolunteers'] });
    queryClient.invalidateQueries({ queryKey: ['customVolunteerStats'] });
  };

  const totalPages = data?.pagination.pages || 1;

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-500 to-rose-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Custom Volunteer
            </motion.h1>
            <motion.p 
              className="mt-1 sm:mt-2 text-white/80 text-sm sm:text-base"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage custom volunteer records with role-based access
            </motion.p>
          </div>
          <motion.div 
            className="mt-3 sm:mt-0 flex flex-wrap items-center gap-2 sm:gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary" className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              {stats?.data?.total || 0} Total
            </Badge>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm h-8 sm:h-9"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-amber-600 hover:bg-white/90 backdrop-blur-sm h-8 sm:h-9 font-medium"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Add Volunteer</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats Pills */}
        <motion.div 
          className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.active || 0}</span> active
          </div>
          <div className="rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byStatus?.inactive || 0}</span> inactive
          </div>
          <div className="rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byRole?.Volunteer || 0}</span> volunteers
          </div>
          <div className="rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
            <span className="font-semibold">{stats?.data?.byRole?.Member || 0}</span> members
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid gap-3 sm:gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.active || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold mt-1">{stats?.data?.byStatus?.inactive || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volunteers</p>
                <p className="text-3xl font-bold mt-1">{stats?.data?.byRole?.Volunteer || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-3xl font-bold mt-1">{stats?.data?.byRole?.Member || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, mobile, ID..."
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
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}>
                    <SelectTrigger className="w-[130px] sm:w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="default"
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600"
                    onClick={() => setAddModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Volunteers Table */}
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
                <h3 className="text-lg font-semibold mb-2">Failed to load volunteers</h3>
                <p className="text-muted-foreground mb-4">There was an error loading the volunteers. Please try again.</p>
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
                <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
                <p className="text-muted-foreground">
                  {search || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No volunteer records yet. Click Add Volunteer to create one.'}
                </p>
                <Button 
                  className="mt-4 bg-amber-500 hover:bg-amber-600"
                  onClick={() => setAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Volunteer
                </Button>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Volunteer ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">Mobile</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">Role</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">City</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {data?.data.map((volunteer, index) => (
                        <motion.tr
                          key={volunteer.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                          className="group"
                        >
                          <TableCell>
                            <span className="font-mono text-sm">{volunteer.volunteerId}</span>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{volunteer.fullName}</div>
                            <div className="md:hidden text-sm text-muted-foreground">
                              {volunteer.mobile}
                            </div>
                            {volunteer.email && (
                              <div className="md:hidden text-xs text-muted-foreground">
                                {volunteer.email}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{volunteer.mobile}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {roleLabels[volunteer.role] || volunteer.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {volunteer.city || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge 
                                variant={statusVariants[volunteer.status]?.variant || 'secondary'}
                                className={statusVariants[volunteer.status]?.className}
                              >
                                {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(volunteer)}
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
                                  onClick={() => handleEdit(volunteer)}
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
                                  onClick={() => handleDelete(volunteer)}
                                  title="Delete"
                                  className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
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

      {/* Pagination */}
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
                  if (pageNum > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className="cursor-pointer"
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
      <AddCustomVolunteerModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['customVolunteers'] });
          queryClient.invalidateQueries({ queryKey: ['customVolunteerStats'] });
        }}
      />

      <ViewCustomVolunteerModal
        volunteer={selectedVolunteer}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />

      <EditCustomVolunteerModal
        volunteer={selectedVolunteer}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Volunteer"
        description="Are you sure you want to delete this volunteer? This action cannot be undone."
        item={selectedVolunteer ? {
          name: selectedVolunteer.fullName,
          email: selectedVolunteer.email,
          id: selectedVolunteer.volunteerId
        } : undefined}
        onConfirm={() => {
          if (selectedVolunteer) {
            deleteMutation.mutate(selectedVolunteer.id);
          }
        }}
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
