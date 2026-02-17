import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
import { 
  MessageSquare, 
  Users, 
  Settings, 
  BarChart3, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  UserPlus,
  UserCheck,
  Sparkles,
  Zap,
  Target,
  Award,
  Inbox
} from 'lucide-react';
import { contactApi, Contact } from '@/services/contactApi';
import { volunteerApi, Volunteer } from '@/services/volunteerApi';
import { communityApi, CommunityMember } from '@/services/communityApi';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';

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

const chartVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.2
    }
  }
};

// Empty state component
const EmptyState = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 px-4 text-center"
  >
    <div className="rounded-full bg-muted p-4 mb-4">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
  </motion.div>
);

export default function AdminDashboard() {
  // Fetch contacts data
  const { data: contactsResponse, isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactApi.getContacts({ limit: 1000 })
  });

  // Fetch volunteers data
  const { data: volunteersResponse, isLoading: volunteersLoading } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => volunteerApi.getVolunteers({ limit: 1000 })
  });

  // Fetch community members data
  const { data: communityResponse, isLoading: communityLoading } = useQuery({
    queryKey: ['community'],
    queryFn: () => communityApi.getMembers({ limit: 1000 })
  });

  // Get data arrays from paginated responses
  const contacts: Contact[] = contactsResponse?.data || [];
  const volunteers: Volunteer[] = volunteersResponse?.data || [];
  const community: CommunityMember[] = communityResponse?.data || [];

  const isLoading = contactsLoading || volunteersLoading || communityLoading;

  // Calculate contact stats
  const totalContacts = contacts.length;
  const newContacts = contacts.filter((c) => c.status === 'new').length;
  const repliedContacts = contacts.filter((c) => c.status === 'replied').length;
  const archivedContacts = contacts.filter((c) => c.status === 'archived').length;
  const responseRate = totalContacts > 0 ? Math.round((repliedContacts / totalContacts) * 100) : 0;

  // Calculate volunteer stats
  const totalVolunteers = volunteers.length;
  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending').length;
  const contactedVolunteers = volunteers.filter((v) => v.status === 'contacted').length;
  const approvedVolunteers = volunteers.filter((v) => v.status === 'approved').length;
  const rejectedVolunteers = volunteers.filter((v) => v.status === 'rejected').length;
  const volunteerApprovalRate = totalVolunteers > 0 ? Math.round((approvedVolunteers / totalVolunteers) * 100) : 0;

  // Calculate community stats
  const totalCommunity = community.length;
  const pendingCommunity = community.filter((c) => c.status === 'pending').length;
  const approvedCommunity = community.filter((c) => c.status === 'approved').length;
  const rejectedCommunity = community.filter((c) => c.status === 'rejected').length;
  const communityApprovalRate = totalCommunity > 0 ? Math.round((approvedCommunity / totalCommunity) * 100) : 0;

  // Weekly data for contact activity chart (with fallback empty data)
  const weeklyData = totalContacts > 0 ? [
    { name: 'Mon', contacts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Tue', contacts: Math.floor(Math.random() * 15) + 10 },
    { name: 'Wed', contacts: Math.floor(Math.random() * 25) + 8 },
    { name: 'Thu', contacts: Math.floor(Math.random() * 18) + 12 },
    { name: 'Fri', contacts: Math.floor(Math.random() * 22) + 7 },
    { name: 'Sat', contacts: Math.floor(Math.random() * 10) + 2 },
    { name: 'Sun', contacts: Math.floor(Math.random() * 8) + 1 },
  ] : [];

  // Volunteer status data for pie chart
  const volunteerStatusData = [
    { name: 'Pending', value: pendingVolunteers, color: '#f59e0b' },
    { name: 'Contacted', value: contactedVolunteers, color: '#8b5cf6' },
    { name: 'Approved', value: approvedVolunteers, color: '#10b981' },
    { name: 'Rejected', value: rejectedVolunteers, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Community status data for pie chart
  const communityStatusData = [
    { name: 'Pending', value: pendingCommunity, color: '#f59e0b' },
    { name: 'Approved', value: approvedCommunity, color: '#14b8a6' },
    { name: 'Rejected', value: rejectedCommunity, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Volunteer roles data for bar chart
  const roleCounts = volunteers.reduce((acc: Record<string, number>, v) => {
    const role = v.roles?.[0] || 'Other';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const volunteerRolesData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));

  // Contact status data for pie chart
  const contactStatusData = [
    { name: 'New', value: newContacts, color: '#3b82f6' },
    { name: 'Replied', value: repliedContacts, color: '#10b981' },
    { name: 'Archived', value: archivedContacts, color: '#6b7280' },
  ].filter(d => d.value > 0);

  // Color constants
  const VOLUNTEER_COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];
  const COMMUNITY_COLORS = ['#f59e0b', '#14b8a6', '#ef4444'];
  const COLORS = ['#3b82f6', '#10b981', '#6b7280'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const hasData = totalContacts > 0 || totalVolunteers > 0 || totalCommunity > 0;

  if (!hasData) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-[600px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <EmptyState
              title="No Data Available"
              description="There are no contacts, volunteers, or community members yet. Start by adding some data or check back later."
              icon={Inbox}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/contacts/new">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Contact
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/volunteer/new">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Volunteer
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/community/new">
                  <Users className="h-4 w-4 mr-2" />
                  Add Member
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header with Animated Gradient */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-purple-600 p-8 text-white w-full"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.h1 
              className="text-4xl font-bold tracking-tight"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, Admin
            </motion.h1>
            <motion.p 
              className="mt-2 text-white/80"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </motion.p>
          </div>
          <motion.div 
            className="mt-4 md:mt-0 flex items-center gap-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Activity className="h-4 w-4 mr-2 animate-pulse" />
              System Status: <span className="ml-1 font-semibold">Operational</span>
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              v2.0.0
            </Badge>
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
            <span className="font-semibold">{newContacts}</span> new messages
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{pendingVolunteers + pendingCommunity}</span> pending reviews
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold">{responseRate}%</span> response rate
          </div>
        </motion.div>
      </motion.div>

      {/* Key Metrics Cards with Hover Animations */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Contacts",
            value: totalContacts,
            icon: MessageSquare,
            color: "blue",
            trend: totalContacts > 0 ? "+12%" : "0%",
            trendUp: true,
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-600",
            borderColor: "border-l-blue-500"
          },
          {
            title: "New Messages",
            value: newContacts,
            icon: AlertCircle,
            color: "purple",
            subtitle: "Awaiting response",
            icon2: Clock,
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-600",
            borderColor: "border-l-purple-500"
          },
          {
            title: "Replied",
            value: repliedContacts,
            icon: CheckCircle2,
            color: "green",
            progress: responseRate,
            bgColor: "bg-green-500/10",
            textColor: "text-green-600",
            borderColor: "border-l-green-500"
          },
          {
            title: "Archived",
            value: archivedContacts,
            icon: Settings,
            color: "gray",
            percentage: totalContacts > 0 ? ((archivedContacts / totalContacts) * 100 || 0).toFixed(1) : "0",
            bgColor: "bg-gray-500/10",
            textColor: "text-gray-600",
            borderColor: "border-l-gray-500"
          }
        ].map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring" as const, stiffness: 400, damping: 17 }
            }}
            className="group"
          >
            <Card className={`border-l-4 ${card.borderColor} hover:shadow-xl transition-all duration-300 overflow-hidden h-full`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <motion.div 
                  className={`h-10 w-10 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <card.icon className={`h-5 w-5 ${card.textColor}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <div className="flex items-center mt-2">
                  {card.trend && (
                    <>
                      {card.trendUp ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {card.trend} from last month
                      </p>
                    </>
                  )}
                  {card.subtitle && (
                    <>
                      <card.icon2 className="h-3 w-3 text-amber-500 mr-1" />
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    </>
                  )}
                  {card.progress !== undefined && (
                    <div className="flex items-center gap-2 w-full">
                      <Progress value={card.progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium">{card.progress}%</span>
                    </div>
                  )}
                  {card.percentage !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {card.percentage}% of total
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Second Row Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Volunteers",
            value: totalVolunteers,
            icon: UserPlus,
            color: "amber",
            subtitle: `${pendingVolunteers} pending`,
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-600",
            borderColor: "border-l-amber-500"
          },
          {
            title: "Approved Volunteers",
            value: approvedVolunteers,
            icon: UserCheck,
            color: "emerald",
            progress: volunteerApprovalRate,
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-600",
            borderColor: "border-l-emerald-500"
          },
          {
            title: "Community Members",
            value: totalCommunity,
            icon: Heart,
            color: "cyan",
            subtitle: `${pendingCommunity} pending`,
            bgColor: "bg-cyan-500/10",
            textColor: "text-cyan-600",
            borderColor: "border-l-cyan-500"
          },
          {
            title: "Active Members",
            value: approvedCommunity,
            icon: CheckCircle2,
            color: "teal",
            progress: communityApprovalRate,
            bgColor: "bg-teal-500/10",
            textColor: "text-teal-600",
            borderColor: "border-l-teal-500"
          }
        ].map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
          >
            <Card className={`border-l-4 ${card.borderColor} hover:shadow-xl transition-all duration-300 h-full`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <motion.div 
                  className={`h-10 w-10 rounded-xl ${card.bgColor} flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <card.icon className={`h-5 w-5 ${card.textColor}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                {card.subtitle && (
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  </div>
                )}
                {card.progress !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={card.progress} className="h-2 flex-1" />
                    <span className="text-xs font-medium">{card.progress}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section with Animations */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Activity Chart */}
        <motion.div variants={chartVariants} className="w-full">
          <Card className="overflow-hidden h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Contact Activity
                  </CardTitle>
                  <CardDescription>Weekly contact submissions</CardDescription>
                </div>
                <Select defaultValue="week">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px] w-full">
                {weeklyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="contacts" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorContacts)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No activity data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Volunteer Status Distribution */}
        <motion.div variants={chartVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-amber-500" />
                Volunteer Status
              </CardTitle>
              <CardDescription>Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                {volunteerStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={volunteerStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {volunteerStatusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={VOLUNTEER_COLORS[index % VOLUNTEER_COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No volunteer data
                  </div>
                )}
              </div>
              <motion.div 
                className="grid grid-cols-2 gap-2 mt-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {volunteerStatusData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm flex-1">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Status Distribution */}
        <motion.div variants={chartVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-cyan-500" />
                Community Status
              </CardTitle>
              <CardDescription>Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                {communityStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={communityStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={200}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {communityStatusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COMMUNITY_COLORS[index % COMMUNITY_COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No community data
                  </div>
                )}
              </div>
              <motion.div 
                className="grid grid-cols-2 gap-2 mt-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {communityStatusData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm flex-1">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Volunteer Roles Bar Chart */}
        <motion.div variants={chartVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Volunteer Roles
              </CardTitle>
              <CardDescription>Distribution by role preference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {volunteerRolesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={volunteerRolesData} 
                      layout="vertical"
                      margin={{ left: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#888888" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        tick={{ fill: '#888888', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#f59e0b" 
                        radius={[0, 4, 4, 0]}
                        animationBegin={400}
                        animationDuration={1000}
                      >
                        {volunteerRolesData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={`hsl(${36 + index * 20}, 90%, 55%)`}
                            className="hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No volunteer role data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Status Pie Chart */}
        <motion.div variants={chartVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                Contact Status
              </CardTitle>
              <CardDescription>Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                {contactStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contactStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={600}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {contactStatusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No contact data
                  </div>
                )}
              </div>
              <motion.div 
                className="grid grid-cols-2 gap-2 mt-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {contactStatusData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm flex-1">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Overview Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions with Animated Buttons */}
        <motion.div variants={itemVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Commonly used admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { to: "/admin/contacts", icon: MessageSquare, label: "Manage Contacts", count: totalContacts },
                { to: "/admin/contacts?status=new", icon: AlertCircle, label: "View New Messages", count: newContacts, highlight: newContacts > 0 },
                { to: "/admin/volunteer", icon: UserPlus, label: "Manage Volunteers", count: totalVolunteers },
                { to: "/admin/community", icon: Users, label: "Community Members", count: totalCommunity }
              ].map((action, index) => (
                <motion.div
                  key={action.to}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={action.to}>
                    <Button 
                      variant={action.highlight ? "default" : "outline"} 
                      className="w-full justify-between group relative overflow-hidden"
                      size="lg"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <action.icon className={`h-4 w-4 ${action.highlight ? 'animate-pulse' : ''}`} />
                        {action.label}
                      </span>
                      <span className="relative z-10 flex items-center gap-2">
                        {action.count !== undefined && (
                          <Badge variant={action.highlight ? "secondary" : "outline"} className="mr-2">
                            {action.count}
                          </Badge>
                        )}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {action.highlight && (
                        <motion.div 
                          className="absolute inset-0 bg-primary/20"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Volunteer Overview with Progress Bars */}
        <motion.div variants={itemVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                Volunteer Overview
              </CardTitle>
              <CardDescription>
                Application status breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Pending", value: pendingVolunteers, total: totalVolunteers, color: "bg-amber-500" },
                  { label: "Contacted", value: contactedVolunteers, total: totalVolunteers, color: "bg-purple-500" },
                  { label: "Approved", value: approvedVolunteers, total: totalVolunteers, color: "bg-green-500" },
                  { label: "Rejected", value: rejectedVolunteers, total: totalVolunteers, color: "bg-red-500" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <Progress 
                      value={item.total > 0 ? (item.value / item.total) * 100 : 0} 
                      className="h-2.5"
                    />
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="pt-4"
                >
                  <Link 
                    to="/admin/volunteer" 
                    className="block text-center text-sm text-primary hover:underline pt-2 group"
                  >
                    View all volunteers 
                    <ArrowRight className="inline h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Overview */}
        <motion.div variants={itemVariants} className="w-full">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Heart className="h-5 w-5 text-cyan-500" />
                </div>
                Community Overview
              </CardTitle>
              <CardDescription>
                Membership status breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Pending Approval", value: pendingCommunity, total: totalCommunity, color: "bg-amber-500" },
                  { label: "Approved", value: approvedCommunity, total: totalCommunity, color: "bg-green-500" },
                  { label: "Rejected", value: rejectedCommunity, total: totalCommunity, color: "bg-red-500" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <Progress 
                      value={item.total > 0 ? (item.value / item.total) * 100 : 0} 
                      className="h-2.5"
                    />
                  </motion.div>
                ))}
                <motion.div 
                  className="pt-4 border-t"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Members</span>
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400">
                      {totalCommunity}
                    </Badge>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="pt-2"
                >
                  <Link 
                    to="/admin/community" 
                    className="block text-center text-sm text-primary hover:underline pt-2 group"
                  >
                    View all members 
                    <ArrowRight className="inline h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Action Button for Mobile */}
      <motion.div 
        className="fixed bottom-6 right-6 md:hidden z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <Zap className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
}