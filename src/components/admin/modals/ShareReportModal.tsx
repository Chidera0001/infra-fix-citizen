import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
	Share2, 
	Copy, 
	ExternalLink, 
	Facebook, 
	Twitter, 
	Linkedin,
	Mail,
	MessageCircle,
	X,
	Check
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Issue } from "@/lib/supabase-api";

interface ShareReportModalProps {
	issue: Issue | null;
	isOpen: boolean;
	onClose: () => void;
}

const socialPlatforms = [
	{
		name: "Twitter",
		icon: Twitter,
		logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
		url: (url: string, text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
	},
	{
		name: "Facebook",
		icon: Facebook,
		logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
		url: (url: string, text: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
	},
	{
		name: "LinkedIn",
		icon: Linkedin,
		logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
		url: (url: string, text: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
	},
	{
		name: "Gmail",
		icon: Mail,
		logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
		url: (url: string, text: string) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check out this issue report: ${url}`)}`
	},
	{
		name: "WhatsApp",
		icon: MessageCircle,
		logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
		url: (url: string, text: string) => `https://wa.me/?text=${encodeURIComponent(`${text} - ${url}`)}`
	}
];

export const ShareReportModal = ({ issue, isOpen, onClose }: ShareReportModalProps) => {
	const [copied, setCopied] = useState(false);
	const [customMessage, setCustomMessage] = useState("");
	const [baseUrl, setBaseUrl] = useState("");

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setBaseUrl(window.location.origin);
		}
	}, []);

	const issueUrl = baseUrl ? `${baseUrl}/issue/${issue?.id}` : '';
	const defaultMessage = `Check out this infrastructure issue report: ${issue?.title}`;
	const shareMessage = customMessage || defaultMessage;

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(issueUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy link:", error);
		}
	};

	const handleSocialShare = (platform: typeof socialPlatforms[0]) => {
		const shareUrl = platform.url(issueUrl, shareMessage);
		window.open(shareUrl, "_blank", "width=600,height=400");
	};

	if (!issue) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogPortal>
				<DialogOverlay className="bg-black/20" />
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl [&>button]:hidden bg-white">
				<DialogHeader className="pb-6 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
							<div className="p-2 bg-green-100 rounded-lg">
								<Share2 className="h-5 w-5 text-green-600" />
							</div>
							Share Issue Report
						</DialogTitle>
						<Button variant="ghost" size="sm" onClick={onClose} className="text-black hover:text-gray-600">
							<X className="h-4 w-4" />
						</Button>
					</div>
				</DialogHeader>

				<div className="space-y-4">
					{/* Issue Preview */}
					<Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
						<CardContent className="p-5">
							<div className="flex items-start gap-4">
								<div className="flex-1">
									<h4 className="font-semibold text-gray-900 mb-2 text-lg">{issue.title}</h4>
									<p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{issue.description}</p>
									<div className="flex items-center gap-2">
										<Badge 
											variant="outline" 
											className={`text-xs capitalize px-3 py-1 ${
												issue.status === 'open' ? 'border-orange-200 bg-orange-50 text-orange-700' :
												issue.status.includes('progress') ? 'border-blue-200 bg-blue-50 text-blue-700' :
												issue.status === 'resolved' ? 'border-green-200 bg-green-50 text-green-700' :
												'border-gray-200 bg-gray-50 text-gray-700'
											}`}
										>
											{issue.status.replace('-', ' ')}
										</Badge>
										<Badge 
											variant="outline" 
											className={`text-xs capitalize px-3 py-1 ${
												issue.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' :
												issue.severity === 'high' ? 'border-orange-200 bg-orange-50 text-orange-700' :
												issue.severity === 'medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
												'border-green-200 bg-green-50 text-green-700'
											}`}
										>
											{issue.severity}
										</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Custom Message */}
					<div className="space-y-3">
						<Label htmlFor="message" className="text-sm font-medium text-gray-700">Custom Message (Optional)</Label>
						<Textarea
							id="message"
							placeholder={defaultMessage}
							value={customMessage}
							onChange={(e) => setCustomMessage(e.target.value)}
							rows={3}
							className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
						/>
					</div>

					{/* Direct Link */}
					<div className="space-y-3">
						<Label className="text-sm font-medium text-gray-700">Share Link</Label>
						<div className="flex gap-2">
							<Input
								value={issueUrl}
								readOnly
								className="font-mono text-sm border-gray-200 bg-gray-50 rounded-lg"
							/>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyLink}
								className={`flex-shrink-0 rounded-lg transition-colors ${
									copied ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300'
								}`}
							>
								{copied ? (
									<Check className="h-4 w-4 text-green-600" />
								) : (
									<Copy className="h-4 w-4" />
								)}
								{copied ? "Copied!" : "Copy"}
							</Button>
						</div>
					</div>

					{/* Social Media Platforms */}
					<div className="space-y-4">
						<Label className="text-sm font-medium text-gray-700">Share on Social Media</Label>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
							{socialPlatforms.map((platform) => {
								const Icon = platform.icon;
								return (
									<Button
										key={platform.name}
										variant="outline"
										onClick={() => handleSocialShare(platform)}
										className="flex items-center gap-2 justify-start h-12 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-md hover:scale-105"
									>
										{platform.logo ? (
											<img 
												src={platform.logo} 
												alt={`${platform.name} logo`} 
												className="h-5 w-5 object-contain"
											/>
										) : (
											<Icon className="h-5 w-5 text-gray-600" />
										)}
										<span className="text-sm font-medium text-gray-900">{platform.name}</span>
									</Button>
								);
							})}
						</div>
					</div>

					{/* Quick Access Info */}
					<div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-1 bg-green-100 rounded-md">
								<ExternalLink className="h-4 w-4 text-green-600" />
							</div>
							<span className="text-sm font-medium text-gray-800">Quick Access</span>
						</div>
						<p className="text-sm text-gray-600 leading-relaxed">
							Share this link to allow others to view the issue report directly. 
							The link includes all issue details, status updates, and images.
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
					<Button 
						variant="outline" 
						onClick={onClose}
						className="px-6 py-2 rounded-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors hover:scale-105" 
					>
						<X className="h-4 w-4 mr-2" />
						Close
					</Button>
				</div>
			</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};
