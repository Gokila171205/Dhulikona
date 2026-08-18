import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PieChart = ({ data, colors, hideLegend = false }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 text-sm">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors ? colors[index % colors.length] : (entry.color || '#8884d8')} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
        {!hideLegend && <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
