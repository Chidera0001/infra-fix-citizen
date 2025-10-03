import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/lib/supabase-api";

interface NotificationsDropdownProps {
	notifications: Notification[];
	isLoading: boolean;
	onNotificationClick: (notificationId: string, isRead: boolean) => void;
}

export const NotificationsDropdown = ({ 
	notifications, 
	isLoading, 
	onNotificationClick 
}: NotificationsDropdownProps) => {
	const unreadCount = notifications.filter(n => !n.read).length;

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
			<DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
				<div className="p-2">
					<div className="flex items-center justify-between mb-2 px-2">
						<h3 className="font-semibold text-sm">Notifications</h3>
						{unreadCount > 0 && (
							<span className="text-xs text-green-600 font-medium">
								{unreadCount} unread
							</span>
						)}
					</div>
					{isLoading ? (
						<p className="text-sm text-gray-500 px-2 py-4">Loading notifications...</p>
					) : notifications.length === 0 ? (
						<p className="text-sm text-gray-500 px-2 py-4">No notifications</p>
					) : (
						notifications.map((notification) => (
							<DropdownMenuItem 
								key={notification.id} 
								className="cursor-pointer p-3 hover:bg-gray-50"
								onClick={() => onNotificationClick(notification.id, notification.read)}
							>
								<div className="flex-1">
									<p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
										{notification.message}
									</p>
									<p className="text-xs text-gray-500 mt-1">
										{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
									</p>
								</div>
								{!notification.read && (
									<div className="ml-2 h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></div>
								)}
							</DropdownMenuItem>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
