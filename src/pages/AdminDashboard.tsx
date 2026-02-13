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
  Activity
} from 'lucide-react';
import { contactApi } from '@/services/contactApi';
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
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['contactStats'],
    queryFn: () => contactApi.getStats(),
  });

  const totalContacts = stats?.data?.total || 0;
  const newContacts = stats?.data?.byStatus?.new || 0;
  const readContacts = stats?.data?.byStatus?.read || 0;
  const repliedContacts = stats?.data?.byStatus?.replied || 0;
  const archivedContacts = stats?.data?.byStatus?.archived || 0;

  // Sample data for charts - replace with real data from API
  const weeklyData = [
    { name: 'Mon', contacts: 12 },
    { name: 'Tue', contacts: 19 },
    { name: 'Wed', contacts: 15 },
    { name: 'Thu', contacts: 22 },
    { name: 'Fri', contacts: 18 },
    { name: 'Sat', contacts: 8 },
    { name: 'Sun', contacts: 5 },
  ];

  const statusData = [
    { name: 'New', value: newContacts, color: '#3b82f6' },
    { name: 'Read', value: readContacts, color: '#8b5cf6' },
    { name: 'Replied', value: repliedContacts, color: '#10b981' },
    { name: 'Archived', value: archivedContacts, color: '#6b7280' },
  ];

  const responseRate = totalContacts > 0 
    ? Math.round((repliedContacts / totalContacts) * 100) 
    : 0;

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#6b7280'];

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

      {/* Key Metrics Cards with Enhanced Design */}
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

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contact Activity</CardTitle>
                <CardDescription>Weekly contact submissions</CardDescription>
              </div>
              <Select defaultValue="week">
                <SelectTrigger className="w-[120px]">
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
          <CardContent>
            <div className="h-[300px]">
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

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item, index) => (
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
            <Button variant="outline" className="w-full justify-between" size="lg" disabled>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users Management
              </span>
              <Badge variant="secondary">Soon</Badge>
            </Button>
            <Button variant="outline" className="w-full justify-between" size="lg" disabled>
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Settings
              </span>
              <Badge variant="secondary">Soon</Badge>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest contact submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">John Doe</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Question about membership...
                    </p>
                  </div>
                  <Badge variant="default" className="text-[10px] px-1.5 py-0.5">
                    New
                  </Badge>
                </div>
              ))}
              <Link 
                to="/admin/contacts" 
                className="block text-center text-sm text-primary hover:underline pt-2"
              >
                View all activity →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
              System Overview
            </CardTitle>
            <CardDescription>
              Performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-medium">{responseRate}%</span>
                </div>
                <Progress value={responseRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Read Rate</span>
                  <span className="font-medium">
                    {totalContacts > 0 ? Math.round((readContacts / totalContacts) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={totalContacts > 0 ? (readContacts / totalContacts) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">System Health</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}