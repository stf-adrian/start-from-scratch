import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'

interface LoginLogEntry {
    id: string
    userId: string
    loginTimestamp: string
    ipAddress: string | null
    userAgent: string | null
    country: string | null
    city: string | null
    device: string | null
    browser: string | null
    success: boolean
}

export function LoginHistoryTable() {
    const [loginHistory, setLoginHistory] = useState<LoginLogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLoginHistory = async () => {
            try {
                setLoading(true)
                const response = await api.get('/login-history')
                setLoginHistory(response.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchLoginHistory()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    const truncateText = (text: string | null, maxLength: number = 30) => {
        if (!text) return 'N/A'
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Login History</CardTitle>
                    <CardDescription>Recent login attempts and details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-muted-foreground">Loading...</div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Login History</CardTitle>
                    <CardDescription>Recent login attempts and details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-destructive">Error: {error}</div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>
                    Last {loginHistory.length} login attempts with complete details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableCaption>Complete login history with all tracked fields</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Date/Time</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Browser</TableHead>
                                <TableHead>User Agent</TableHead>
                                <TableHead>Success</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loginHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                        No login history found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loginHistory.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-mono text-xs">
                                            {entry.id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(entry.loginTimestamp)}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {entry.ipAddress || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.country || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.city || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.device || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.browser || 'N/A'}
                                        </TableCell>
                                        <TableCell className="max-w-[200px]">
                                            <span
                                                title={entry.userAgent || 'N/A'}
                                                className="text-xs text-muted-foreground"
                                            >
                                                {truncateText(entry.userAgent, 40)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${entry.success
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {entry.success ? 'Success' : 'Failed'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}