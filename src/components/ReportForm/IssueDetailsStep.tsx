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

interface IssueDetailsStepProps {
	formData: {
		title: string;
		description: string;
		category: string;
		severity: string;
	};
	setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const IssueDetailsStep = ({ formData, setFormData }: IssueDetailsStepProps) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				<div className="space-y-2">
					<Label
						htmlFor="title"
						className="text-black font-medium"
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
						maxLength={100}
						required
					/>
					<p className="text-xs text-gray-500 mt-1">
						{formData.title.length}/100 characters (minimum 10)
					</p>
				</div>

				<div className="space-y-2">
					<Label
						htmlFor="category"
						className="text-black font-medium"
					>
						Category *
					</Label>
					<Select
						onValueChange={(value) =>
							setFormData({
								...formData,
								category: value as any,
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
							<SelectItem value="street_lighting">
								Streetlight
							</SelectItem>
							<SelectItem value="drainage">
								Drainage
							</SelectItem>
							<SelectItem value="water_supply">
								Water Supply
							</SelectItem>
							<SelectItem value="traffic_signal">
								Traffic Signal
							</SelectItem>
							<SelectItem value="sidewalk">
								Sidewalk
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
					className="text-black font-medium"
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
					className="text-black font-medium"
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
					maxLength={1000}
					required
				/>
					<p className="text-xs text-gray-500 mt-1">
						{formData.description.length}/1000 characters (minimum 20)
					</p>
			</div>
		</div>
	);
};

export default IssueDetailsStep;
