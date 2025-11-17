import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { ISSUE_CATEGORIES } from '@/constants';

interface AdminCommunityFiltersProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  searchLocation: { lat: number; lng: number } | null;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
  usingCurrentLocation: boolean;
}

// Common areas in Nigeria (can be expanded)
const COMMON_AREAS = [
  { name: 'Lagos Island', lat: 6.4541, lng: 3.3947 },
  { name: 'Ikeja', lat: 6.5954, lng: 3.3387 },
  { name: 'Victoria Island', lat: 6.4281, lng: 3.4219 },
  { name: 'Lekki', lat: 6.4474, lng: 3.5566 },
  { name: 'Abuja', lat: 9.0765, lng: 7.3986 },
  { name: 'Port Harcourt', lat: 4.8156, lng: 7.0498 },
  { name: 'Kano', lat: 12.0022, lng: 8.5919 },
];

export function AdminCommunityFilters({
  radius,
  onRadiusChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  searchLocation,
  onLocationChange,
  usingCurrentLocation,
}: AdminCommunityFiltersProps) {
  const [selectedArea, setSelectedArea] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const handleAreaSelect = (areaName: string) => {
    setSelectedArea(areaName);
    const area = COMMON_AREAS.find(a => a.name === areaName);
    if (area) {
      onLocationChange({ lat: area.lat, lng: area.lng });
      setManualLat('');
      setManualLng('');
    }
  };

  const handleManualSearch = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onLocationChange({ lat, lng });
      setSelectedArea('');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Location Search */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Search Location</Label>
          
          {/* Area Selector */}
          <Select value={selectedArea} onValueChange={handleAreaSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select an area" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_AREAS.map(area => (
                <SelectItem key={area.name} value={area.name}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Manual Coordinates */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Or enter coordinates manually</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Latitude"
                value={manualLat}
                onChange={e => setManualLat(e.target.value)}
                step="0.0001"
                min="-90"
                max="90"
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={manualLng}
                onChange={e => setManualLng(e.target.value)}
                step="0.0001"
                min="-180"
                max="180"
              />
              <Button
                onClick={handleManualSearch}
                disabled={!manualLat || !manualLng}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Current Location Display */}
          {searchLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>
                {usingCurrentLocation ? (
                  <span className="text-green-600 font-medium">Using your current location</span>
                ) : (
                  selectedArea || `${searchLocation.lat.toFixed(4)}, ${searchLocation.lng.toFixed(4)}`
                )}
              </span>
            </div>
          )}
        </div>

        {/* Other Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Radius Slider */}
          <div className="space-y-2">
            <Label htmlFor="radius" className="text-sm font-medium">
              Search Radius: {radius} km
            </Label>
            <Slider
              id="radius"
              min={1}
              max={20}
              step={1}
              value={[radius]}
              onValueChange={values => onRadiusChange(values[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={selectedCategory || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? '' : value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ISSUE_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sortBy" className="text-sm font-medium">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger id="sortBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="distance">Nearest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

