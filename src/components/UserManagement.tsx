import { useState, useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Search,
	Filter,
	MoreHorizontal,
	Edit,
	Trash2,
	UserCheck,
	UserX,
	ChevronLeft,
	ChevronRight,
	Users,
	UserCog,
	Shield,
	ShieldCheck,
} from "lucide-react";
import { useUsers, useUpdateUser, useDeleteUser, useUserStats, type UserFilters } from "@/hooks/use-users";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserManagementProps {
	className?: string;
}

export const UserManagement = ({ className }: UserManagementProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [editForm, setEditForm] = useState({
		full_name: "",
		email: "",
		role: "",
		is_active: true,
	});

	const itemsPerPage = 10;
	const { toast } = useToast();

	// Build filters
	const filters: UserFilters = {
		search: searchTerm || undefined,
		role: roleFilter !== "all" ? roleFilter : undefined,
		is_active: statusFilter !== "all" ? statusFilter === "active" : undefined,
		limit: itemsPerPage,
		offset: (currentPage - 1) * itemsPerPage,
	};

	// Fetch data
	const { data: users = [], isLoading, error } = useUsers(filters);
	const { data: userStats } = useUserStats();
	const updateUserMutation = useUpdateUser();
	const deleteUserMutation = useDeleteUser();

	// Handle search
	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset to first page on search
	};

	// Handle filter changes
	const handleFilterChange = (filterType: string, value: string) => {
		if (filterType === "role") {
			setRoleFilter(value);
		} else if (filterType === "status") {
			setStatusFilter(value);
		}
		setCurrentPage(1); // Reset to first page on filter change
	};

	// Handle edit user
	const handleEditUser = (user: any) => {
		setSelectedUser(user);
		setEditForm({
			full_name: user.full_name || "",
			email: user.email || "",
			role: user.role || "citizen",
			is_active: user.is_active !== false,
		});
		setIsEditDialogOpen(true);
	};

	// Handle update user
	const handleUpdateUser = async () => {
		if (!selectedUser) return;

		try {
			await updateUserMutation.mutateAsync({
				userId: selectedUser.id,
				updates: editForm,
			});
			setIsEditDialogOpen(false);
			setSelectedUser(null);
		} catch (error) {
			console.error("Failed to update user:", error);
		}
	};

	// Handle delete user
	const handleDeleteUser = async () => {
		if (!selectedUser) return;

		try {
			await deleteUserMutation.mutateAsync(selectedUser.id);
			setIsDeleteDialogOpen(false);
			setSelectedUser(null);
		} catch (error) {
			console.error("Failed to delete user:", error);
		}
	};

	// Handle confirm delete
	const handleConfirmDelete = (user: any) => {
		setSelectedUser(user);
		setIsDeleteDialogOpen(true);
	};

	// Get role badge variant
	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case "admin":
				return "destructive";
			case "moderator":
				return "default";
			default:
				return "secondary";
		}
	};

	// Get role icon
	const getRoleIcon = (role: string) => {
		switch (role) {
			case "admin":
				return <ShieldCheck className="h-4 w-4" />;
			case "moderator":
				return <Shield className="h-4 w-4" />;
			default:
				return <UserCog className="h-4 w-4" />;
		}
	};

	if (error) {
		return (
			<Card className={className}>
				<CardContent className="py-8 text-center">
					<p className="text-red-500">Error loading users. Please try again.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={className}>
			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card className="bg-white border-0 shadow-lg">
					<CardContent className="p-6 text-center">
						<Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
						<p className="text-xl font-normal text-gray-900">{userStats?.total || 0}</p>
						<p className="text-sm text-gray-600">Total Users</p>
					</CardContent>
				</Card>
				<Card className="bg-white border-0 shadow-lg">
					<CardContent className="p-6 text-center">
						<UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
						<p className="text-xl font-normal text-gray-900">{userStats?.active || 0}</p>
						<p className="text-sm text-gray-600">Active Users</p>
					</CardContent>
				</Card>
				<Card className="bg-white border-0 shadow-lg">
					<CardContent className="p-6 text-center">
						<ShieldCheck className="h-8 w-8 text-purple-500 mx-auto mb-2" />
						<p className="text-xl font-normal text-gray-900">{userStats?.admins || 0}</p>
						<p className="text-sm text-gray-600">Admins</p>
					</CardContent>
				</Card>
				<Card className="bg-white border-0 shadow-lg">
					<CardContent className="p-6 text-center">
						<UserX className="h-8 w-8 text-red-500 mx-auto mb-2" />
						<p className="text-xl font-normal text-gray-900">{userStats?.inactive || 0}</p>
						<p className="text-sm text-gray-600">Inactive Users</p>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<Card className="bg-white border-0 shadow-lg mb-6">
				<CardHeader>
					<CardTitle className="text-xl font-normal text-gray-900">User Management</CardTitle>
					<CardDescription>Search, filter, and manage platform users</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search users by name or email..."
									value={searchTerm}
									onChange={(e) => handleSearch(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						{/* Role Filter */}
						<div className="w-full sm:w-48">
							<Select value={roleFilter} onValueChange={(value) => handleFilterChange("role", value)}>
								<SelectTrigger>
									<SelectValue placeholder="Filter by role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Roles</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="moderator">Moderator</SelectItem>
									<SelectItem value="citizen">Citizen</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Status Filter */}
						<div className="w-full sm:w-48">
							<Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
								<SelectTrigger>
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Users Table */}
			<Card className="bg-white border-0 shadow-lg">
				<CardContent className="p-0">
					{isLoading ? (
						<div className="py-8 text-center text-gray-500">Loading users...</div>
					) : users.length === 0 ? (
						<div className="py-12 text-center">
							<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-500">No users found</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Joined</TableHead>
									<TableHead className="w-[50px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div>
												<p className="font-medium text-gray-900">
													{user.full_name || "Unknown User"}
												</p>
												<p className="text-sm text-gray-500">{user.email}</p>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
												{getRoleIcon(user.role)}
												{user.role || "citizen"}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge variant={user.is_active !== false ? "default" : "secondary"}>
												{user.is_active !== false ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell>
											{user.created_at
												? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
												: "Unknown"}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem onClick={() => handleEditUser(user)}>
														<Edit className="h-4 w-4 mr-2" />
														Edit User
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleConfirmDelete(user)}
														className="text-red-600"
													>
														<Trash2 className="h-4 w-4 mr-2" />
														Delete User
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Pagination */}
			{users.length > 0 && (
				<div className="flex items-center justify-between mt-6">
					<p className="text-sm text-gray-500">
						Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
							disabled={currentPage === 1}
						>
							<ChevronLeft className="h-4 w-4" />
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(prev => prev + 1)}
							disabled={users.length < itemsPerPage}
						>
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<DialogDescription>
							Update user information and permissions.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="full_name">Full Name</Label>
							<Input
								id="full_name"
								value={editForm.full_name}
								onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={editForm.email}
								onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="role">Role</Label>
							<Select
								value={editForm.role}
								onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="citizen">Citizen</SelectItem>
									<SelectItem value="moderator">Moderator</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="is_active"
								checked={editForm.is_active}
								onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
								className="rounded"
							/>
							<Label htmlFor="is_active">Active User</Label>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateUser}
							disabled={updateUserMutation.isPending}
						>
							{updateUserMutation.isPending ? "Updating..." : "Update User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete User Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete User</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this user? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					{selectedUser && (
						<div className="py-4">
							<p className="text-sm text-gray-600">
								<strong>{selectedUser.full_name || "Unknown User"}</strong> ({selectedUser.email})
							</p>
						</div>
					)}
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteUser}
							disabled={deleteUserMutation.isPending}
						>
							{deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
