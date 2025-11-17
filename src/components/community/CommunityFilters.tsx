import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ISSUE_CATEGORIES } from '@/constants';

interface CommunityFiltersProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  maxRadius: number;
}

export function CommunityFilters({
  radius,
  onRadiusChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  maxRadius,
}: CommunityFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Radius Slider */}
          <div className="space-y-2">
            <Label htmlFor="radius" className="text-sm font-medium">
              Search Radius: {radius} km
            </Label>
            <Slider
              id="radius"
              min={1}
              max={maxRadius}
              step={1}
              value={[radius]}
              onValueChange={values => onRadiusChange(values[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 km</span>
              <span>{maxRadius} km</span>
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

