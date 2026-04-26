import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { SystemCard, SystemButton } from './SystemUI';
import { cn } from '../lib/utils';

interface VaultItem {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
}

export const Vault = () => {
  const [items, setItems] = useState<VaultItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/vault')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const newItem: VaultItem = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: reader.result as string,
      };
      
      await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      setItems(prev => [...prev, newItem]);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/vault/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div 
      className={cn(
        "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 border-2 border-dashed p-6 rounded-xl transition-all",
        isDragging ? "border-system-purple bg-system-purple/10" : "border-transparent"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Student Vault</h1>
        <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">Store and manage your essential documents and images.</p>
        <SystemButton onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
          <Upload size={16} />
          Upload Document
        </SystemButton>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <SystemCard key={item.id} className="group relative">
            <div className="h-40 flex items-center justify-center bg-black/20 mb-4 rounded-lg overflow-hidden">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-16 h-16 text-system-purple/50" />
              )}
            </div>
            <h3 className="text-white font-black truncate">{item.name}</h3>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => window.open(item.url, '_blank')} 
                className="text-[10px] uppercase font-bold text-system-purple hover:text-system-purple/80"
              >
                Open File
              </button>
            </div>
            <button onClick={() => deleteItem(item.id)} className="absolute top-2 right-2 p-2 bg-red-900/40 text-red-400 rounded-full hover:bg-red-800">
              <Trash2 size={16} />
            </button>
          </SystemCard>
        ))}
      </div>
    </div>
  );
};
