
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

interface LeadsBySourceProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const LeadsBySource = ({ data }: LeadsBySourceProps) => {
  const chartConfig = {
    value: { color: "#8b5cf6" },
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-md">Leads by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LeadsBySource;
