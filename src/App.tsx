import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import AdminAuthGuard from "./components/AdminAuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/auth" element={<Auth />} />
					<Route path="/admin-login" element={<AdminLogin />} />
					<Route path="/" element={<Index />} />
					<Route
						path="/citizen"
						element={
							<AuthGuard requiredRole="citizen">
								<CitizenDashboard />
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
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
