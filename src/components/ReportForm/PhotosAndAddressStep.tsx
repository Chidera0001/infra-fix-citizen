import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Image as ImageIcon, X } from "lucide-react";

interface PhotosAndAddressStepProps {
	formData: {
		address: string;
		photos: File[];
	};
	setFormData: React.Dispatch<React.SetStateAction<any>>;
	locationMethod: "current" | "map" | null;
	onNext: () => void;
}

const PhotosAndAddressStep = ({
	formData,
	setFormData,
	locationMethod,
	onNext,
}: PhotosAndAddressStepProps) => {
	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		
		// Check total number of photos
		const totalPhotos = formData.photos.length + files.length;
		if (totalPhotos > 5) {
			alert('Maximum 5 photos allowed per report');
			return;
		}
		
		// Check file size for each photo
		for (const file of files) {
			if (file.size > 2 * 1024 * 1024) { // 2MB
				const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
				alert(`File "${file.name}" is too large (${fileSizeMB}MB). Maximum size is 2MB per image.`);
				return;
			}
		}
		
		setFormData({ ...formData, photos: [...formData.photos, ...files] });
	};

	const removePhoto = (index: number) => {
		const newPhotos = formData.photos.filter((_, i) => i !== index);
		setFormData({ ...formData, photos: newPhotos });
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label
					htmlFor="address"
					className="text-black font-medium"
				>
					Address Description *
				</Label>
				<Input
					id="address"
					placeholder="e.g., Main Street, Victoria Island, Lagos"
					value={formData.address}
					onChange={(e) =>
						setFormData({
							...formData,
							address: e.target.value,
						})
					}
					className={`border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl ${
						locationMethod === "current" ? "bg-green-50" : ""
					}`}
					required
				/>
				{locationMethod === "current" && (
					<p className="text-xs text-green-600 flex items-center space-x-1">
						<MapPin className="h-3 w-3" />
						<span>Address automatically detected from your location</span>
					</p>
				)}
			</div>

			<div className="space-y-4">
				<Label className="text-black font-medium">
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
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
			
			<div className="flex justify-center mt-6">
				<Button
					type="button"
					onClick={onNext}
					className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
				>
					Continue to Review
				</Button>
			</div>
		</div>
	);
};

export default PhotosAndAddressStep;
