import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { useEvents } from "@/features/events/hooks/useEvents";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";

/**
 * Database Test Page
 * Tests Supabase database connectivity and displays real-time query results
 */
const DatabaseTest = () => {
  const dashboardStats = useDashboardStats();
  const eventsQuery = useEvents();

  const tests = [
    {
      name: "Dashboard Stats Query",
      status: dashboardStats.isLoading ? "loading" : dashboardStats.error ? "error" : "success",
      error: dashboardStats.error?.message,
      data: {
        totalEvents: dashboardStats.totalEvents,
        totalBookings: dashboardStats.totalBookings,
        totalTickets: dashboardStats.totalTickets,
      }
    },
    {
      name: "Events Query",
      status: eventsQuery.isLoading ? "loading" : eventsQuery.error ? "error" : "success",
      error: eventsQuery.error?.message,
      data: {
        eventsCount: eventsQuery.data?.length || 0,
        events: eventsQuery.data?.map(e => ({ id: e.id, name: e.name, status: e.status })) || [],
      }
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Database Integration Test</h1>
          <p className="text-muted-foreground">
            Testing Supabase database connectivity and query execution
          </p>
        </div>

        <div className="space-y-6">
          {tests.map((test, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {test.status === "loading" && (
                    <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                  )}
                  {test.status === "error" && (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  {test.status === "success" && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {test.status === "loading" ? "Loading..." : test.status === "error" ? "Failed" : "Success"}
                    </p>
                  </div>
                </div>
                {test.name === "Dashboard Stats Query" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dashboardStats.refetch()}
                    disabled={dashboardStats.isLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                )}
                {test.name === "Events Query" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => eventsQuery.refetch()}
                    disabled={eventsQuery.isLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                )}
              </div>

              {test.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-800 mb-1">Error Details:</p>
                  <p className="text-sm text-red-600">{test.error}</p>
                </div>
              )}

              {test.status === "success" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 mb-2">Query Result:</p>
                  <pre className="text-sm text-green-700 overflow-auto">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-lg mb-2 text-blue-900">Test Summary</h3>
          <div className="space-y-2">
            <p className="text-sm text-blue-800">
              <strong>Total Tests:</strong> {tests.length}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Passed:</strong>{" "}
              {tests.filter((t) => t.status === "success").length}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Failed:</strong>{" "}
              {tests.filter((t) => t.status === "error").length}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Loading:</strong>{" "}
              {tests.filter((t) => t.status === "loading").length}
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Button onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
