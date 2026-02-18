import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Trash2, 
  Search, 
  Mail,
  Download,
  RefreshCw,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { newsletterApi, NewsletterSubscriber } from '@/services/newsletterApi';
import { DeleteModal } from '@/components/admin/DeleteModal';

const ITEMS_PER_PAGE = 10;

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

const statusVariants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string }> = {
  active: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
  unsubscribed: { variant: 'secondary', className: 'bg-gray-500 hover:bg-gray-600' },
};

export default function AdminNewsletter() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['newsletter', page, search, statusFilter],
    queryFn: () =>
      newsletterApi.getSubscribers({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  const handleDelete = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteModalOpen(true);
  };

  const handleSubscriberDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['newsletter'] });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsletterApi.deleteSubscriber(id),
    onSuccess: () => {
      toast.success('Subscriber deleted successfully');
      handleSubscriberDeleted();
      setDeleteModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete subscriber');
    },
  });

  const totalPages = data?.totalPages || 1;

  const handleExport = async () => {
    try {
      const blob = await newsletterApi.exportSubscribers();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Subscribers exported successfully');
    } catch (error) {
      toast.error('Failed to export subscribers');
    }
  };

  // Filter subscribers based on search
  const filteredSubscribers = data?.data?.filter(subscriber => 
    subscriber.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-purple-500 to-indigo-600 p-8 text-white"
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
              Newsletter Subscribers
            </motion.h1>
            <motion.p 
              className="mt-1 sm:mt-2 text-white/80 text-sm sm:text-base"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage newsletter subscription emails
            </motion.p>
          </div>

          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/70">Total Subscribers</p>
                <p className="text-2xl font-bold">{data?.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/30 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-white/70">Active</p>
                <p className="text-2xl font-bold">
                  {data?.data?.filter(s => s.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-500/30 rounded-lg">
                <UserX className="h-5 w-5 text-gray-300" />
              </div>
              <div>
                <p className="text-sm text-white/70">Unsubscribed</p>
                <p className="text-2xl font-bold">
                  {data?.data?.filter(s => s.status === 'unsubscribed').length || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">There was an error loading the subscribers. Please try again.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No subscribers found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {subscriber.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusVariants[subscriber.status]?.variant || 'outline'}
                      className={statusVariants[subscriber.status]?.className}
                    >
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscriber.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subscriber)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink 
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Subscriber"
        description={`Are you sure you want to delete "${selectedSubscriber?.email}"? This action cannot be undone.`}
        onConfirm={() => selectedSubscriber && deleteMutation.mutate(selectedSubscriber.id)}
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  );
}
