import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-6xl mb-4">
                        Start From Scratch
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        A simple web application that allows users to connect and view their account metadata,
                        including registration date, last login, user ID, and other relevant information.
                    </p>
                </div>

                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Get Started</CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full" size="lg">
                            <Link to="/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full" size="lg">
                            <Link to="/register">Create Account</Link>
                        </Button>
                    </CardContent>
                </Card>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="p-6 border rounded-lg">
                            <h3 className="font-semibold mb-2">User Registration</h3>
                            <p className="text-sm text-muted-foreground">
                                Create your account with username, email, and secure password
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h3 className="font-semibold mb-2">Secure Authentication</h3>
                            <p className="text-sm text-muted-foreground">
                                JWT-based authentication with password hashing and validation
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h3 className="font-semibold mb-2">User Dashboard</h3>
                            <p className="text-sm text-muted-foreground">
                                View your profile information including registration date and last login
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;