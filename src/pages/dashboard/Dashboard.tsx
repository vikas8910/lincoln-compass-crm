
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import LeadsByStatus from "@/components/dashboard/LeadsByStatus";
import LeadsBySource from "@/components/dashboard/LeadsBySource";
import RecentLeads from "@/components/dashboard/RecentLeads";
import { LayoutDashboard, Users, UserRound, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Total Leads",
      value: "3,210",
      change: "+12%",
      isIncreasing: true,
      icon: Users,
    },
    {
      title: "New Leads",
      value: "120",
      change: "+4%",
      isIncreasing: true,
      icon: UserRound,
    },
    {
      title: "Conversion Rate",
      value: "24%",
      change: "-2%",
      isIncreasing: false,
      icon: LayoutDashboard,
    },
    {
      title: "Avg Conversion Time",
      value: "7 days",
      change: "+1 day",
      isIncreasing: false,
      icon: LayoutDashboard,
    },
  ];

  // Mock data for LeadsByStatus chart
  const leadsByStatusData = [
    { name: "New", value: 45, color: "#4F46E5" },
    { name: "Contacted", value: 30, color: "#8B5CF6" },
    { name: "Qualified", value: 15, color: "#F59E0B" },
    { name: "Negotiation", value: 8, color: "#F97316" },
    { name: "Won", value: 5, color: "#10B981" },
    { name: "Lost", value: 2, color: "#EF4444" },
  ];

  // Mock data for LeadsBySource chart
  const leadsBySourceData = [
    { name: "Website", value: 45 },
    { name: "Referral", value: 25 },
    { name: "Social Media", value: 15 },
    { name: "Email Campaign", value: 10 },
    { name: "Cold Call", value: 5 },
  ];

  // Mock data for RecentLeads - with properly typed status values
  const recentLeadsData = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      company: "Acme Inc",
      status: "New" as const,
      date: "2023-05-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "123-456-7891",
      company: "Globex Corp",
      status: "Contacted" as const,
      date: "2023-04-28",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "123-456-7892",
      company: "Initech",
      status: "Qualified" as const,
      date: "2023-04-25",
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily@example.com",
      phone: "123-456-7893",
      company: "Massive Dynamic",
      status: "Negotiation" as const,
      date: "2023-04-20",
    },
    {
      id: "5",
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "123-456-7894",
      company: "Soylent Corp",
      status: "Won" as const,
      date: "2023-04-15",
    },
  ];

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isIncreasing={stat.isIncreasing}
            icon={stat.icon}
          />
        ))}
      </div>

      <Tabs defaultValue="salesOfficers" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto md:h-10">
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger value="salesOfficers">Sales Officers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leads by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadsByStatus data={leadsByStatusData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leads by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadsBySource data={leadsBySourceData} />
              </CardContent>
            </Card>
          </div>
          
          <RecentLeads leads={recentLeadsData} />
        </TabsContent>

        <TabsContent value="salesOfficers">
          <Card>
            <CardHeader>
              <CardTitle>Sales Officers Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your sales officers, view their performance, and assign leads.
              </p>
              <Button asChild>
                <Link to="/sales-officers">
                  View All Sales Officers
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Leads Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage all leads, track their progress through the pipeline, and assign them to sales officers.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/leads">
                    View All Leads
                  </Link>
                </Button>
                {/* <Button asChild variant="outline">
                  <Link to="/lead-pipeline">
                    Lead Pipeline
                  </Link>
                </Button> */}
                <Button asChild variant="outline">
                  <Link to="/lead-assignment">
                    Lead Assignment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage user roles and permissions to control access to various features of the system.
              </p>
              <Button asChild>
                <Link to="/roles-permissions">
                  Manage Roles & Permissions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Dashboard;
