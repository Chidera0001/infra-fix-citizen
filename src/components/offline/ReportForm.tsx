import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload } from 'lucide-react';
import { PhotoUploadSection } from './PhotoUploadSection';

interface ReportFormData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  location: string;
  photo: File | null;
}

interface ReportFormProps {
  formData: ReportFormData;
  onFormDataChange: (data: Partial<ReportFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isOnline: boolean;
}

export function ReportForm({ formData, onFormDataChange, onSubmit, isSubmitting, isOnline }: ReportFormProps) {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFormDataChange({ photo: file });
    }
  };

  const handlePhotoChange = (file: File | null) => {
    onFormDataChange({ photo: file });
  };

  // Validation checks
  const isTitleValid = formData.title.length >= 10 && formData.title.length <= 100;
  const isDescriptionValid = formData.description.length >= 20 && formData.description.length <= 1000;
  const isFormValid = isTitleValid && isDescriptionValid && formData.category && formData.location;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Submit New Report</CardTitle>
        <CardDescription>
          Provide details about the infrastructure issue you've encountered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Large pothole on Main Street"
                value={formData.title}
                onChange={(e) => onFormDataChange({ title: e.target.value })}
                required
                minLength={10}
                maxLength={100}
              />
              <div className="text-xs text-gray-500">
                {formData.title.length}/100 characters (minimum 10)
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => onFormDataChange({ category: value })}>
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

          {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed description of the issue..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => onFormDataChange({ description: e.target.value })}
                      required
                      minLength={20}
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500">
                      {formData.description.length}/1000 characters (minimum 20)
                    </div>
                  </div>

          {/* Priority and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="urgency">Priority Level</Label>
              <Select onValueChange={(value) => onFormDataChange({ urgency: value })}>
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
              <Input
                id="location"
                placeholder="e.g., 123 Main Street, Lagos"
                value={formData.location}
                onChange={(e) => onFormDataChange({ location: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <PhotoUploadSection 
            photo={formData.photo}
            onPhotoChange={handlePhotoChange}
          />

          {/* Submit Buttons */}
                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting || !isFormValid}
                    >
                      {isSubmitting ? "Saving Offline..." : "Save Report Offline"}
                    </Button>
                  </div>
                  
                  {!isFormValid && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Please fix the following issues:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {!isTitleValid && <li>Title must be between 10 and 100 characters</li>}
                        {!isDescriptionValid && <li>Description must be between 20 and 1000 characters</li>}
                        {!formData.category && <li>Please select a category</li>}
                        {!formData.location && <li>Please enter a location</li>}
                      </ul>
                    </div>
                  )}
        </form>
      </CardContent>
    </Card>
  );
}
