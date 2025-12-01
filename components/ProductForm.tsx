import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData?: Product;
  currency: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSave, initialData, currency }) => {
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
        image: `https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400`,
        remarks: '',
        alertLimit: 10,
        subProducts: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'alertLimit' ? Number(value) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-yellow-600/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <h2 className="text-2xl font-bold text-yellow-500 serif-font">
            {initialData ? 'Edit Masterpiece' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 text-slate-400 hover:text-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white placeholder-neutral-500 transition-all" placeholder="e.g. Royal Velvet Chair" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Category</label>
              <input required name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white placeholder-neutral-500 transition-all" placeholder="e.g. Furniture" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white placeholder-neutral-500 transition-all" rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Base Price ({currency})</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Alert Limit (Qty)</label>
              <input type="number" name="alertLimit" value={formData.alertLimit} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Product Image</label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800 shrink-0 flex items-center justify-center">
                   {formData.image ? (
                     <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <ImageIcon className="text-neutral-600" />
                   )}
                </div>
                <div className="flex-1">
                   <label className="cursor-pointer flex items-center gap-2 px-4 py-3 border border-neutral-700 rounded-lg hover:bg-neutral-800 text-sm font-medium text-slate-300 hover:text-white w-full justify-center transition-colors">
                     <Upload size={16} />
                     Select Image
                     <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                   </label>
                   <p className="text-xs text-neutral-500 mt-2">
                     Upload a high-quality image.
                   </p>
                </div>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-yellow-600/80 uppercase tracking-wide mb-2">Remarks</label>
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none text-white placeholder-neutral-500 transition-all" rows={3} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800 mt-2">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 hover:text-white hover:bg-neutral-800 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black rounded-lg font-bold shadow-lg shadow-yellow-900/20 transition-all transform hover:-translate-y-0.5">
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;