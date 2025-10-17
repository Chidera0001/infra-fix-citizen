import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Send, RotateCcw } from "lucide-react";
import type { LocationData } from "@/utils/exifExtractor";
import { useNavigate } from "react-router-dom";
import { useCreateOnlineIssue } from "@/hooks/use-separate-issues";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface InstantReportFormProps {
	photo: File;
	initialLocation: LocationData | null;
	onRetake: () => void;
}

export const InstantReportForm = ({ photo, initialLocation, onRetake }: InstantReportFormProps) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { toast } = useToast();
	const createOnlineIssueMutation = useCreateOnlineIssue();
	
	const [formData, setFormData] = useState({
		title: "",
		category: "other" as "pothole" | "street_lighting" | "water_supply" | "traffic_signal" | "drainage" | "sidewalk" | "other",
		severity: "medium" as "low" | "medium" | "high" | "critical",
		description: "",
		address: initialLocation?.address || "",
		location_lat: initialLocation?.latitude || 6.5244,
		location_lng: initialLocation?.longitude || 3.3792,
	});
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [photoPreview, setPhotoPreview] = useState<string>("");

	// Create photo preview
	useState(() => {
		const url = URL.createObjectURL(photo);
		setPhotoPreview(url);
		return () => URL.revokeObjectURL(url);
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.title.trim() || !formData.address.trim()) {
			toast({
				title: "Missing Information",
				description: "Please provide a title and address",
				variant: "destructive"
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const issueData = {
				title: formData.title.trim(),
				description: formData.description.trim() || `Instant report captured via mobile camera`,
				category: formData.category,
				severity: formData.severity,
				address: formData.address.trim(),
				location_lat: formData.location_lat,
				location_lng: formData.location_lng,
			};

			// Pass the captured photo to be uploaded
			await createOnlineIssueMutation.mutateAsync({
				issueData,
				userId: user?.id,
				photos: [photo]
			});

			// Redirect immediately on success
			navigate("/citizen");
		} catch (error) {
			console.error("Error submitting instant report:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
				<CardContent className="p-6 sm:p-8 space-y-6">
					{/* Photo Preview */}
					<div className="relative">
						<img
							src={photoPreview}
							alt="Captured issue"
							className="w-full h-64 object-cover rounded-xl shadow-lg"
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={onRetake}
							className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50"
						>
							<RotateCcw className="h-4 w-4 mr-1" />
							Retake
						</Button>
					</div>

					{/* Location Status */}
					{initialLocation && (
						<div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
							<div className="p-2 bg-green-200 rounded-lg">
								<MapPin className="h-4 w-4 text-green-700" />
							</div>
							<div>
								<span className="text-sm text-green-800 font-semibold">
									Location automatically detected from photo
								</span>
								<p className="text-xs text-green-600 mt-1">
									Address: {initialLocation.address}
								</p>
							</div>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title" className="text-gray-900 font-medium">
								Issue Title *
							</Label>
							<Input
								id="title"
								placeholder="Brief description of the issue"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
								required
								maxLength={100}
							/>
						</div>

						{/* Category */}
						<div className="space-y-2">
							<Label htmlFor="category" className="text-gray-900 font-medium">
								Category *
							</Label>
							<Select
								value={formData.category}
								onValueChange={(value: any) => setFormData({ ...formData, category: value })}
							>
								<SelectTrigger className="border-green-300 focus:border-green-500 rounded-lg">
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="pothole">Pothole</SelectItem>
									<SelectItem value="street_lighting">Street Lighting</SelectItem>
									<SelectItem value="water_supply">Water Supply</SelectItem>
									<SelectItem value="traffic_signal">Traffic Signal</SelectItem>
									<SelectItem value="drainage">Drainage</SelectItem>
									<SelectItem value="sidewalk">Sidewalk</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Address */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="address" className="text-gray-900 font-medium">
									Address *
								</Label>
								{initialLocation && (
									<Badge variant="secondary" className="bg-green-100 text-green-700">
										Auto-detected
									</Badge>
								)}
							</div>
							<Input
								id="address"
								placeholder="Enter the address"
								value={formData.address}
								onChange={(e) => setFormData({ ...formData, address: e.target.value })}
								className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
								required
							/>
							{!initialLocation && (
								<p className="text-xs text-gray-500">
									No location data in photo. Please enter the address.
								</p>
							)}
						</div>

						{/* Severity (Optional) */}
						<div className="space-y-2">
							<Label htmlFor="severity" className="text-gray-900 font-medium">
								Severity (Optional)
							</Label>
							<Select
								value={formData.severity}
								onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
							>
								<SelectTrigger className="border-green-300 focus:border-green-500 rounded-lg">
									<SelectValue placeholder="Select severity" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="critical">Critical</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Description (Optional) */}
						<div className="space-y-2">
							<Label htmlFor="description" className="text-gray-900 font-medium">
								Additional Details (Optional)
							</Label>
							<Textarea
								id="description"
								placeholder="Add any additional information..."
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
								rows={3}
							/>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
						>
							{isSubmitting ? (
								<>Submitting Report...</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Submit Instant Report
								</>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

