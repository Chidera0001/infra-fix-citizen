import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Issue } from "@/lib/supabase-api";

interface DeleteConfirmationModalProps {
	issue: Issue | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (issueId: string) => Promise<void>;
}

export const DeleteConfirmationModal = ({ 
	issue, 
	isOpen, 
	onClose, 
	onConfirm 
}: DeleteConfirmationModalProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!issue) return;

		setIsDeleting(true);
		try {
			await onConfirm(issue.id);
			onClose();
		} catch (error) {
			console.error("Error deleting issue:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	if (!issue) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-0 shadow-2xl [&>button]:hidden">
				<DialogHeader className="pb-6 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<DialogTitle className="flex items-center gap-3 text-lg font-semibold text-red-600">
							<div className="p-2 bg-red-100 rounded-lg">
								<AlertTriangle className="h-5 w-5 text-red-600" />
							</div>
							Confirm Deletion
						</DialogTitle>
						<Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
							<X className="h-4 w-4" />
						</Button>
					</div>
				</DialogHeader>

				<div className="space-y-4">
					{/* Warning Message */}
					<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-start gap-3">
							<AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="font-semibold text-red-800 mb-1">
									This action cannot be undone
								</h4>
								<p className="text-sm text-red-700">
									You are about to permanently delete this issue report. 
									All associated data, comments, and images will be lost.
								</p>
							</div>
						</div>
					</div>

					{/* Issue Details */}
					<div className="p-4 bg-gray-50 rounded-lg">
						<h4 className="font-semibold text-gray-900 mb-2">Issue to be deleted:</h4>
						<div className="space-y-1 text-sm">
							<p className="font-medium text-gray-900">{issue.title}</p>
							<p className="text-gray-600 truncate">{issue.description}</p>
							<div className="flex items-center gap-4 text-xs text-gray-500">
								<span>ID: {issue.id.slice(0, 8)}...</span>
								<span className="capitalize">{issue.status}</span>
								<span className="capitalize">{issue.severity}</span>
							</div>
						</div>
					</div>

					{/* Confirmation Checkbox */}
					<div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
						<input
							type="checkbox"
							id="confirm-delete"
							className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
							required
						/>
						<label htmlFor="confirm-delete" className="text-sm text-gray-700">
							I understand that this action is permanent and cannot be undone. 
							I confirm that I want to delete this issue report.
						</label>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button variant="outline" onClick={onClose} disabled={isDeleting}>
						<X className="h-4 w-4 mr-2" />
						Cancel
					</Button>
					<Button 
						variant="destructive" 
						onClick={handleDelete}
						disabled={isDeleting}
						className="bg-red-600 hover:bg-red-700"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{isDeleting ? "Deleting..." : "Delete Issue"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
