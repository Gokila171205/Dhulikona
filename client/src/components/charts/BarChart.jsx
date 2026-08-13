import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const BarChart = ({ data, dataKey, xAxisKey, xKey, yKey, fill, colors, name = 'Value' }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 text-sm">No data available</div>;
  }

  const actualXKey = xKey || xAxisKey || 'name';
  const actualYKey = yKey || dataKey || 'value';
  const actualFill = colors ? colors[0] : (fill || '#0085CA');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey={actualXKey} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
        <Tooltip 
          cursor={{ fill: '#F3F4F6' }} 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
        />
        <Bar dataKey={actualYKey} fill={actualFill} radius={[4, 4, 0, 0]} name={name} barSize={32} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
