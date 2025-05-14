
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import LeadsByStatus from "@/components/dashboard/LeadsByStatus";
import LeadsBySource from "@/components/dashboard/LeadsBySource";
import RecentLeads from "@/components/dashboard/RecentLeads";
import { Users, UserPlus, Briefcase, Calendar } from "lucide-react";

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Total Leads",
      value: "3,210",
      change: "+12%",
      isIncreasing: true,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "New Leads",
      value: "120",
      change: "+4%",
      isIncreasing: true,
      icon: <UserPlus className="h-6 w-6" />,
    },
    {
      title: "Conversion Rate",
      value: "24%",
      change: "-2%",
      isIncreasing: false,
      icon: <Briefcase className="h-6 w-6" />,
    },
    {
      title: "Avg Conversion Time",
      value: "7 days",
      change: "+1 day",
      isIncreasing: false,
      icon: <Calendar className="h-6 w-6" />,
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto md:h-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="salesOfficers">Sales Officers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leads by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadsByStatus />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leads by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadsBySource />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentLeads />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salesOfficers">
          <Card>
            <CardHeader>
              <CardTitle>Sales Officers Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sales officers management functionality will be implemented in Phase 2.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Leads Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced leads management functionality will be implemented in Phase 2.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Dashboard;
