import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  Filter,
  Eye,
  Printer,
  Share2,
  Activity,
  PieChart,
  LineChart,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reportApi, Report, ReportStats } from '@/services/reportApi';
import { toast } from 'sonner';

// Animation variants
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
};

const AdminReports = () => {
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Fetch reports data
  const { data: reportsData, isLoading: reportsLoading, error: reportsError, refetch } = useQuery({
    queryKey: ['adminReports', filterType],
    queryFn: () => reportApi.getReports({ 
      type: filterType === 'all' ? undefined : filterType,
      limit: 50 
    }),
  });

  // Fetch stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['reportStats'],
    queryFn: () => reportApi.getStats(),
  });

  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: (data: { type: string; title?: string; description?: string }) => 
      reportApi.generateReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStats'] });
      toast.success('Report generated successfully');
      setShowGenerateModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate report');
    }
  });

  // Delete report mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportApi.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStats'] });
      toast.success('Report deleted successfully');
      setSelectedReport(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete report');
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'contact':
        return <MessageSquare className="h-4 w-4" />;
      case 'volunteer':
        return <Activity className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'activity':
        return <TrendingUp className="h-4 w-4" />;
      case 'financial':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'scheduled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const reports: Report[] = reportsData?.data || [];
  const stats: ReportStats = statsData?.data || { total: 0, ready: 0, processing: 0, scheduled: 0, thisMonth: 0 };

  const reportTypes = [
    { value: 'activity', label: 'Activity Report', description: 'Overview of platform activity' },
    { value: 'user', label: 'User Report', description: 'User registrations and activity' },
    { value: 'contact', label: 'Contact Report', description: 'Contact form submissions' },
    { value: 'volunteer', label: 'Volunteer Report', description: 'Volunteer information and hours' },
    { value: 'event', label: 'Event Report', description: 'Event performance and attendance' },
    { value: 'financial', label: 'Financial Report', description: 'Financial summary (placeholder)' },
  ];

  const handleGenerateReport = (type: string) => {
    generateMutation.mutate({ type });
  };

  // Handle view report
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewModalOpen(true);
  };

  // Handle download report
  const handleDownloadReport = (report: Report) => {
    try {
      const reportData = {
        title: report.title,
        type: report.type,
        description: report.description,
        status: report.status,
        generatedAt: report.createdAt,
        generatedBy: report.generatedBy?.name || 'Admin',
        data: report.data
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/\s+/g, '_')}_${new Date(report.createdAt).toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  // Handle delete report
  const handleDeleteReport = (report: Report) => {
    if (confirm(`Are you sure you want to delete "${report.title}"?`)) {
      deleteMutation.mutate(report.id);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            View and generate reports for platform activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            onClick={() => setShowGenerateModal(true)}
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold mt-1">{statsLoading ? '...' : stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready</p>
                <p className="text-2xl font-bold mt-1">{statsLoading ? '...' : stats.ready}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold mt-1">{statsLoading ? '...' : stats.scheduled}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold mt-1">{statsLoading ? '...' : stats.thisMonth}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              All Reports
            </CardTitle>
            <CardDescription>
              Browse and manage your generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full" onValueChange={setFilterType}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="user">Users</TabsTrigger>
                <TabsTrigger value="contact">Contacts</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteers</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value={filterType} className="mt-0">
                {reportsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reportsError ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Failed to load reports</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => refetch()}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reports found</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setShowGenerateModal(true)}
                    >
                      Generate Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <motion.div
                        key={report.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${
                            report.type === 'user' ? 'from-red-500 to-orange-500' :
                            report.type === 'contact' ? 'from-purple-500 to-pink-500' :
                            report.type === 'volunteer' ? 'from-amber-500 to-orange-500' :
                            report.type === 'event' ? 'from-green-500 to-emerald-500' :
                            report.type === 'activity' ? 'from-blue-500 to-cyan-500' :
                            'from-gray-500 to-slate-500'
                          } flex items-center justify-center text-white`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{report.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{report.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                              {report.generatedBy && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">
                                    By {report.generatedBy.name || 'Admin'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <span className={`h-2 w-2 rounded-full ${getStatusColor(report.status)}`} />
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                          <div className="flex gap-1">
                            {/* View Button */}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewReport(report)}
                              title="View Report"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* Download Button */}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDownloadReport(report)}
                              title="Download Report"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {/* Delete Button */}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteReport(report)}
                              disabled={deleteMutation.isPending}
                              title="Delete Report"
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-background z-10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generate New Report</CardTitle>
                  <CardDescription>
                    Select the type of report you want to generate
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowGenerateModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {reportTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleGenerateReport(type.value)}
                  disabled={generateMutation.isPending}
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(type.value)}
                    <div className="text-left">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
              {generateMutation.isPending && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Generating report...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Report Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReport && getTypeIcon(selectedReport.type)}
              {selectedReport?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {selectedReport && (
              <div className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedReport.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline" className="gap-1 mt-1">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedReport.status)}`} />
                      {selectedReport.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Generated On</p>
                    <p className="font-medium">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Generated By</p>
                    <p className="font-medium">{selectedReport.generatedBy?.name || 'Admin'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedReport.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Report Data</p>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(selectedReport.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            {selectedReport && (
              <Button onClick={() => handleDownloadReport(selectedReport)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminReports;
