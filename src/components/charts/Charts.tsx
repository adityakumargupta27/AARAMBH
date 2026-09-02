import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ReferenceLine,
} from 'recharts';
import { riskDistribution, riskTrendData } from '@/data/mockData';

export function RiskDonutChart() {
  const total = riskDistribution.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={riskDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {riskDistribution.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [value.toLocaleString('en-IN'), '']}
            contentStyle={{
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[24px] font-bold text-slate-900 tabular-nums">{total.toLocaleString('en-IN')}</span>
        <span className="text-[11px] text-slate-400">Total Projects</span>
      </div>
    </div>
  );
}

export function RiskTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={riskTrendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <Line type="monotone" dataKey="flagged" stroke="#486581" strokeWidth={2} dot={{ r: 3, fill: '#486581' }} name="Total Flagged" />
        <Line type="monotone" dataKey="highPriority" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} name="High Priority" />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface PriceComparisonData {
  name: string;
  unitPrice: number;
  isCurrent: boolean;
}

export function PriceComparisonChart({ data }: { data: PriceComparisonData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Unit Price']}
          contentStyle={{
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <ReferenceLine y={8250} stroke="#486581" strokeDasharray="4 4" label={{ value: 'Benchmark ₹8,250', position: 'right', fill: '#486581', fontSize: 10 }} />
        <Bar dataKey="unitPrice" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isCurrent ? '#ef4444' : '#bcccdc'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface BidDistributionData {
  name: string;
  amount: number;
  isWinner: boolean;
}

export function BidDistributionChart({ data }: { data: BidDistributionData[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Bid Amount']}
          contentStyle={{
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isWinner ? '#243b53' : '#bcccdc'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
