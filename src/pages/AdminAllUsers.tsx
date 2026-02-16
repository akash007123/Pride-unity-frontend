import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { authApi, Admin } from '@/services/authApi';
import { communityApi, CommunityMember } from '@/services/communityApi';
import { volunteerApi, Volunteer } from '@/services/volunteerApi';
import { contactApi, Contact } from '@/services/contactApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, MoreHorizontal, Shield, ShieldAlert, UserPlus, Users, Mail, CircleUser, Filter, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X, Lock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Unified user type for display
type UnifiedUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'Admin' | 'Sub Admin' | 'Community Member' | 'Volunteer' | 'Contact';
  status: string;
  createdAt: string;
  source: 'admin' | 'community' | 'volunteer' | 'contact';
  profilePic?: string;
  notes?: string;
};

const roleColors: Record<string, string> = {
  'Admin': 'bg-red-100 text-red-800 hover:bg-red-200',
  'Sub Admin': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Community Member': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Volunteer': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  'Contact': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

const statusColors: Record<string, string> = {
  // Admin status
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-gray-100 text-gray-800',
  // Community status
  'pending': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'archived': 'bg-gray-100 text-gray-800',
  // Volunteer status
  'contacted': 'bg-blue-100 text-blue-800',
  // Contact status
  'new': 'bg-red-100 text-red-800',
  'read': 'bg-blue-100 text-blue-800',
  'replied': 'bg-green-100 text-green-800',
};

const AdminAllUsers: React.FC = () => {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UnifiedUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    role: '',
    status: '',
    notes: ''
  });

  // Add user form state
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    username: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'Member'
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all user types in parallel
      const [adminsRes, communityRes, volunteersRes, contactsRes] = await Promise.allSettled([
        authApi.getAllAdmins(),
        communityApi.getMembers({ limit: 1000 }),
        volunteerApi.getVolunteers({ limit: 1000 }),
        contactApi.getContacts({ limit: 1000 })
      ]);

      // Handle admins response
      if (adminsRes.status === 'fulfilled') {
        const data = adminsRes.value;
        if (data.success && data.data?.admins) {
          setAdmins(data.data.admins);
        } else {
          console.warn('Admins response missing data:', data);
        }
      } else if (adminsRes.status === 'rejected') {
        console.error('Admins fetch rejected:', adminsRes.reason);
      }

      // Handle community members response
      if (communityRes.status === 'fulfilled') {
        const data = communityRes.value;
        // API returns { success: true, data: [...], pagination: {...} }
        if (Array.isArray(data.data)) {
          setCommunityMembers(data.data);
        } else {
          console.warn('Community members response missing data array:', data);
        }
      } else if (communityRes.status === 'rejected') {
        console.error('Community members fetch rejected:', communityRes.reason);
      }

      // Handle volunteers response
      if (volunteersRes.status === 'fulfilled') {
        const data = volunteersRes.value;
        // API returns { success: true, data: [...], pagination: {...} }
        if (Array.isArray(data.data)) {
          setVolunteers(data.data);
        } else {
          console.warn('Volunteers response missing data array:', data);
        }
      } else if (volunteersRes.status === 'rejected') {
        console.error('Volunteers fetch rejected:', volunteersRes.reason);
      }

      // Handle contacts response
      if (contactsRes.status === 'fulfilled') {
        const data = contactsRes.value;
        // API returns { success: true, data: [...], pagination: {...} }
        if (Array.isArray(data.data)) {
          setContacts(data.data);
        } else {
          console.warn('Contacts response missing data array:', data);
        }
      } else if (contactsRes.status === 'rejected') {
        console.error('Contacts fetch rejected:', contactsRes.reason);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Transform all users into unified format
  const allUsers: UnifiedUser[] = useMemo(() => {
    const users: UnifiedUser[] = [];

    // Add admins
    admins.forEach(admin => {
      users.push({
        id: admin.id,
        name: admin.name || 'Unknown',
        email: admin.email || '',
        mobile: admin.mobile || '',
        role: (admin.role as 'Admin' | 'Sub Admin') || 'Admin',
        status: admin.isActive ? 'Active' : 'Inactive',
        createdAt: admin.createdAt || '',
        source: 'admin',
        profilePic: admin.profilePic
      });
    });

    // Add community members
    communityMembers.forEach(member => {
      users.push({
        id: member.id,
        name: member.name || 'Unknown',
        email: member.email || '',
        mobile: member.mobile || '',
        role: 'Community Member',
        status: member.status || 'pending',
        createdAt: member.createdAt || '',
        source: 'community',
        notes: member.notes
      });
    });

    // Add volunteers
    volunteers.forEach(volunteer => {
      users.push({
        id: volunteer.id,
        name: volunteer.fullName || `${volunteer.firstName || ''} ${volunteer.lastName || ''}`.trim() || 'Unknown',
        email: volunteer.email || '',
        mobile: volunteer.phone || '',
        role: 'Volunteer',
        status: volunteer.status || 'pending',
        createdAt: volunteer.createdAt || '',
        source: 'volunteer',
        notes: volunteer.notes
      });
    });

    // Add contacts
    contacts.forEach(contact => {
      users.push({
        id: contact.id,
        name: contact.name || 'Unknown',
        email: contact.email || '',
        mobile: contact.mobile || '',
        role: 'Contact',
        status: contact.status || 'new',
        createdAt: contact.createdAt || '',
        source: 'contact',
        notes: contact.notes
      });
    });

    return users;
  }, [admins, communityMembers, volunteers, contacts]);

  // Apply filters
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        (user.name?.toLowerCase() || '').includes(searchLower) ||
        (user.email?.toLowerCase() || '').includes(searchLower) ||
        (user.mobile?.toLowerCase() || '').includes(searchLower);
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (user.status?.toLowerCase() || '') === statusFilter.toLowerCase();
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, search, roleFilter, statusFilter]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <ShieldAlert className="h-4 w-4 mr-1" />;
      case 'Sub Admin':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'Community Member':
        return <Users className="h-4 w-4 mr-1" />;
      case 'Volunteer':
        return <UserPlus className="h-4 w-4 mr-1" />;
      case 'Contact':
        return <Mail className="h-4 w-4 mr-1" />;
      default:
        return <CircleUser className="h-4 w-4 mr-1" />;
    }
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  const getSourceLink = (user: UnifiedUser) => {
    switch (user.source) {
      case 'admin':
        return `/admin/users`;
      case 'community':
        return `/admin/community`;
      case 'volunteer':
        return `/admin/volunteer`;
      case 'contact':
        return `/admin/contacts`;
      default:
        return '/admin';
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: allUsers.length,
      admins: allUsers.filter(u => u.role === 'Admin' || u.role === 'Sub Admin').length,
      communityMembers: allUsers.filter(u => u.role === 'Community Member').length,
      volunteers: allUsers.filter(u => u.role === 'Volunteer').length,
      contacts: allUsers.filter(u => u.role === 'Contact').length,
    };
  }, [allUsers]);

  // Modal handlers
  const handleView = (user: UnifiedUser) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user: UnifiedUser) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      notes: user.notes || ''
    });
    setEditModalOpen(true);
  };

  const handleDelete = (user: UnifiedUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (user: UnifiedUser) => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      if (user.source === 'admin') {
        const response = await authApi.toggleAdminStatus(user.id);
        if (response.success) {
          toast.success(response.message);
          fetchAllUsers();
        } else {
          toast.error(response.message);
        }
      } else if (user.source === 'community') {
        const newStatus = user.status === 'active' ? 'archived' : 'approved';
        await communityApi.updateMember(user.id, { status: newStatus });
        toast.success(`Community member ${newStatus === 'approved' ? 'activated' : 'deactivated'} successfully`);
        fetchAllUsers();
      } else if (user.source === 'volunteer') {
        const newStatus = user.status === 'active' ? 'archived' : 'approved';
        await volunteerApi.updateVolunteer(user.id, { status: newStatus });
        toast.success(`Volunteer ${newStatus === 'approved' ? 'activated' : 'deactivated'} successfully`);
        fetchAllUsers();
      } else if (user.source === 'contact') {
        const newStatus = user.status === 'new' ? 'read' : 'archived';
        await contactApi.updateContact(user.id, { status: newStatus });
        toast.success(`Contact status updated successfully`);
        fetchAllUsers();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      if (selectedUser.source === 'admin') {
        const response = await authApi.updateAdmin(selectedUser.id, {
          name: editForm.name,
          mobile: editForm.mobile,
          role: editForm.role,
          isActive: editForm.status === 'Active'
        });
        if (response.success) {
          toast.success('Admin updated successfully');
          fetchAllUsers();
          setEditModalOpen(false);
        } else {
          toast.error(response.message);
        }
      } else if (selectedUser.source === 'community') {
        await communityApi.updateMember(selectedUser.id, {
          status: editForm.status.toLowerCase(),
          notes: editForm.notes
        });
        toast.success('Community member updated successfully');
        fetchAllUsers();
        setEditModalOpen(false);
      } else if (selectedUser.source === 'volunteer') {
        await volunteerApi.updateVolunteer(selectedUser.id, {
          status: editForm.status.toLowerCase(),
          notes: editForm.notes
        });
        toast.success('Volunteer updated successfully');
        fetchAllUsers();
        setEditModalOpen(false);
      } else if (selectedUser.source === 'contact') {
        await contactApi.updateContact(selectedUser.id, {
          status: editForm.status.toLowerCase(),
          notes: editForm.notes
        });
        toast.success('Contact updated successfully');
        fetchAllUsers();
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      if (selectedUser.source === 'admin') {
        const response = await authApi.deleteAdmin(selectedUser.id);
        if (response.success) {
          toast.success('Admin deleted successfully');
          fetchAllUsers();
        } else {
          toast.error(response.message);
        }
      } else if (selectedUser.source === 'community') {
        await communityApi.deleteMember(selectedUser.id);
        toast.success('Community member deleted successfully');
        fetchAllUsers();
      } else if (selectedUser.source === 'volunteer') {
        await volunteerApi.deleteVolunteer(selectedUser.id);
        toast.success('Volunteer deleted successfully');
        fetchAllUsers();
      } else if (selectedUser.source === 'contact') {
        await contactApi.deleteContact(selectedUser.id);
        toast.success('Contact deleted successfully');
        fetchAllUsers();
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddUser = async () => {
    if (!addForm.name || !addForm.email || !addForm.username || !addForm.mobile || !addForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (addForm.password !== addForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (addForm.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await authApi.register({
        name: addForm.name,
        email: addForm.email,
        username: addForm.username,
        mobile: addForm.mobile,
        password: addForm.password,
        confirmPassword: addForm.confirmPassword,
        role: addForm.role as 'Admin' | 'Sub Admin' | 'Volunteer' | 'Member'
      });

      if (response.success) {
        toast.success('User created successfully');
        fetchAllUsers();
        setAddModalOpen(false);
        setAddForm({
          name: '',
          email: '',
          username: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          role: 'Member'
        });
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsProcessing(false);
    }
  };

  const isAdmin = currentAdmin?.role === 'Admin';

  const canModifyUser = (user: UnifiedUser) => {
    // Can't modify yourself
    if (user.source === 'admin' && user.id === currentAdmin?.id) {
      return false;
    }
    return true;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">View and manage all users across the platform</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.communityMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <UserPlus className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.volunteers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CircleUser className="h-5 w-5 mr-2" />
            All Users Table
          </CardTitle>
          <CardDescription>
            View and filter all users from different sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sub Admin">Sub Admin</SelectItem>
                  <SelectItem value="Community Member">Community Member</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                  <SelectItem value="Contact">Contact</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={`${user.source}-${user.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.profilePic} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{user.source}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile || '-'}</TableCell>
                    <TableCell>
                      <Badge className={`${roleColors[user.role] || 'bg-gray-100'} flex items-center w-fit`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[user.status.toLowerCase()] || 'bg-gray-100'} capitalize`}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          {canModifyUser(user) && (
                            <>
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); handleToggleStatus(user); }}>
                                {user.status === 'Active' || user.status === 'approved' ? (
                                  <>
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {allUsers.length} users
            {roleFilter !== 'all' && ` (filtered by ${roleFilter})`}
            {statusFilter !== 'all' && ` (status: ${statusFilter})`}
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.profilePic} alt={selectedUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedUser.source}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mobile</Label>
                  <p className="font-medium">{selectedUser.mobile || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={`${statusColors[selectedUser.status.toLowerCase()] || 'bg-gray-100'} mt-1 capitalize`}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Joined</Label>
                  <p className="font-medium">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                {selectedUser.notes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="font-medium">{selectedUser.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                className="mt-1"
              />
            </div>
            {selectedUser?.source === 'admin' && (
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sub Admin">Sub Admin</SelectItem>
                    <SelectItem value="Volunteer">Volunteer</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {selectedUser?.source === 'admin' ? (
                    <>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </>
                  ) : selectedUser?.source === 'community' || selectedUser?.source === 'volunteer' ? (
                    <>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isProcessing}>
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Only admins can add new users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">Full Name *</Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-email">Email *</Label>
              <Input
                id="add-email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-username">Username *</Label>
              <Input
                id="add-username"
                value={addForm.username}
                onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                placeholder="Enter username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-mobile">Mobile *</Label>
              <Input
                id="add-mobile"
                value={addForm.mobile}
                onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                placeholder="Enter mobile number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="add-role">Role</Label>
              <Select value={addForm.role} onValueChange={(value) => setAddForm({ ...addForm, role: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sub Admin">Sub Admin</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-password">Password *</Label>
              <div className="relative">
                <Input
                  id="add-password"
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Enter password (min 8 characters)"
                  className="mt-1 pr-10"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="add-confirm-password">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="add-confirm-password"
                  type="password"
                  value={addForm.confirmPassword}
                  onChange={(e) => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="mt-1 pr-10"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isProcessing}>
              {isProcessing ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAllUsers;
