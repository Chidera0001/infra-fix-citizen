
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in-progress" | "resolved";
  urgency?: "low" | "medium" | "high";
  location: string;
  date: string;
  reportedBy: string;
  upvotes: number;
  comments: number;
  image?: string;
}

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Large Pothole on Victoria Island",
    description: "Deep pothole causing damage to vehicles. Located near the intersection of Ahmadu Bello Way and Ozumba Mbadiwe Avenue.",
    category: "Pothole",
    status: "open",
    urgency: "high",
    location: "Victoria Island, Lagos",
    date: "2024-06-07",
    reportedBy: "John Adebayo",
    upvotes: 23,
    comments: 5,
  },
  {
    id: "2",
    title: "Broken Streetlight on Allen Avenue",
    description: "Streetlight has been out for 3 weeks, making the area dangerous at night.",
    category: "Streetlight",
    status: "in-progress",
    urgency: "medium",
    location: "Allen Avenue, Ikeja",
    date: "2024-06-05",
    reportedBy: "Sarah Okafor",
    upvotes: 15,
    comments: 3,
  },
  {
    id: "3",
    title: "Water Supply Disruption in Surulere",
    description: "No water supply for the past 4 days in the residential area. Affects multiple households.",
    category: "Water Supply",
    status: "open",
    urgency: "high",
    location: "Surulere, Lagos",
    date: "2024-06-06",
    reportedBy: "Michael Oluwaseun",
    upvotes: 31,
    comments: 8,
  },
  {
    id: "4",
    title: "Malfunctioning Traffic Light",
    description: "Traffic light stuck on red, causing major traffic congestion during rush hours.",
    category: "Traffic Light",
    status: "resolved",
    urgency: "high",
    location: "Oshodi Interchange",
    date: "2024-06-03",
    reportedBy: "Fatima Hassan",
    upvotes: 42,
    comments: 12,
  },
  {
    id: "5",
    title: "Blocked Drainage System",
    description: "Drainage is completely blocked, causing flooding during rain. Urgent attention needed.",
    category: "Drainage",
    status: "in-progress",
    urgency: "high",
    location: "Lekki Phase 1",
    date: "2024-06-04",
    reportedBy: "Ahmed Ibrahim",
    upvotes: 28,
    comments: 6,
  },
  {
    id: "6",
    title: "Damaged Road Surface",
    description: "Multiple potholes and cracks making the road nearly impassable for vehicles.",
    category: "Road Damage",
    status: "open",
    urgency: "medium",
    location: "Apapa Road",
    date: "2024-06-02",
    reportedBy: "Grace Nneka",
    upvotes: 19,
    comments: 4,
  },
  {
    id: "7",
    title: "Non-functional Street Lamp",
    description: "Street lamp post damaged in storm, needs replacement for pedestrian safety.",
    category: "Streetlight",
    status: "open",
    urgency: "low",
    location: "Yaba, Lagos",
    date: "2024-06-01",
    reportedBy: "David Okoro",
    upvotes: 8,
    comments: 2,
  },
  {
    id: "8",
    title: "Burst Water Pipe",
    description: "Water pipe burst underground, wasting water and creating muddy conditions.",
    category: "Water Supply",
    status: "resolved",
    urgency: "medium",
    location: "Gbagada Estate",
    date: "2024-05-30",
    reportedBy: "Blessing Ugochukwu",
    upvotes: 16,
    comments: 7,
  },
];
