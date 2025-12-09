'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CitizenDashboardProps {
  onBack: () => void;
}

const CitizenDashboard = ({ onBack }: CitizenDashboardProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-xl font-normal text-gray-900">This component has been moved</h1>
          <p className="text-gray-600">The CitizenDashboard is now available at /citizen route</p>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
