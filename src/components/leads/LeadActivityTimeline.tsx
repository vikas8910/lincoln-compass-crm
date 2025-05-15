
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, MessageSquare, FileText } from 'lucide-react';
import { Lead } from '@/types/lead';

export interface LeadActivityTimelineProps {
  leadId: string;
}

const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({ leadId }) => {
  // Example activities (in a real app, fetch this based on leadId)
  const activities = [
    {
      id: '1',
      type: 'email',
      title: 'Email Sent',
      description: 'Initial contact email sent',
      date: '2023-05-15T10:30:00',
      user: 'Jane Smith',
    },
    {
      id: '2',
      type: 'call',
      title: 'Phone Call',
      description: 'Discussed product requirements',
      date: '2023-05-16T14:15:00',
      user: 'John Doe',
    },
    {
      id: '3',
      type: 'note',
      title: 'Note Added',
      description: 'Customer interested in enterprise plan',
      date: '2023-05-18T09:45:00',
      user: 'Jane Smith',
    },
    {
      id: '4',
      type: 'meeting',
      title: 'Meeting Scheduled',
      description: 'Demo scheduled for next week',
      date: '2023-05-19T11:00:00',
      user: 'John Doe',
    },
  ];

  // Render the appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Activity Timeline</h3>
        <Button variant="outline" size="sm">
          Add Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No activities recorded for this lead yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.user}</span>
                  </div>
                </div>
              </div>
              {index < activities.length - 1 && (
                <div className="absolute left-3.5 top-10 bottom-0 w-px bg-border" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadActivityTimeline;
