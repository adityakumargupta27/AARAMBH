import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Settings" subtitle="Application preferences and configuration." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Profile" />
          <CardBody className="space-y-3">
            <div>
              <label className="label">Display Name</label>
              <input className="input" defaultValue="Demo Investigator" />
            </div>
            <div>
              <label className="label">Role</label>
              <input className="input" defaultValue="Investigation Desk" readOnly />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" defaultValue="investigator@aarambha.demo" readOnly />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Preferences" />
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="text-[13px] text-slate-700">High priority case alerts</span>
              </div>
              <span className="badge badge-risk-normal">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-[13px] text-slate-700">Risk threshold for alerts</span>
              </div>
              <span className="text-[12px] font-medium text-slate-600">Score ≥ 70</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span className="text-[13px] text-slate-700">Data refresh interval</span>
              </div>
              <span className="text-[12px] font-medium text-slate-600">Every 6 hours</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
