import { useToast } from "@/hooks/use-toast";

interface FormData {
	title: string;
	description: string;
	address: string;
}

export const useFormValidation = () => {
	const { toast } = useToast();

	const validateForm = (formData: FormData): boolean => {
		// Validate required fields
		if (!formData.title.trim()) {
			toast({
				title: "Validation Error",
				description: "Please enter an issue title",
				variant: "destructive",
			});
			return false;
		}
		
		if (!formData.description.trim()) {
			toast({
				title: "Validation Error", 
				description: "Please enter an issue description",
				variant: "destructive",
			});
			return false;
		}
		
		// Validate description length (minimum 20 characters - matches database constraint)
		if (formData.description.trim().length < 20) {
			toast({
				title: "Description too short",
				description: "Please provide a more detailed description (at least 20 characters).",
				variant: "destructive",
			});
			return false;
		}
		
		// Validate title length (minimum 10 characters - matches database constraint)
		if (formData.title.trim().length < 10) {
			toast({
				title: "Title too short",
				description: "Please provide a more descriptive title (at least 10 characters).",
				variant: "destructive",
			});
			return false;
		}
		
		// Validate title length (maximum 100 characters)
		if (formData.title.trim().length > 100) {
			toast({
				title: "Title too long",
				description: "Please provide a shorter title (maximum 100 characters).",
				variant: "destructive",
			});
			return false;
		}
		
		// Validate title contains only valid characters (letters, numbers, spaces, basic punctuation)
		const titleRegex = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
		if (!titleRegex.test(formData.title.trim())) {
			toast({
				title: "Invalid characters in title",
				description: "Title can only contain letters, numbers, spaces, and basic punctuation.",
				variant: "destructive",
			});
			return false;
		}
		
		// Validate title doesn't start or end with special characters
		const cleanTitle = formData.title.trim();
		if (!/^[a-zA-Z0-9]/.test(cleanTitle) || !/[a-zA-Z0-9]$/.test(cleanTitle)) {
			toast({
				title: "Invalid title format",
				description: "Title must start and end with a letter or number.",
				variant: "destructive",
			});
			return false;
		}
		
		// Validate description length (maximum 1000 characters)
		if (formData.description.trim().length > 1000) {
			toast({
				title: "Description too long",
				description: "Please provide a shorter description (maximum 1000 characters).",
				variant: "destructive",
			});
			return false;
		}
		
		if (!formData.address.trim()) {
			toast({
				title: "Validation Error",
				description: "Please enter an address",
				variant: "destructive",
			});
			return false;
		}

		return true;
	};

	const cleanTitle = (title: string): string => {
		let cleanTitle = title.trim().replace(/\s+/g, ' '); // Replace multiple spaces with single space
		
		// Additional cleaning to avoid potential constraint issues
		cleanTitle = cleanTitle.replace(/[^\w\s\-_.,!?()]/g, ''); // Remove any problematic characters
		cleanTitle = cleanTitle.replace(/^[\s\-_.,!?()]+|[\s\-_.,!?()]+$/g, ''); // Remove leading/trailing special chars
		
		return cleanTitle;
	};

	return { validateForm, cleanTitle };
};
