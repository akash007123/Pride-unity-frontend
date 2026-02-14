import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
  UserCheck
} from 'lucide-react';
import { contactApi } from '@/services/contactApi';
import { volunteerApi } from '@/services/volunteerApi';
import { communityApi } from '@/services/communityApi';
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
  Legend
} from 'recharts';

export default function AdminDashboard() {
  // Contact Stats
  const { data: contactStats, isLoading: contactLoading } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  // Volunteer Stats
  const { data: volunteerStats, isLoading: volunteerLoading } = useQuery({
    queryKey: ['volunteerStats'],
    queryFn: () => volunteerApi.getStats(),
  });

  // Community Stats
  const { data: communityStats, isLoading: communityLoading } = useQuery({
    queryKey: ['communityStats'],
    queryFn: () => communityApi.getStats(),
  });

  // Extract contact data
  const totalContacts = contactStats?.data?.total || 0;
  const newContacts = contactStats?.data?.byStatus?.new || 0;
  const readContacts = contactStats?.data?.byStatus?.read || 0;
  const repliedContacts = contactStats?.data?.byStatus?.replied || 0;
  const archivedContacts = contactStats?.data?.byStatus?.archived || 0;

  // Extract volunteer data
  const totalVolunteers = volunteerStats?.data?.total || 0;
  const pendingVolunteers = volunteerStats?.data?.byStatus?.pending || 0;
  const approvedVolunteers = volunteerStats?.data?.byStatus?.approved || 0;
  const contactedVolunteers = volunteerStats?.data?.byStatus?.contacted || 0;
  const rejectedVolunteers = volunteerStats?.data?.byStatus?.rejected || 0;

  // Extract community data
  const totalCommunity = communityStats?.data?.total || 0;
  const pendingCommunity = communityStats?.data?.byStatus?.pending || 0;
  const approvedCommunity = communityStats?.data?.byStatus?.approved || 0;
  const rejectedCommunity = communityStats?.data?.byStatus?.rejected || 0;

  // Volunteer roles for pie chart
  const volunteerRolesData = volunteerStats?.data?.byRoles 
    ? Object.entries(volunteerStats.data.byRoles).map(([name, value]) => ({
        name: name === 'events' ? 'Event Planning' : 
              name === 'outreach' ? 'Community Outreach' : 
              name === 'tech' ? 'Technical' : 
              name === 'creative' ? 'Creative' : name,
        value,
      }))
    : [];

  // Community education for pie chart
  const communityEducationData = communityStats?.data?.byEducation
    ? Object.entries(communityStats.data.byEducation).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  // Weekly activity data (sample - could be enhanced with API)
  const weeklyData = [
    { name: 'Mon', contacts: 12 },
    { name: 'Tue', contacts: 19 },
    { name: 'Wed', contacts: 15 },
    { name: 'Thu', contacts: 22 },
    { name: 'Fri', contacts: 18 },
    { name: 'Sat', contacts: 8 },
    { name: 'Sun', contacts: 5 },
  ];

  // Volunteer status for pie chart
  const volunteerStatusData = [
    { name: 'Pending', value: pendingVolunteers, color: '#f59e0b' },
    { name: 'Contacted', value: contactedVolunteers, color: '#8b5cf6' },
    { name: 'Approved', value: approvedVolunteers, color: '#10b981' },
    { name: 'Rejected', value: rejectedVolunteers, color: '#ef4444' },
  ];

  // Community status for pie chart
  const communityStatusData = [
    { name: 'Pending', value: pendingCommunity, color: '#f59e0b' },
    { name: 'Approved', value: approvedCommunity, color: '#10b981' },
    { name: 'Rejected', value: rejectedCommunity, color: '#ef4444' },
  ];

  // Contact status for pie chart
  const contactStatusData = [
    { name: 'New', value: newContacts, color: '#3b82f6' },
    { name: 'Read', value: readContacts, color: '#8b5cf6' },
    { name: 'Replied', value: repliedContacts, color: '#10b981' },
    { name: 'Archived', value: archivedContacts, color: '#6b7280' },
  ];

  const responseRate = totalContacts > 0 
    ? Math.round((repliedContacts / totalContacts) * 100) 
    : 0;

  const volunteerApprovalRate = totalVolunteers > 0 
    ? Math.round((approvedVolunteers / totalVolunteers) * 100) 
    : 0;

  const communityApprovalRate = totalCommunity > 0 
    ? Math.round((approvedCommunity / totalCommunity) * 100) 
    : 0;

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#6b7280', '#f59e0b', '#ef4444'];
  const VOLUNTEER_COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];
  const COMMUNITY_COLORS = ['#f59e0b', '#10b981', '#ef4444'];

  const isLoading = contactLoading || volunteerLoading || communityLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Header with Date */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome back, Admin
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5">
            <Activity className="h-3.5 w-3.5 mr-1" />
            System Status: <span className="ml-1 text-green-600 font-medium">Operational</span>
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards - Contacts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalContacts}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newContacts}</div>
            <div className="flex items-center mt-1">
              <Clock className="h-3 w-3 text-amber-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                Awaiting response
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{repliedContacts}</div>
            <div className="flex items-center mt-1">
              <div className="w-full max-w-[100px]">
                <Progress value={responseRate} className="h-1.5" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {responseRate}% rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Settings className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{archivedContacts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((archivedContacts / totalContacts) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Cards - Volunteers & Community */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVolunteers}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                {pendingVolunteers} pending applications
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Volunteers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedVolunteers}</div>
            <div className="flex items-center mt-1">
              <div className="w-full max-w-[100px]">
                <Progress value={volunteerApprovalRate} className="h-1.5" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {volunteerApprovalRate}% approved
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Members</CardTitle>
            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
              <Heart className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCommunity}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-muted-foreground">
                {pendingCommunity} pending approval
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedCommunity}</div>
            <div className="flex items-center mt-1">
              <div className="w-full max-w-[100px]">
                <Progress value={communityApprovalRate} className="h-1.5" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {communityApprovalRate}% approved
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Activity Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contact Activity</CardTitle>
                <CardDescription>Weekly contact submissions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="contacts" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorContacts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={volunteerStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {volunteerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={VOLUNTEER_COLORS[index % VOLUNTEER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {volunteerStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Community Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={communityStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {communityStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COMMUNITY_COLORS[index % COMMUNITY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {communityStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts - Volunteer Roles & Contact Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Volunteer Roles Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Roles</CardTitle>
            <CardDescription>Distribution by role preference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {volunteerRolesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volunteerRolesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
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

        {/* Contact Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contactStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contactStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {contactStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Education Distribution */}
      {communityEducationData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Community Education</CardTitle>
              <CardDescription>Distribution by education background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={communityEducationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats Summary</CardTitle>
              <CardDescription>Overview of all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Contacts</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{totalContacts}</div>
                    <div className="text-xs text-muted-foreground">{responseRate}% response rate</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">Volunteers</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{totalVolunteers}</div>
                    <div className="text-xs text-muted-foreground">{approvedVolunteers} approved</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-cyan-600" />
                    <span className="font-medium">Community</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{totalCommunity}</div>
                    <div className="text-xs text-muted-foreground">{approvedCommunity} active</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription>
              Commonly used admin tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/contacts">
              <Button className="w-full justify-between group" size="lg">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Manage Contacts
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/admin/contacts?status=new">
              <Button variant="outline" className="w-full justify-between group" size="lg">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  View New Messages ({newContacts})
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/admin/volunteers">
              <Button variant="outline" className="w-full justify-between group" size="lg">
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Manage Volunteers ({totalVolunteers})
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/admin/community">
              <Button variant="outline" className="w-full justify-between group" size="lg">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community Members ({totalCommunity})
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Volunteer Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <UserCheck className="h-5 w-5 text-amber-500" />
              </div>
              Volunteer Overview
            </CardTitle>
            <CardDescription>
              Application status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium">{pendingVolunteers}</span>
                </div>
                <Progress value={totalVolunteers > 0 ? (pendingVolunteers / totalVolunteers) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Contacted</span>
                  <span className="font-medium">{contactedVolunteers}</span>
                </div>
                <Progress value={totalVolunteers > 0 ? (contactedVolunteers / totalVolunteers) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-medium">{approvedVolunteers}</span>
                </div>
                <Progress value={volunteerApprovalRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="font-medium">{rejectedVolunteers}</span>
                </div>
                <Progress value={totalVolunteers > 0 ? (rejectedVolunteers / totalVolunteers) * 100 : 0} className="h-2" />
              </div>
              <Link 
                to="/admin/volunteers" 
                className="block text-center text-sm text-primary hover:underline pt-2"
              >
                View all volunteers →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Community Status Overview */}
        <Card>
          <CardHeader>
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
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Pending Approval</span>
                  <span className="font-medium">{pendingCommunity}</span>
                </div>
                <Progress value={totalCommunity > 0 ? (pendingCommunity / totalCommunity) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-medium">{approvedCommunity}</span>
                </div>
                <Progress value={communityApprovalRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="font-medium">{rejectedCommunity}</span>
                </div>
                <Progress value={totalCommunity > 0 ? (rejectedCommunity / totalCommunity) * 100 : 0} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Members</span>
                  <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                    {totalCommunity}
                  </Badge>
                </div>
              </div>
              <Link 
                to="/admin/community" 
                className="block text-center text-sm text-primary hover:underline pt-2"
              >
                View all members →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
