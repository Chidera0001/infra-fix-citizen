import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications, useUnreadNotificationCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from "@/hooks/use-notifications";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface NotificationsDropdownProps {
	userId?: string;
}

export const NotificationsDropdown = ({ 
	userId 
}: NotificationsDropdownProps) => {
	const { data: notifications = [], isLoading } = useNotifications(userId);
	const { data: unreadCount = 0 } = useUnreadNotificationCount(userId);
	const markAsRead = useMarkNotificationAsRead();
	const markAllAsRead = useMarkAllNotificationsAsRead();
	const deleteNotification = useDeleteNotification();

	const handleNotificationClick = (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			markAsRead.mutate([notificationId]);
		}
	};

	const handleMarkAllAsRead = () => {
		markAllAsRead.mutate();
	};

	const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
		e.stopPropagation();
		deleteNotification.mutate(notificationId);
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'status_update':
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case 'comment':
				return <AlertCircle className="h-4 w-4 text-blue-500" />;
			case 'assignment':
				return <Clock className="h-4 w-4 text-orange-500" />;
			case 'resolution':
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			default:
				return <Bell className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{!isLoading && unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
							{unreadCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto">
				<div className="p-2">
					<div className="flex items-center justify-between mb-3 px-2">
						<h3 className="font-semibold text-sm">Notifications</h3>
						<div className="flex items-center gap-2">
							{unreadCount > 0 && (
								<Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
									{unreadCount} unread
								</Badge>
							)}
							{notifications.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleMarkAllAsRead}
									className="h-6 px-2 text-xs"
								>
									<Check className="h-3 w-3 mr-1" />
									Mark all read
								</Button>
							)}
						</div>
					</div>
					
					{isLoading ? (
						<div className="px-2 py-4 text-center">
							<LoadingSpinner size="sm" text="Loading notifications..." />
						</div>
					) : notifications.length === 0 ? (
						<div className="px-2 py-8 text-center">
							<Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
							<p className="text-sm text-gray-500">No notifications yet</p>
						</div>
					) : (
						<div className="space-y-1">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
										!notification.read ? 'bg-green-50 border-l-4 border-green-500' : ''
									}`}
									onClick={() => handleNotificationClick(notification.id, notification.read)}
								>
									<div className="flex-shrink-0 mt-0.5">
										{getNotificationIcon(notification.type)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
													{notification.title}
												</p>
												<p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
													{notification.message}
												</p>
												<p className="text-xs text-gray-400 mt-2">
													{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
												</p>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => handleDeleteNotification(e, notification.id)}
												className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</div>
									{!notification.read && (
										<div className="flex-shrink-0 mt-1">
											<div className="h-2 w-2 bg-green-500 rounded-full"></div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
