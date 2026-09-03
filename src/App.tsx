import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AppLayout from '@/layouts/AppLayout';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import OverviewPage from '@/pages/OverviewPage';
import ConstituenciesPage from '@/pages/ConstituenciesPage';
import ProjectsPage from '@/pages/ProjectsPage';
import Project360Page from '@/pages/Project360Page';
import TendersPage, { TenderDetailPage } from '@/pages/TendersPage';
import ContractsPage, { ContractDetailPage } from '@/pages/ContractsPage';
import ContractorsPage, { ContractorProfilePage } from '@/pages/ContractorsPage';
import RiskExplorerPage from '@/pages/RiskExplorerPage';
import InvestigationCenterPage from '@/pages/InvestigationCenterPage';
import InvestigationCasePage from '@/pages/InvestigationCasePage';
import AIInvestigatorPage from '@/pages/AIInvestigatorPage';
import ReportsPage from '@/pages/ReportsPage';
import MethodologyPage from '@/pages/MethodologyPage';
import DataSourcesPage from '@/pages/DataSourcesPage';
import SystemStatusPage from '@/pages/SystemStatusPage';
import SettingsPage from '@/pages/SettingsPage';
import { ToastProvider } from '@/components/ui/Toast';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<AppLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/constituencies" element={<ConstituenciesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />

            <Route path="/projects/:id" element={<Project360Page />} />
            <Route path="/tenders" element={<TendersPage />} />
            <Route path="/tenders/:id" element={<TenderDetailPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/contracts/:id" element={<ContractDetailPage />} />
            <Route path="/contractors" element={<ContractorsPage />} />
            <Route path="/contractors/:id" element={<ContractorProfilePage />} />
            <Route path="/risk" element={<RiskExplorerPage />} />
            <Route path="/investigations" element={<InvestigationCenterPage />} />
            <Route path="/investigations/:id" element={<InvestigationCasePage />} />
            <Route path="/ai-investigator" element={<AIInvestigatorPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/system-status" element={<SystemStatusPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" subtitle="The requested page does not exist." />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
