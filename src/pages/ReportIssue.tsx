
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateOnlineIssue } from "@/hooks/use-separate-issues";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentLocationWithAddress } from "@/utils/geocoding";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CitiznLogo from "@/components/CitiznLogo";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createIssueMutation = useCreateOnlineIssue();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "",
    location: "",
    photo: null as File | null,
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter location manually.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    
    try {
      const { address } = await getCurrentLocationWithAddress();
      
      setFormData(prev => ({
        ...prev,
        location: address,
      }));
      
      setIsGettingLocation(false);
      
      toast({
        title: "Location captured successfully!",
        description: `Found: ${address}`,
      });
    } catch (error) {
      // Location error
      toast({
        title: "Location access denied",
        description: "Please allow location access or enter location manually.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const issueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        severity: formData.urgency || "medium",
        address: formData.location.trim(),
        location_lat: 6.5244, // Default Lagos coords - would need geocoding in real implementation
        location_lng: 3.3792,
      };

      await createIssueMutation.mutateAsync({
        issueData,
        userId: user?.id,
        photos: formData.photo ? [formData.photo] : []
      });

      setTimeout(() => {
        navigate('/citizen');
      }, 2000);
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/citizen')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <CitiznLogo size="sm" />
            <div>
              <h1 className="text-xl font-normal text-gray-900">Report Infrastructure Issue</h1>
              <p className="text-sm text-gray-600">Help improve your community</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Submit New Report</CardTitle>
            <CardDescription>
              Provide details about the infrastructure issue you've encountered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Large pothole on Main Street"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pothole">Pothole</SelectItem>
                      <SelectItem value="streetlight">Streetlight</SelectItem>
                      <SelectItem value="water-supply">Water Supply</SelectItem>
                      <SelectItem value="traffic-light">Traffic Light</SelectItem>
                      <SelectItem value="drainage">Drainage</SelectItem>
                      <SelectItem value="road-damage">Road Damage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Priority Level</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                      <SelectItem value="medium">Medium - Moderate impact</SelectItem>
                      <SelectItem value="high">High - Safety concern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="location"
                      placeholder="e.g., 123 Main Street, Lagos"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className={formData.location ? "bg-green-50" : ""}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex-shrink-0"
                    >
                      {isGettingLocation ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {formData.location && (
                    <p className="text-xs text-green-600 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>Location automatically detected</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="photo" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {formData.photo ? formData.photo.name : "Click to upload photo"}
                        </span>
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={createIssueMutation.isPending}
                >
                  {createIssueMutation.isPending ? "Submitting..." : "Submit Report"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/citizen')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
