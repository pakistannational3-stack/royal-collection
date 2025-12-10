import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Mic, Download, 
  ChevronDown, ChevronRight, AlertTriangle, Edit, Trash2, MicOff, Mail, FileJson, Upload, Loader2, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { processInventoryCommand } from './services/geminiService';
import { Product, SubProduct, Alert, ActionType, InventoryAction } from './types';

// --- Storage Keys ---
const STORAGE_KEY = 'royal-inventory-data';
const CURRENCY_KEY = 'royal-inventory-currency';

// --- Speech Recognition Types ---
interface SpeechRecognitionResult {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResult;
    };
  
    // Minimal UI return to complete the App component and avoid syntax errors.
    // Replace this placeholder with the real app JSX if more UI exists below.
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-yellow-500">Royal Inventory</h1>
        <p className="text-slate-400 mt-2">Manage products and variants from the app.</p>
      </div>
    );
  };
  
  export default App;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

// --- Product Form Component ---
const ProductForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData?: Product;
  currency: string;
}> = ({ isOpen, onClose, onSave, initialData, currency }) => {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    category: '',
    description: '',
    basePrice: 0,
    image: '',
    remarks: '',
    alertLimit: 10,
    subProducts: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: '',
        category: '',
        description: '',
        basePrice: 0,
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400',
        remarks: '',
        alertLimit: 10,
        subProducts: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'alertLimit' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-yellow-600/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <h2 className="text-2xl font-bold text-yellow-500">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 text-slate-400 hover:text-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white" placeholder="e.g. Royal Velvet Chair" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Category</label>
              <input required name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-white" placeholder="e.g. Furniture" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-white" rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Base Price ({currency})</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Alert Limit</label>
              <input type="number" name="alertLimit" value={formData.alertLimit} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Product Image URL</label>
            <input name="image" value={formData.image} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-white" placeholder="Image URL" />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Remarks</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-white" rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 hover:text-white hover:bg-neutral-800 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black rounded-lg font-bold shadow-lg transition-all">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SubProduct Form Component ---
const SubProductForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: SubProduct) => void;
  initialData?: SubProduct;
  parentName: string;
  currency: string;
}> = ({ isOpen, onClose, onSave, initialData, parentName, currency }) => {
  const [formData, setFormData] = useState<SubProduct>({
    id: '',
    sku: '',
    name: '',
    description: '',
    color: '',
    price: 0,
    quantity: 0,
    weight: '',
    dimensions: '',
    image: '',
    remarks: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        name: '',
        description: '',
        color: '',
        price: 0,
        quantity: 0,
        weight: '0.5kg',
        dimensions: '10x10x2cm',
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=200',
        remarks: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-yellow-600/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-yellow-500">{initialData ? 'Edit Variant' : 'Add Variant'}</h2>
            <p className="text-sm text-slate-400 mt-1">for <span className="text-white font-medium">{parentName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 text-slate-400 hover:text-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4 border-b border-neutral-800 pb-4">
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Variant Name (Optional)</label>
              <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" placeholder={parentName} />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Description (Optional)</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">SKU</label>
              <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Color/Type</label>
              <input required name="color" value={formData.color} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Price ({currency})</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Weight</label>
              <input name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Dimensions</label>
              <input name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-600 uppercase mb-2">Image URL</label>
            <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg font-bold shadow-md transition-all">
              Save Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Analytics Component ---
const Analytics: React.FC<{ products: Product[]; currency: string }> = ({ products, currency }) => {
  const COLORS = ['#d97706', '#b45309', '#f59e0b', '#78350f', '#fbbf24', '#525252'];

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
    stock: p.subProducts.reduce((sum, sp) => sum + sp.quantity, 0)
  }));

  const valueData = products.map(p => ({
    name: p.name,
    value: p.subProducts.reduce((sum, sp) => sum + (sp.quantity * sp.price), 0)
  }));

  return (
    <div className="space-y-8 p-2">
      <h2 className="text-3xl font-bold text-yellow-500 mb-8">Collection Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  dataKey="value"
                  stroke="#171717"
                  strokeWidth={2}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800">
          <h3 className="text-lg font-semibold mb-6 text-slate-300 border-b border-neutral-800 pb-2">Stock per Product</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#525252" />
                <Bar dataKey="stock" name="Units" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-slate-300 border-b border-neutral-800 pb-2">Inventory Value ({currency})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" stroke="#525252" />
                <YAxis stroke="#525252" />
                <Bar dataKey="value" name="Value" fill="#b45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [currency, setCurrency] = useState(() => localStorage.getItem(CURRENCY_KEY) || '$');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics'>('inventory');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isSubProductFormOpen, setIsSubProductFormOpen] = useState(false);
  const [editingSubProduct, setEditingSubProduct] = useState<SubProduct | undefined>(undefined);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProducts(parsed);
      } catch (e) {
        console.error('Failed to parse saved data');
      }
    }
    setIsLoading(false);
  }, []);

  // Save data
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoading]);

  // Update alerts
  useEffect(() => {
    const newAlerts: Alert[] = [];
    products.forEach(p => {
      p.subProducts.forEach(sp => {
        if (sp.quantity <= p.alertLimit) {
          newAlerts.push({
            id: `${p.id}-${sp.id}`,
            productName: sp.name || p.name,
            sku: sp.sku,
            currentQuantity: sp.quantity,
            limit: p.alertLimit,
            timestamp: Date.now()
          });
        }
      });
    });
    setAlerts(newAlerts);
  }, [products]);

  // Save currency
  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus("Listening...");
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatus("");
      };

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceStatus("Processing with AI...");
        await handleVoiceCommand(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, [products]);

  const handleVoiceCommand = async (transcript: string) => {
    try {
      // Create context summary for AI
      const contextSummary = products.map(p => `${p.name} (${p.category})`).join(', ');
      
      // Process with AI
      const action: InventoryAction = await processInventoryCommand(transcript, contextSummary);
      
      setVoiceStatus(action.reason || "Processing...");
      
      // Execute the action
      switch (action.type) {
        case ActionType.CREATE_PRODUCT:
          if (action.data) {
            const newProduct: Product = {
              id: crypto.randomUUID(),
              name: action.data.name || action.productName || 'New Product',
              category: action.data.category || 'General',
              description: action.data.description || '',
              basePrice: action.data.basePrice || 0,
              image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400',
              remarks: action.data.remarks || '',
              alertLimit: action.data.alertLimit || 10,
              subProducts: []
            };
            setProducts(prev => [...prev, newProduct]);
            setTimeout(() => {
              alert(`✅ Created: ${newProduct.name}`);
              setVoiceStatus('');
            }, 500);
          }
          break;
          
        case ActionType.ADD_SUB_PRODUCT:
          if (action.productName && action.data) {
            const targetProduct = products.find(p => 
              p.name.toLowerCase().includes(action.productName!.toLowerCase())
            );
            
            if (targetProduct) {
              const newSub: SubProduct = {
                id: crypto.randomUUID(),
                sku: action.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
                name: action.data.name || '',
                description: action.data.description || '',
                color: action.color || action.data.color || 'Default',
                price: action.data.price || targetProduct.basePrice,
                quantity: action.data.quantity || 0,
                weight: action.data.weight || '0.5kg',
                dimensions: action.data.dimensions || '10x10x2cm',
                image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=200',
                remarks: action.data.remarks || ''
              };
              
              setProducts(prev => prev.map(p => 
                p.id === targetProduct.id 
                  ? { ...p, subProducts: [...p.subProducts, newSub] }
                  : p
              ));
              
              setTimeout(() => {
                alert(`✅ Added variant "${newSub.name || newSub.color}" to ${targetProduct.name}`);
                setVoiceStatus('');
              }, 500);
            } else {
              alert(`❌ Product "${action.productName}" not found`);
              setVoiceStatus('');
            }
          }
          break;
          
        case ActionType.UPDATE_STOCK:
          if (action.quantityChange !== undefined) {
            let updated = false;
            
            setProducts(prev => prev.map(p => {
              // Try to match by product name
              if (action.productName && p.name.toLowerCase().includes(action.productName.toLowerCase())) {
                return {
                  ...p,
                  subProducts: p.subProducts.map(sp => {
                    // Try SKU first, then color
                    if ((action.sku && sp.sku === action.sku) || 
                        (action.color && sp.color.toLowerCase() === action.color.toLowerCase()) ||
                        (!action.sku && !action.color && p.subProducts.length === 1)) {
                      updated = true;
                      return {
                        ...sp,
                        quantity: Math.max(0, sp.quantity + action.quantityChange!)
                      };
                    }
                    return sp;
                  })
                };
              }
              return p;
            }));
            
            setTimeout(() => {
              if (updated) {
                alert(`✅ Stock updated: ${action.quantityChange > 0 ? 'Added' : 'Removed'} ${Math.abs(action.quantityChange)} units`);
              } else {
                alert(`❌ Item not found`);
              }
              setVoiceStatus('');
            }, 500);
          }
          break;
          
        default:
          alert(`❓ ${action.reason || "Command not understood. Try: 'Add 10 stock to SKU-1234' or 'Create a new chair product'"}`);
          setVoiceStatus('');
      }
      
    } catch (error) {
      console.error('Voice command error:', error);
      alert('❌ Failed to process command');
      setVoiceStatus('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleExport = () => {
    const headers = ['Product', 'Category', 'SKU', 'Color', 'Price', 'Quantity', 'Weight', 'Dimensions', 'Remarks'];

    // Flatten products -> subProducts into CSV rows
    const rows: (string | number)[][] = products.flatMap(p =>
      p.subProducts.map(sp => [
        p.name,
        p.category,
        sp.sku,
        sp.color,
        sp.price,
        sp.quantity,
        sp.weight,
        sp.dimensions,
        sp.remarks || ''
      ])
    );

    // Helper to escape CSV values
    const escapeCsv = (value: string | number) => {
      const str = String(value ?? '');
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `royal_inventory_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };