import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mail, 
  Database,
  Key,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Lock,
  Link,
  Code,
  Server,
  Cloud,
  HardDrive,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { settingsApi, Setting, SettingsStats } from '@/services/settingsApi';
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

const AdminSettings = () => {
  const { admin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch settings data
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => settingsApi.getSettings(),
  });

  // Fetch stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['settingsStats'],
    queryFn: () => settingsApi.getStats(),
  });

  // Update setting mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => 
      settingsApi.updateSetting(key, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      queryClient.invalidateQueries({ queryKey: ['settingsStats'] });
      toast.success('Setting updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update setting');
    }
  });

  // Seed settings mutation
  const seedMutation = useMutation({
    mutationFn: () => settingsApi.seedSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      queryClient.invalidateQueries({ queryKey: ['settingsStats'] });
      toast.success('Default settings seeded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to seed settings');
    }
  });

  const settings: Setting[] = settingsData?.data || [];
  const stats: SettingsStats = statsData?.data || { 
    total: 0, 
    byCategory: [], 
    activeNotifications: 0, 
    activeIntegrations: 0 
  };

  // Get setting value by key
  const getSettingValue = (key: string, defaultValue: unknown = false): unknown => {
    const setting = settings.find(s => s.key === key);
    return setting?.value ?? defaultValue;
  };

  // Group settings by category
  const getSettingsByCategory = (category: string): Setting[] => {
    return settings.filter(s => s.category === category);
  };

  // Handle toggle change
  const handleToggle = (key: string, currentValue: boolean) => {
    updateMutation.mutate({ key, value: !currentValue });
  };

  // Handle input change
  const handleInputChange = async (key: string, value: string) => {
    setSavingSettings(true);
    try {
      await updateMutation.mutateAsync({ key, value });
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    if (newTheme !== theme) {
      toggleTheme();
      updateMutation.mutate({ key: 'theme_mode', value: newTheme });
    }
  };

  // Check if settings are empty and seed them
  useEffect(() => {
    if (!settingsLoading && settings.length === 0) {
      seedMutation.mutate();
    }
  }, [settingsLoading]);

  const renderSettingItem = (setting: Setting) => {
    const value = setting.value;
    
    return (
      <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
            {setting.category === 'general' && <Globe className="h-5 w-5" />}
            {setting.category === 'notifications' && <Bell className="h-5 w-5" />}
            {setting.category === 'security' && <Shield className="h-5 w-5" />}
            {setting.category === 'appearance' && <Palette className="h-5 w-5" />}
            {setting.category === 'integrations' && <Link className="h-5 w-5" />}
            {setting.category === 'backup' && <Database className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-semibold">{setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p className="text-sm text-muted-foreground">{setting.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {setting.type === 'boolean' ? (
            <Switch 
              checked={Boolean(value)} 
              onCheckedChange={() => handleToggle(setting.key, Boolean(value))}
              disabled={updateMutation.isPending}
            />
          ) : setting.type === 'number' ? (
            <Input 
              type="number" 
              value={String(value)} 
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="w-24"
              disabled={updateMutation.isPending}
            />
          ) : (
            <Input 
              type={setting.key.includes('color') ? 'color' : 'text'} 
              value={String(value)} 
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="w-40"
              disabled={updateMutation.isPending}
            />
          )}
        </div>
      </div>
    );
  };

  const categoryStats = [
    { 
      title: 'General', 
      value: `${getSettingsByCategory('general').length} settings`, 
      icon: Settings, 
      color: 'from-blue-500 to-cyan-500',
      tab: 'general'
    },
    { 
      title: 'Notifications', 
      value: `${stats.activeNotifications} active`, 
      icon: Bell, 
      color: 'from-purple-500 to-pink-500',
      tab: 'notifications'
    },
    { 
      title: 'Security', 
      value: 'Protected', 
      icon: Shield, 
      color: 'from-green-500 to-emerald-500',
      tab: 'security'
    },
    { 
      title: 'Integrations', 
      value: `${stats.activeIntegrations} connected`, 
      icon: Link, 
      color: 'from-orange-500 to-red-500',
      tab: 'integrations'
    }
  ];

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
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your application settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
          >
            {seedMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Reset Defaults
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['adminSettings'] })}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryStats.map((stat, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all hover:shadow-lg ${activeTab === stat.tab ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActiveTab(stat.tab)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{statsLoading ? '...' : stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Settings Tabs */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Customize and configure your application settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {settingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 flex flex-wrap h-auto">
                  <TabsTrigger value="general" className="gap-2">
                    <Settings className="h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="gap-2">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="gap-2">
                    <Link className="h-4 w-4" />
                    Integrations
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="gap-2">
                    <Database className="h-4 w-4" />
                    Backup
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-0">
                  <div className="space-y-4">
                    {getSettingsByCategory('general').length > 0 ? (
                      getSettingsByCategory('general').map(renderSettingItem)
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No general settings available</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-4">
                    {getSettingsByCategory('notifications').length > 0 ? (
                      getSettingsByCategory('notifications').map(renderSettingItem)
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No notification settings available</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="space-y-4">
                    {getSettingsByCategory('security').length > 0 ? (
                      getSettingsByCategory('security').map(renderSettingItem)
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No security settings available</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                  <div className="space-y-4">
                    {getSettingsByCategory('appearance').length > 0 ? (
                      getSettingsByCategory('appearance').map(renderSettingItem)
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No appearance settings available</p>
                    )}
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                          {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">Theme</h3>
                          <p className="text-sm text-muted-foreground">Your current theme preference</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={theme === 'light' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => handleThemeChange('light')}
                          className="gap-1"
                        >
                          <Sun className="h-4 w-4" />
                          Light
                        </Button>
                        <Button 
                          variant={theme === 'dark' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => handleThemeChange('dark')}
                          className="gap-1"
                        >
                          <Moon className="h-4 w-4" />
                          Dark
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="mt-0">
                  <div className="space-y-4">
                    {getSettingsByCategory('integrations').length > 0 ? (
                      getSettingsByCategory('integrations').map(renderSettingItem)
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No integration settings available</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="backup" className="mt-0">
                  <div className="space-y-4">
                    {getSettingsByCategory('backup').length > 0 ? (
                      getSettingsByCategory('backup').map(renderSettingItem)
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No backup settings available</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* System Info */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Server className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">System Version</h3>
              <p className="text-sm text-muted-foreground">v2.0.0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Server Status</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Database</h3>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminSettings;
