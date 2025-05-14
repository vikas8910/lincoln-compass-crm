
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isIncreasing?: boolean;
  icon?: IconType;
  className?: string;
}

const StatCard = ({
  title,
  value,
  change,
  isIncreasing,
  icon: Icon,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${isIncreasing ? "text-green-500" : "text-red-500"}`}>
            {change}
            <span className="text-muted-foreground"> from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
