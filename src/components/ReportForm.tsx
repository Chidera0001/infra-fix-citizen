import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Camera,
	MapPin,
	Upload,
	CheckCircle,
	AlertTriangle,
	Clock,
	Star,
	X,
	Plus,
	Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CitiznLogo from "@/components/CitiznLogo";
import { useCreateIssue } from "@/hooks/use-issues";
import { useUser } from "@clerk/clerk-react";

interface ReportFormProps {
	onBack: () => void;
}

const ReportForm = ({ onBack }: ReportFormProps) => {
	const { user } = useUser();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		severity: "medium" as "low" | "medium" | "high" | "critical",
		location: "",
		latitude: 6.5244, // Default Lagos coords
		longitude: 3.3792,
		photos: [] as File[],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const createIssueMutation = useCreateIssue();

	const totalSteps = 3;

	const handleNext = () => {
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setFormData({ ...formData, photos: [...formData.photos, ...files] });
	};

	const removePhoto = (index: number) => {
		const newPhotos = formData.photos.filter((_, i) => i !== index);
		setFormData({ ...formData, photos: newPhotos });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Create issue in Supabase
			await createIssueMutation.mutateAsync({
				title: formData.title,
				description: formData.description,
				category: formData.category,
				severity: formData.severity,
				location: formData.location,
				latitude: formData.latitude,
				longitude: formData.longitude,
				// Note: Photo upload would need additional storage setup (Supabase Storage)
				// For now, we'll submit without photos
			});

			toast({
				title: "Report Submitted Successfully!",
				description:
					"Your issue has been reported and will be reviewed by authorities.",
			});

			onBack();
		} catch (error) {
			toast({
				title: "Submission Failed",
				description: "There was an error submitting your report. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getStepIcon = (step: number) => {
		switch (step) {
			case 1:
				return <Camera className="h-5 w-5" />;
			case 2:
				return <MapPin className="h-5 w-5" />;
			case 3:
				return <CheckCircle className="h-5 w-5" />;
			default:
				return <Star className="h-5 w-5" />;
		}
	};

	const getStepTitle = (step: number) => {
		switch (step) {
			case 1:
				return "Issue Details";
			case 2:
				return "Location & Photos";
			case 3:
				return "Review & Submit";
			default:
				return "Step";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Enhanced Header */}
			<header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={onBack}
							className="text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</Button>
						<CitiznLogo size="sm" />
						<div>
							<h1 className="text-xl font-bold text-gray-900">
								Report Infrastructure Issue
							</h1>
							<p className="text-sm text-gray-600">
								Help improve your Nigerian community
							</p>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Enhanced Progress Indicator */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Report New Issue
						</h2>
						<Badge
							variant="secondary"
							className="bg-green-50 text-green-700 border-green-200"
						>
							Step {currentStep} of {totalSteps}
						</Badge>
					</div>
					<div className="flex items-center space-x-4">
						{Array.from({ length: totalSteps }, (_, i) => (
							<div key={i} className="flex items-center">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center ${
										i + 1 < currentStep
											? "bg-green-500 text-white"
											: i + 1 === currentStep
											? "bg-green-100 text-green-600 border-2 border-green-500"
											: "bg-gray-100 text-gray-400"
									}`}
								>
									{i + 1 < currentStep ? (
										<CheckCircle className="h-5 w-5" />
									) : (
										getStepIcon(i + 1)
									)}
								</div>
								{i < totalSteps - 1 && (
									<div
										className={`w-16 h-1 ${
											i + 1 < currentStep
												? "bg-green-500"
												: "bg-gray-200"
										}`}
									></div>
								)}
							</div>
						))}
					</div>
					<div className="flex justify-between mt-4">
						{Array.from({ length: totalSteps }, (_, i) => (
							<span
								key={i}
								className={`text-sm font-medium ${
									i + 1 === currentStep
										? "text-green-600"
										: "text-gray-500"
								}`}
							>
								{getStepTitle(i + 1)}
							</span>
						))}
					</div>
				</div>

				<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
					<CardHeader className="pb-6 pt-8">
						<CardTitle className="text-2xl font-bold flex items-center space-x-3">
							{getStepIcon(currentStep)}
							<span>{getStepTitle(currentStep)}</span>
						</CardTitle>
						<CardDescription className="text-gray-600 text-lg">
							{currentStep === 1 &&
								"Describe the infrastructure issue you've encountered in your Nigerian community"}
							{currentStep === 2 &&
								"Add location details and photos to help authorities locate and understand the issue"}
							{currentStep === 3 &&
								"Review your report before submitting to Nigerian authorities"}
						</CardDescription>
					</CardHeader>
					<CardContent className="px-8 pb-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Step 1: Issue Details */}
							{currentStep === 1 && (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label
												htmlFor="title"
												className="text-gray-700 font-medium"
											>
												Issue Title *
											</Label>
											<Input
												id="title"
												placeholder="e.g., Large pothole on Main Street"
												value={formData.title}
												onChange={(e) =>
													setFormData({
														...formData,
														title: e.target.value,
													})
												}
												className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
												required
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="category"
												className="text-gray-700 font-medium"
											>
												Category *
											</Label>
											<Select
												onValueChange={(value) =>
													setFormData({
														...formData,
														category: value,
													})
												}
											>
												<SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl">
													<SelectValue placeholder="Select issue category" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="pothole">
														Pothole
													</SelectItem>
													<SelectItem value="streetlight">
														Streetlight
													</SelectItem>
													<SelectItem value="drainage">
														Drainage
													</SelectItem>
													<SelectItem value="water">
														Water Supply
													</SelectItem>
													<SelectItem value="road">
														Road Damage
													</SelectItem>
													<SelectItem value="other">
														Other
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="severity"
											className="text-gray-700 font-medium"
										>
											Severity Level *
										</Label>
										<Select
											onValueChange={(value: any) =>
												setFormData({
													...formData,
													severity: value,
												})
											}
										>
											<SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl">
												<SelectValue placeholder="Select severity level" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="low">
													<div className="flex items-center space-x-2">
														<div className="w-3 h-3 bg-green-500 rounded-full"></div>
														<span>
															Low - Minor issue
														</span>
													</div>
												</SelectItem>
												<SelectItem value="medium">
													<div className="flex items-center space-x-2">
														<div className="w-3 h-3 bg-orange-500 rounded-full"></div>
														<span>
															Medium - Moderate concern
														</span>
													</div>
												</SelectItem>
												<SelectItem value="high">
													<div className="flex items-center space-x-2">
														<div className="w-3 h-3 bg-red-500 rounded-full"></div>
														<span>
															High - Safety concern
														</span>
													</div>
												</SelectItem>
												<SelectItem value="critical">
													<div className="flex items-center space-x-2">
														<div className="w-3 h-3 bg-purple-600 rounded-full"></div>
														<span>
															Critical - Immediate danger
														</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="description"
											className="text-gray-700 font-medium"
										>
											Description *
										</Label>
										<Textarea
											id="description"
											placeholder="Provide detailed description of the issue, including any safety concerns or specific details that would help authorities understand the problem..."
											value={formData.description}
											onChange={(e) =>
												setFormData({
													...formData,
													description: e.target.value,
												})
											}
											className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl min-h-[120px]"
											required
										/>
									</div>
								</div>
							)}

							{/* Step 2: Location & Photos */}
							{currentStep === 2 && (
								<div className="space-y-6">
									<div className="space-y-2">
										<Label
											htmlFor="location"
											className="text-gray-700 font-medium"
										>
											Location *
										</Label>
										<Input
											id="location"
											placeholder="e.g., Main Street, Victoria Island, Lagos"
											value={formData.location}
											onChange={(e) =>
												setFormData({
													...formData,
													location: e.target.value,
												})
											}
											className="border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
											required
										/>
									</div>

									<div className="space-y-4">
										<Label className="text-gray-700 font-medium">
											Photos (Optional but recommended)
										</Label>
										<div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
											<input
												type="file"
												multiple
												accept="image/*"
												onChange={handlePhotoUpload}
												className="hidden"
												id="photo-upload"
											/>
											<label
												htmlFor="photo-upload"
												className="cursor-pointer"
											>
												<ImageIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
												<p className="text-gray-600 font-medium">
													Click to upload photos
												</p>
												<p className="text-gray-500 text-sm">
													Upload clear photos of the
													issue to help authorities
												</p>
											</label>
										</div>

										{formData.photos.length > 0 && (
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{formData.photos.map(
													(photo, index) => (
														<div
															key={index}
															className="relative group"
														>
															<img
																src={URL.createObjectURL(
																	photo
																)}
																alt={`Photo ${
																	index + 1
																}`}
																className="w-full h-32 object-cover rounded-lg"
															/>
															<Button
																type="button"
																variant="destructive"
																size="sm"
																className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
																onClick={() =>
																	removePhoto(
																		index
																	)
																}
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													)
												)}
											</div>
										)}
									</div>
								</div>
							)}

							{/* Step 3: Review & Submit */}
							{currentStep === 3 && (
								<div className="space-y-6">
									<div className="bg-green-50 border border-green-200 rounded-xl p-6">
										<h3 className="font-semibold text-green-800 mb-4 flex items-center">
											<CheckCircle className="h-5 w-5 mr-2" />
											Review Your Report
										</h3>
										<div className="space-y-4">
											<div>
												<Label className="text-sm font-medium text-gray-600">
													Issue Title
												</Label>
												<p className="text-gray-900 font-medium">
													{formData.title}
												</p>
											</div>
											<div>
												<Label className="text-sm font-medium text-gray-600">
													Category
												</Label>
												<Badge
													variant="secondary"
													className="bg-green-100 text-green-700"
												>
													{formData.category}
												</Badge>
											</div>
											<div>
												<Label className="text-sm font-medium text-gray-600">
													Urgency
												</Label>
												<Badge
													variant="secondary"
													className={
														formData.urgency ===
														"high"
															? "bg-red-100 text-red-700"
															: formData.urgency ===
															  "medium"
															? "bg-orange-100 text-orange-700"
															: "bg-green-100 text-green-700"
													}
												>
													{formData.urgency}
												</Badge>
											</div>
											<div>
												<Label className="text-sm font-medium text-gray-600">
													Location
												</Label>
												<p className="text-gray-900 font-medium">
													{formData.location}
												</p>
											</div>
											<div>
												<Label className="text-sm font-medium text-gray-600">
													Description
												</Label>
												<p className="text-gray-900">
													{formData.description}
												</p>
											</div>
											{formData.photos.length > 0 && (
												<div>
													<Label className="text-sm font-medium text-gray-600">
														Photos
													</Label>
													<p className="text-gray-900">
														{formData.photos.length}{" "}
														photo(s) attached
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className="flex items-center justify-between pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handlePrevious}
									disabled={currentStep === 1}
									className="border-green-300 text-green-700 hover:bg-green-50"
								>
									Previous
								</Button>

								{currentStep < totalSteps ? (
									<Button
										type="button"
										onClick={handleNext}
										className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
									>
										Next Step
									</Button>
								) : (
									<Button
										type="submit"
										disabled={isSubmitting}
										className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
									>
										{isSubmitting ? (
											<div className="flex items-center space-x-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
												<span>
													Submitting Report...
												</span>
											</div>
										) : (
											<div className="flex items-center space-x-2">
												<CheckCircle className="h-5 w-5" />
												<span>Submit Report</span>
											</div>
										)}
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ReportForm;
