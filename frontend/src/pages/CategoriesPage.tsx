import React, { useState } from 'react';
import { Tag, Plus, Utensils, Car, ShoppingBag, Home, Tv, Heart, Briefcase, X } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  iconName: string;
  itemCount: number;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Food & Dining', color: 'bg-emerald-500', iconName: 'Utensils', itemCount: 24 },
  { id: '2', name: 'Housing & Rent', color: 'bg-indigo-500', iconName: 'Home', itemCount: 12 },
  { id: '3', name: 'Shopping', color: 'bg-amber-500', iconName: 'ShoppingBag', itemCount: 18 },
  { id: '4', name: 'Transportation', color: 'bg-sky-500', iconName: 'Car', itemCount: 30 },
  { id: '5', name: 'Subscriptions', color: 'bg-violet-500', iconName: 'Tv', itemCount: 8 },
];

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-pink-500');

  const colorOptions = [
    'bg-pink-500', 'bg-rose-500', 'bg-purple-500', 
    'bg-cyan-500', 'bg-teal-500', 'bg-orange-500'
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCategory: CategoryItem = {
      id: Date.now().toString(),
      name: newCatName,
      color: selectedColor,
      iconName: 'Tag',
      itemCount: 0,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCatName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Expense Categories</h1>
          <p className="text-slate-400 text-xs mt-0.5">Organize and manage your transaction tagging system.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white font-bold shadow-md`}>
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <p className="text-[11px] text-slate-400">{cat.itemCount} transactions linked</p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
              Active
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Healthcare, Gym, Education..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Color Tag</label>
                <div className="flex gap-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full ${c} ${selectedColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};