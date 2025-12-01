import React, { useState, useEffect } from 'react';
import { SubProduct } from '../types';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface SubProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subProduct: SubProduct) => void;
  initialData?: SubProduct;
  parentName: string;
  currency: string;
}

const SubProductForm: React.FC<SubProductFormProps> = ({ isOpen, onClose, onSave, initialData, parentName, currency }) => {
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
        image: `https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=200`,
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
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-yellow-600/20 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-yellow-500 serif-font">{initialData ? 'Edit Variant' : 'Add Variant'}</h2>
            <p className="text-sm text-slate-400 mt-1">for <span className="text-white font-medium">{parentName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 text-slate-400 hover:text-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Variant Specific Identity */}
          <div className="space-y-4 border-b border-neutral-800 pb-4">
             <div>
               <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Variant Name (Optional)</label>
               <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" placeholder={parentName} />
               <p className="text-[10px] text-slate-500 mt-1">Leave blank to use Product Name</p>
             </div>
             <div>
               <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Specific Description (Optional)</label>
               <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" placeholder="Details specific to this variant..." />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">SKU</label>
              <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Color/Variant</label>
              <input required name="color" value={formData.color} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" placeholder="e.g. Gold, XL" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Price ({currency})</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
             <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Weight</label>
              <input name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Dimensions</label>
              <input name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-slate-200 focus:border-yellow-600 outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-600 uppercase mb-2 tracking-wider">Variant Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-neutral-700 rounded bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                 {formData.image ? (
                   <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <ImageIcon size={20} className="text-neutral-600" />
                 )}
              </div>
              <label className="cursor-pointer px-4 py-2 border border-neutral-700 rounded hover:bg-neutral-800 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors uppercase tracking-wide">
                <Upload size={14} /> Upload
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800 mt-2">
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

export default SubProductForm;