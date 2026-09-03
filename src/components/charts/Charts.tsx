import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ReferenceLine,
} from 'recharts';
import { riskDistribution, riskTrendData } from '@/data/mockData';

// Shared dark tooltip style
const darkTooltipStyle = {
  fontSize: '12px',
  borderRadius: '8px',
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)',
  color: '#f8fafc',
  backdropFilter: 'blur(12px)',
};

const darkTooltipItemStyle = {
  color: '#e2e8f0',
  fontSize: '12px',
  paddingTop: '2px',
  paddingBottom: '2px',
};

const darkTooltipLabelStyle = {
  color: '#f8fafc',
  fontWeight: 600,
  fontSize: '12px',
  marginBottom: '4px',
};

const darkCursorStyle = {
  fill: 'rgba(255, 255, 255, 0.05)',
};

const gridStroke = 'rgba(148, 163, 184, 0.06)';

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
            contentStyle={darkTooltipStyle}
            itemStyle={darkTooltipItemStyle}
            labelStyle={darkTooltipLabelStyle}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[24px] font-bold text-white tabular-nums animate-number">{total.toLocaleString('en-IN')}</span>
        <span className="text-[11px] text-slate-400">Total Projects</span>
      </div>
    </div>
  );
}

export function RiskTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={riskTrendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={darkTooltipStyle} itemStyle={darkTooltipItemStyle} labelStyle={darkTooltipLabelStyle} cursor={darkCursorStyle} />
        <Line type="monotone" dataKey="flagged" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: '#38bdf8' }} name="Total Flagged" />
        <Line type="monotone" dataKey="highPriority" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: '#f87171' }} name="High Priority" />
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
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
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
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <ReferenceLine y={8250} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Benchmark ₹8,250', position: 'right', fill: '#94a3b8', fontSize: 10 }} />
        <Bar dataKey="unitPrice" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isCurrent ? '#f87171' : '#3b82f6'} />
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
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#cbd5e1' }} axisLine={false} tickLine={false} width={80} />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Bid Amount']}
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isWinner ? '#3b82f6' : '#475569'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 1. Contractor Tender Participation Frequency Chart (Prompt 05)
export function ContractorParticipationChart({ data }: { data: { name: string; count: number; won: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#cbd5e1' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={45}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(val: number, name: string) => [val, name === 'count' ? 'Tenders Participated' : 'Tenders Awarded']}
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <Bar dataKey="count" fill="#475569" name="Participated" radius={[4, 4, 0, 0]} />
        <Bar dataKey="won" fill="#3b82f6" name="Won" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 2. Award Value Over Time Chart (Prompt 06)
export function AwardValueTrendChart({ data }: { data: { year: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip
          formatter={(val: number) => [`₹${(val / 100000).toFixed(1)} Lakhs`, 'Awarded Value']}
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 3. Contractor Delay Trend Chart (Prompt 06)
export function DelayTrendChart({ data }: { data: { year: string; contractorDelay: number; peerMedian: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 15, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip
          formatter={(val: number, name: string) => [`${val}%`, name === 'contractorDelay' ? 'Contractor Delay Rate' : 'Peer Group Median']}
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <Line type="monotone" dataKey="contractorDelay" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3, fill: '#fbbf24' }} name="Contractor Delay Rate" />
        <Line type="monotone" dataKey="peerMedian" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2, fill: '#64748b' }} name="Peer Group Median" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// 4. Expenditure Over Time Time-Series Chart (Prompt 11)
export function ExpenditureTimelineChart({ data }: { data: { date: string; cumulativeExp: number; plannedTarget: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 15, bottom: 5, left: -5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip
          formatter={(val: number, name: string) => [`₹${(val / 100000).toFixed(1)} Lakhs`, name === 'cumulativeExp' ? 'Actual Disbursed' : 'Planned Budget']}
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <Line type="monotone" dataKey="cumulativeExp" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: '#38bdf8' }} name="Actual Disbursed" />
        <Line type="monotone" dataKey="plannedTarget" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2, fill: '#64748b' }} name="Planned Target" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// 5. Benford's Law Forensic Accounting Distribution Chart
export interface BenfordPoint {
  digit: number;
  actualPct: number;
  expectedPct: number;
  anomalyFlag?: boolean;
}

const defaultBenfordData: BenfordPoint[] = [
  { digit: 1, actualPct: 12.0, expectedPct: 30.1 },
  { digit: 2, actualPct: 8.5, expectedPct: 17.6 },
  { digit: 3, actualPct: 11.2, expectedPct: 12.5 },
  { digit: 4, actualPct: 12.0, expectedPct: 9.7 },
  { digit: 5, actualPct: 9.8, expectedPct: 7.9 },
  { digit: 6, actualPct: 4.8, expectedPct: 6.7 },
  { digit: 7, actualPct: 22.6, expectedPct: 5.8, anomalyFlag: true },
  { digit: 8, actualPct: 19.1, expectedPct: 5.1, anomalyFlag: true },
  { digit: 9, actualPct: 0.0, expectedPct: 4.6 },
];

export function BenfordDistributionChart({ data = defaultBenfordData }: { data?: BenfordPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 15, right: 15, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis
          dataKey="digit"
          tick={{ fontSize: 11, fill: '#cbd5e1' }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'First Digit (1 - 9)', position: 'insideBottom', offset: -4, fill: '#94a3b8', fontSize: 10 }}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip
          formatter={(val: number, name: string) => [`${val}%`, name === 'actualPct' ? 'Observed Invoice Digit Frequency' : 'Benford Expected Frequency']}
          contentStyle={darkTooltipStyle}
          itemStyle={darkTooltipItemStyle}
          labelStyle={darkTooltipLabelStyle}
          cursor={darkCursorStyle}
        />
        <Bar dataKey="expectedPct" fill="#475569" name="Benford Natural Law Baseline" radius={[4, 4, 0, 0]} />
        <Bar dataKey="actualPct" name="Observed Invoices / Measurement Book" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.anomalyFlag ? '#f87171' : '#38bdf8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

