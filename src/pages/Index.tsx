
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import LeadsByStatus from "@/components/dashboard/LeadsByStatus";
import LeadsBySource from "@/components/dashboard/LeadsBySource";
import RecentLeads from "@/components/dashboard/RecentLeads";
import { FiTrendingUp, FiUser, FiUsers, FiBriefcase } from "react-icons/fi";

// Mock data
const statusData = [
  { name: "New", value: 45, color: "#3b82f6" },
  { name: "Contacted", value: 30, color: "#8b5cf6" },
  { name: "Qualified", value: 15, color: "#f59e0b" },
  { name: "Negotiation", value: 8, color: "#f97316" },
  { name: "Won", value: 12, color: "#10b981" },
  { name: "Lost", value: 5, color: "#ef4444" },
];

const sourceData = [
  { name: "Website", value: 42 },
  { name: "Referral", value: 28 },
  { name: "Social Media", value: 18 },
  { name: "Email", value: 15 },
  { name: "Event", value: 12 },
];

// Updated recentLeads to use the proper union type for status
const recentLeads = [
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
    name: "Emily Brown",
    email: "emily@example.com",
    phone: "123-456-7893",
    company: "Massive Dynamic",
    status: "Negotiation" as const,
    date: "2023-04-20",
  },
  {
    id: "5",
    name: "Robert Davis",
    email: "robert@example.com",
    phone: "123-456-7894",
    company: "Soylent Corp",
    status: "Won" as const,
    date: "2023-04-15",
  },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value="2,542"
            icon={FiUsers}
            change="+12%"
            isIncreasing={true}
          />
          <StatCard
            title="New Leads"
            value="486"
            icon={FiUser}
            change="+8%"
            isIncreasing={true}
          />
          <StatCard
            title="Conversion Rate"
            value="24.3%"
            icon={FiTrendingUp}
            change="+3%"
            isIncreasing={true}
          />
          <StatCard
            title="Active Companies"
            value="126"
            icon={FiBriefcase}
            change="+5%"
            isIncreasing={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LeadsByStatus data={statusData} />
          <LeadsBySource data={sourceData} />
        </div>

        {/* Recent Leads */}
        <RecentLeads leads={recentLeads} />
      </div>
    </MainLayout>
  );
};

export default Index;
