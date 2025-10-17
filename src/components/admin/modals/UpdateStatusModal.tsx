import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
	AlertCircle, 
	CheckCircle, 
	XCircle, 
	Clock,
	Save,
	X
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Issue } from "@/lib/supabase-api";

interface UpdateStatusModalProps {
	issue: Issue | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (issueId: string, updates: {
		status: string;
		severity?: string;
		resolution_notes?: string;
	}) => Promise<void>;
}

const statusOptions = [
	{ value: "open", label: "Open", icon: AlertCircle, color: "text-orange-500" },
	{ value: "in_progress", label: "In Progress", icon: Clock, color: "text-blue-500" },
	{ value: "resolved", label: "Resolved", icon: CheckCircle, color: "text-green-500" },
	{ value: "closed", label: "Closed", icon: XCircle, color: "text-gray-500" },
];

const severityOptions = [
	{ value: "low", label: "Low", color: "bg-green-100 text-green-800" },
	{ value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
	{ value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
	{ value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

export const UpdateStatusModal = ({ 
	issue, 
	isOpen, 
	onClose, 
	onSave 
}: UpdateStatusModalProps) => {
	const [status, setStatus] = useState("");
	const [severity, setSeverity] = useState("");
	const [notes, setNotes] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (issue) {
			setStatus(issue.status);
			setSeverity(issue.severity || "medium");
			setNotes("");
		}
	}, [issue]);

	const handleSave = async () => {
		if (!issue) return;

		setIsLoading(true);
		try {
		const updates = {
			status,
			severity,
			resolution_notes: notes.trim() || undefined,
		};
		await onSave(issue.id, updates);
			onClose();
		} catch (error) {
			console.error("🔴 UpdateStatusModal - Error updating issue:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const selectedStatus = statusOptions.find(s => s.value === status);
	const StatusIcon = selectedStatus?.icon || AlertCircle;

	if (!issue) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-0 shadow-2xl [&>button]:hidden">
				<DialogHeader className="pb-6 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<DialogTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
							<div className="p-2 bg-red-100 rounded-lg">
								<StatusIcon className={`h-5 w-5 ${selectedStatus?.color}`} />
							</div>
							Update Issue Status
						</DialogTitle>
						<Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
							<X className="h-4 w-4" />
						</Button>
					</div>
				</DialogHeader>

				<div className="space-y-6">
					{/* Issue Info */}
					<div className="p-4 bg-gray-50 rounded-lg">
						<h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
						<p className="text-sm text-gray-600 truncate">{issue.description}</p>
					</div>

					{/* Status Selection */}
					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map((option) => {
									const Icon = option.icon;
									return (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												<Icon className={`h-4 w-4 ${option.color}`} />
												{option.label}
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>

					{/* Severity Selection */}
					<div className="space-y-2">
						<Label htmlFor="severity">Severity</Label>
						<Select value={severity} onValueChange={setSeverity}>
							<SelectTrigger>
								<SelectValue placeholder="Select severity" />
							</SelectTrigger>
							<SelectContent>
								{severityOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										<div className="flex items-center gap-2">
											<Badge className={`${option.color} text-xs`}>
												{option.label}
											</Badge>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Update Notes (Optional)</Label>
						<Textarea
							id="notes"
							placeholder="Add any notes about this status update..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={3}
						/>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button variant="outline" onClick={onClose} disabled={isLoading}>
						<X className="h-4 w-4 mr-2" />
						Cancel
					</Button>
					<Button 
						onClick={handleSave} 
						disabled={isLoading || !status}
						className="bg-green-600 hover:bg-green-700"
					>
						<Save className="h-4 w-4 mr-2" />
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
