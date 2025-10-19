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
	locationSource?: 'photo' | 'gps' | 'map';
	onRetake: () => void;
}

export const InstantReportForm = ({ photo, initialLocation, locationSource, onRetake }: InstantReportFormProps) => {
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

	// Character limits from backend validation
	const TITLE_MIN_LENGTH = 10;
	const TITLE_MAX_LENGTH = 100;
	const DESCRIPTION_MIN_LENGTH = 20;
	const DESCRIPTION_MAX_LENGTH = 1000;
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [photoPreview, setPhotoPreview] = useState<string>("");

	// Create photo preview
	useState(() => {
		const url = URL.createObjectURL(photo);
		setPhotoPreview(url);
		return () => URL.revokeObjectURL(url);
	});

	const getLocationBadgeText = () => {
		switch (locationSource) {
			case 'photo':
				return 'Auto-detected: Camera';
			case 'gps':
				return 'Auto-detected: Location';
			case 'map':
				return 'Auto-detected: Map';
			default:
				return 'Auto-detected: Location';
		}
	};

	// Validation functions
	const validateForm = () => {
		const errors: string[] = [];

		// Title validation
		if (!formData.title.trim()) {
			errors.push("Title is required");
		} else if (formData.title.trim().length < TITLE_MIN_LENGTH) {
			errors.push(`Title must be at least ${TITLE_MIN_LENGTH} characters long`);
		} else if (formData.title.trim().length > TITLE_MAX_LENGTH) {
			errors.push(`Title must be no more than ${TITLE_MAX_LENGTH} characters long`);
		}

		// Description validation
		if (!formData.description.trim()) {
			errors.push("Description is required");
		} else if (formData.description.trim().length < DESCRIPTION_MIN_LENGTH) {
			errors.push(`Description must be at least ${DESCRIPTION_MIN_LENGTH} characters long`);
		} else if (formData.description.trim().length > DESCRIPTION_MAX_LENGTH) {
			errors.push(`Description must be no more than ${DESCRIPTION_MAX_LENGTH} characters long`);
		}

		// Address validation
		if (!formData.address.trim()) {
			errors.push("Address is required");
		}

		return errors;
	};

	// Helper functions for character count display
	const getTitleCountColor = () => {
		const length = formData.title.length;
		if (length < TITLE_MIN_LENGTH) return "text-red-500";
		if (length > TITLE_MAX_LENGTH) return "text-red-500";
		if (length > TITLE_MAX_LENGTH * 0.9) return "text-yellow-500";
		return "text-green-600";
	};

	const getDescriptionCountColor = () => {
		const length = formData.description.length;
		if (length < DESCRIPTION_MIN_LENGTH) return "text-red-500";
		if (length > DESCRIPTION_MAX_LENGTH) return "text-red-500";
		if (length > DESCRIPTION_MAX_LENGTH * 0.9) return "text-yellow-500";
		return "text-green-600";
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate form using the new validation function
		const errors = validateForm();
		if (errors.length > 0) {
			toast({
				title: "Validation Error",
				description: errors.join(", "),
				variant: "destructive"
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const issueData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
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
			<Card className="bg-white/95 backdrop-blur-sm border border-green-200/50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
				<CardContent className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					{/* Photo Preview */}
					<div className="mb-6">
						<div className="relative">
							<img
								src={photoPreview}
								alt="Captured issue"
								className="w-full h-64 object-cover rounded-xl border border-gray-200"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onRetake}
								className="absolute top-3 right-3 bg-white/90 hover:bg-white border-gray-300"
							>
								<RotateCcw className="h-4 w-4 mr-2" />
								Retake
							</Button>
						</div>
					</div>

					{/* Location Info */}
					{initialLocation && (
						<div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
							<div className="flex items-start space-x-3">
								<MapPin className="h-5 w-5 text-green-600 mt-0.5" />
								<div className="flex-1">
									<p className="text-sm font-medium text-green-800 mb-1">
										Location automatically detected from {locationSource === 'photo' ? 'photo' : locationSource === 'gps' ? 'GPS' : 'map'}
									</p>
									<p className="text-sm text-green-700">
										Address: {initialLocation.address}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Form Validation Status */}
					{validateForm().length > 0 && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
							<div className="flex items-start space-x-2">
								<div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<span className="text-red-600 text-xs font-bold">!</span>
								</div>
								<div>
									<p className="text-sm font-medium text-red-800 mb-1">Please fix the following issues:</p>
									<ul className="text-xs text-red-700 space-y-1">
										{validateForm().map((error, index) => (
											<li key={index}>• {error}</li>
										))}
									</ul>
								</div>
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
								placeholder="Brief description of the issue (minimum 10 characters)"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								className={`border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg ${
									formData.title.length > 0 && (formData.title.length < TITLE_MIN_LENGTH || formData.title.length > TITLE_MAX_LENGTH)
										? 'border-red-300 focus:border-red-500 focus:ring-red-500'
										: ''
								}`}
								required
								minLength={TITLE_MIN_LENGTH}
								maxLength={TITLE_MAX_LENGTH}
							/>
							<div className="flex justify-between items-center text-xs">
								<span className={`font-medium ${getTitleCountColor()}`}>
									{formData.title.length}/{TITLE_MAX_LENGTH} characters
								</span>
								{formData.title.length > 0 && formData.title.length < TITLE_MIN_LENGTH && (
									<span className="text-red-500 font-medium">
										Minimum {TITLE_MIN_LENGTH} characters required
									</span>
								)}
							</div>
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
							<div className="flex items-center space-x-2">
								<Label htmlFor="address" className="text-gray-900 font-medium">
									Address *
								</Label>
								{locationSource && (
									<Badge className="bg-green-100 text-green-700 border-green-200 px-2 py-1 text-xs">
										{getLocationBadgeText()}
									</Badge>
								)}
							</div>
							<Input
								id="address"
								placeholder="Enter address"
								value={formData.address}
								onChange={(e) => setFormData({ ...formData, address: e.target.value })}
								className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
								required
							/>
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

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description" className="text-gray-900 font-medium">
								Description *
							</Label>
							<Textarea
								id="description"
								placeholder="Detailed description of the issue (minimum 20 characters)"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className={`border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg ${
									formData.description.length > 0 && (formData.description.length < DESCRIPTION_MIN_LENGTH || formData.description.length > DESCRIPTION_MAX_LENGTH)
										? 'border-red-300 focus:border-red-500 focus:ring-red-500'
										: ''
								}`}
								rows={4}
								minLength={DESCRIPTION_MIN_LENGTH}
								maxLength={DESCRIPTION_MAX_LENGTH}
								required
							/>
							<div className="flex justify-between items-center text-xs">
								<span className={`font-medium ${getDescriptionCountColor()}`}>
									{formData.description.length}/{DESCRIPTION_MAX_LENGTH} characters
								</span>
								{formData.description.length > 0 && formData.description.length < DESCRIPTION_MIN_LENGTH && (
									<span className="text-red-500 font-medium">
										Minimum {DESCRIPTION_MIN_LENGTH} characters required
									</span>
								)}
							</div>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isSubmitting || validateForm().length > 0}
							className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Submitting...</span>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<Send className="h-4 w-4" />
									<span>Submit Report</span>
								</div>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
