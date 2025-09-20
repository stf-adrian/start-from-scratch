import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginChart } from '@/components/LoginChart';
import { LoginHistoryTable } from '@/components/LoginHistoryTable';

import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-center min-h-screen">
                    <Alert>
                        <AlertDescription>Loading user information...</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.username}!</h1>
                        <p className="text-muted-foreground">
                            View your account information and manage your profile
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline">
                        Sign Out
                    </Button>
                </div>

                {/* User Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your basic account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{user.id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Username</label>
                                <p className="text-sm mt-1">{user.username}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <p className="text-sm mt-1">{user.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Information</CardTitle>
                            <CardDescription>Your account activity and timestamps</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                                <p className="text-sm mt-1">{formatDate(user.createdAt)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                                <p className="text-sm mt-1">{formatDate(user.lastLogin)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                <p className="text-sm mt-1">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Login Analytics Chart */}
                <div className="mb-8">
                    <LoginChart />
                </div>

                {/* Login History Table */}
                <div className="mb-8">
                    <LoginHistoryTable />
                </div>

                {/* Additional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>About This Application</CardTitle>
                        <CardDescription>Information about the Start From Scratch platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-sm text-muted-foreground mb-4">
                                This application demonstrates a complete authentication system with user registration,
                                login, and profile management. Your account metadata is securely stored and displayed here
                                for your reference.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Secure Authentication</h4>
                                    <p className="text-xs text-muted-foreground">
                                        JWT-based authentication with password hashing using bcrypt
                                    </p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Data Protection</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Your personal information is encrypted and securely stored
                                    </p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Activity Tracking</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Login times and account activity are logged for your security
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;