
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User, ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Issue } from "@/lib/mockData";

interface IssueCardProps {
  issue: Issue;
  showActions?: boolean;
}

const IssueCard = ({ issue, showActions = false }: IssueCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "in-progress":
        return "default";
      case "resolved":
        return "secondary";
      default:
        return "default";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900">{issue.title}</h3>
              <Badge variant={getStatusColor(issue.status)}>
                {issue.status.replace("-", " ")}
              </Badge>
              {issue.urgency && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(issue.urgency)}`}>
                  {issue.urgency} priority
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as In Progress</DropdownMenuItem>
                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Assign Team</DropdownMenuItem>
                <DropdownMenuItem>Send Update</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{issue.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{issue.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{issue.reportedBy}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {issue.upvotes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <MessageSquare className="h-4 w-4 mr-1" />
              {issue.comments}
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            {issue.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
