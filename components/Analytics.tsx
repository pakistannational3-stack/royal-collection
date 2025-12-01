import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Product } from '../types';

interface AnalyticsProps {
  products: Product[];
  currency: string;
}

// Gold, Amber, Bronze, Dark Slate, Muted Gold, White/Gray
const COLORS = ['#d97706', '#b45309', '#f59e0b', '#78350f', '#fbbf24', '#525252'];

const Analytics: React.FC<AnalyticsProps> = ({ products, currency }) => {
  
  // Data Preparation
  const categoryData = products.reduce((acc, product) => {
    const totalStock = product.subProducts.reduce((sum, sp) => sum + sp.quantity, 0);
    const existing = acc.find(c => c.name === product.category);
    if (existing) {
      existing.value += totalStock;
    } else {
      acc.push({ name: product.category, value: totalStock });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const productStockData = products.map(p => ({
    name: p.name,
    stock: p.subProducts.reduce((sum, sp) => sum + sp.quantity, 0),
    variants: p.subProducts.length
  }));

  const valueDistribution = products.map(p => ({
    name: p.name,
    value: p.subProducts.reduce((sum, sp) => sum + (sp.quantity * sp.price), 0)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-yellow-600/30 p-3 rounded shadow-xl text-slate-200">
          <p className="font-bold text-yellow-500 mb-1">{label}</p>
          <p className="text-sm">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-2">
      <h2 className="text-3xl font-bold text-yellow-500 mb-8 serif-font tracking-wide">Collection Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800">
          <h3 className="text-lg font-semibold mb-6 text-slate-300 border-b border-neutral-800 pb-2">Stock by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#171717"
                  strokeWidth={2}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#525252' }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Stock Levels */}
        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800">
          <h3 className="text-lg font-semibold mb-6 text-slate-300 border-b border-neutral-800 pb-2">Total Stock per Product</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#525252" />
                <ReTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#a3a3a3' }} />
                <Bar dataKey="stock" name="Total Units" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-slate-300 border-b border-neutral-800 pb-2">Total Inventory Valuation ({currency})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" stroke="#525252" tick={{fill: '#a3a3a3'}} />
                <YAxis stroke="#525252" tick={{fill: '#a3a3a3'}} />
                <ReTooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                <Bar dataKey="value" name="Total Value" fill="#b45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;