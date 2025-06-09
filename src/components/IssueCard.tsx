
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User, ThumbsUp, MessageSquare, MoreHorizontal, Clock, AlertCircle } from "lucide-react";
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
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200/50 bg-white/80 backdrop-blur-sm group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {issue.title}
              </h3>
              <Badge variant={getStatusColor(issue.status)} className="flex items-center space-x-1">
                {getStatusIcon(issue.status)}
                <span className="capitalize">{issue.status.replace("-", " ")}</span>
              </Badge>
              {issue.urgency && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(issue.urgency)}`}>
                  {issue.urgency} priority
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{issue.description}</p>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-orange-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem className="text-green-600">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Assign Team
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Update
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{issue.location}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
            <Calendar className="h-4 w-4 text-green-500" />
            <span className="font-medium">{issue.date}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
            <User className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{issue.reportedBy}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span className="font-medium">{issue.upvotes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="font-medium">{issue.comments}</span>
            </Button>
          </div>
          <Badge variant="outline" className="text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-200">
            {issue.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
