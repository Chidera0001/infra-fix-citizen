import { UserManagement } from "@/components/UserManagement";

export const Users = () => {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
				<h1 className="text-xl sm:text-xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
					User Management
				</h1>
				<p className="text-gray-700 text-base lg:text-sm font-medium">
					Manage platform users and their access
				</p>
			</div>

			<UserManagement />
		</div>
	);
};
