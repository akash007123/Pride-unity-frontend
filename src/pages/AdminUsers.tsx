import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi, Admin } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, MoreHorizontal, Shield, ShieldAlert, UserPlus, Users, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X, Lock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const roleColors: Record<string, string> = {
  'Admin': 'bg-red-100 text-red-800 hover:bg-red-200',
  'Sub Admin': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Volunteer': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Member': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

const AdminUsers: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { admin: currentAdmin } = useAuth();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Admin | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    role: '' as string,
    status: '' as string,
    profilePic: '',
    newPassword: '',
  });
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getAllAdmins();
      if (response.success) {
        // Transform _id to id for MongoDB documents
        const transformedAdmins = response.data.admins.map((admin: Admin & { _id?: string }) => ({
          ...admin,
          id: admin._id || admin.id
        }));
        setAdmins(transformedAdmins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admin users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase()) ||
      admin.username.toLowerCase().includes(search.toLowerCase()) ||
      admin.role.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <ShieldAlert className="h-4 w-4 mr-1" />;
      case 'Sub Admin':
        return <Shield className="h-4 w-4 mr-1" />;
      default:
        return <UserPlus className="h-4 w-4 mr-1" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if current user can modify target user
  const canModifyUser = (user: Admin): boolean => {
    // Can't modify yourself
    if (user.id === currentAdmin?.id) return false;
    // Admins can modify anyone below them
    if (currentAdmin?.role === 'Admin') return true;
    // Sub Admins can only modify Volunteers and Members
    if (currentAdmin?.role === 'Sub Admin') {
      return user.role === 'Volunteer' || user.role === 'Member';
    }
    return false;
  };

  // Handle view user profile
  const handleView = (user: Admin) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Handle edit user
  const handleEdit = (user: Admin) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      status: user.isActive ? 'Active' : 'Inactive',
      profilePic: user.profilePic || '',
      newPassword: '',
    });
    setProfilePicFile(null);
    setEditModalOpen(true);
  };

  // Handle toggle user status (activate/deactivate)
  const handleToggleStatus = async (user: Admin) => {
    if (!user.id) return;
    
    setIsProcessing(true);
    try {
      const response = await authApi.toggleAdminStatus(user.id);
      if (response.success) {
        toast.success(response.message);
        fetchAdmins();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete user
  const handleDelete = (user: Admin) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Confirm delete user
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const response = await authApi.deleteAdmin(selectedUser.id);
      if (response.success) {
        toast.success('Admin deleted successfully');
        fetchAdmins();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsProcessing(false);
      setDeleteDialogOpen(false);
    }
  };

  // Save edited user
  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const updateData: {
        name: string;
        mobile: string;
        role: string;
        isActive: boolean;
        newPassword?: string;
      } = {
        name: editForm.name,
        mobile: editForm.mobile,
        role: editForm.role,
        isActive: editForm.status === 'Active',
      };

      // Only include newPassword if it's not empty and meets minimum length
      const trimmedPassword = editForm.newPassword?.trim() || '';
      if (trimmedPassword.length >= 8) {
        updateData.newPassword = trimmedPassword;
      } else if (trimmedPassword.length > 0 && trimmedPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        setIsProcessing(false);
        return;
      }

      const response = await authApi.updateAdmin(
        selectedUser.id,
        updateData,
        profilePicFile || undefined
      );
      if (response.success) {
        toast.success('Admin updated successfully');
        fetchAdmins();
        setEditModalOpen(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin users and their roles</p>
        </div>
        <Button asChild>
          <Link to="/admin/register">
            <Plus className="h-4 w-4 mr-2" />
            Add New Admin
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            All Admin Users
          </CardTitle>
          <CardDescription>
            View and manage all registered admin users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, username, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={admin.profilePic} alt={admin.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(admin.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {admin.name}
                            {admin.id === currentAdmin?.id && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">@{admin.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.mobile}</TableCell>
                    <TableCell>
                      <Badge className={`${roleColors[admin.role] || 'bg-gray-100'} flex items-center w-fit`}>
                        {getRoleIcon(admin.role)}
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString('en-US', {
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
                          <DropdownMenuItem onClick={() => handleView(admin)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(admin)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          {canModifyUser(admin) && (
                            <>
                              <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                                {admin.isActive ? (
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
                              <DropdownMenuItem onClick={() => handleDelete(admin)} className="text-red-600">
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
        </CardContent>
      </Card>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Admin', 'Sub Admin', 'Volunteer', 'Member'].map((role) => {
          const count = admins.filter((a) => a.role === role).length;
          return (
            <Card key={role}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{role}</CardTitle>
                {getRoleIcon(role)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {count === 1 ? 'user' : 'users'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Profile Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View details of the selected admin user
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
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mobile</Label>
                  <p className="font-medium">{selectedUser.mobile}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joined</Label>
                  <p className="font-medium">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
                {selectedUser.lastLogin && (
                  <div>
                    <Label className="text-muted-foreground">Last Login</Label>
                    <p className="font-medium">
                      {new Date(selectedUser.lastLogin).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details of the selected admin user
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mobile">Mobile</Label>
              <Input
                id="edit-mobile"
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-profilePic">Profile Picture</Label>
              <Input
                id="edit-profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProfilePicFile(file);
                }}
              />
              {selectedUser?.profilePic && !profilePicFile && (
                <p className="text-xs text-muted-foreground">
                  Current: {selectedUser.profilePic}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger>
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
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">New Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.newPassword}
                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                placeholder="Enter new password (min 8 characters)"
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
            <AlertDialogTitle>Delete Admin User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
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
    </div>
  );
};

export default AdminUsers;
