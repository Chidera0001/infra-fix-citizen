import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import AdminAuthGuard from "./components/admin/AdminAuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";
import ReportNow from "./pages/ReportNow";
import OfflineReportIssue from "./pages/OfflineReportIssue";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<AuthProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/auth" element={<Auth />} />
						<Route path="/admin-login" element={<AdminLogin />} />
						<Route path="/" element={<Index />} />
						<Route path="/offline-report" element={<OfflineReportIssue />} />
					<Route
						path="/citizen"
						element={
							<AuthGuard requiredRole="citizen">
								<CitizenDashboard />
							</AuthGuard>
						}
					/>
					<Route
						path="/report-now"
						element={
							<AuthGuard requiredRole="citizen">
								<ReportNow />
							</AuthGuard>
						}
					/>
					<Route
						path="/admin-citizn"
						element={
							<AdminAuthGuard>
								<AdminDashboard />
							</AdminAuthGuard>
						}
					/>
						<Route path="/api-docs" element={<ApiDocs />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
