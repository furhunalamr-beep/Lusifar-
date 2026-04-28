import { 
  User, Swords, Layout, Library, Target, Clock, Zap, Package, Trophy, ShoppingBag, FolderOpen, Mic, Settings
} from 'lucide-react';

export const navItems = [
  { id: 'tasks', label: 'Mission Board', icon: Swords, desc: 'Study Tasks' },
  { id: 'status', label: 'Hunter Status', icon: User, desc: 'Student Attributes' },
  { id: 'profile', label: 'Edit Profile', icon: User, desc: 'Update Identity' },
  { id: 'roadmap', label: 'Syllabus Map', icon: Layout, desc: 'Learning Roadmap' },
  { id: 'library', label: 'Monarch Archive', icon: Library, desc: 'Study Notes & PDFs' },
  { id: 'training', label: 'Training Grounds', icon: Target, desc: 'Quizzes & Analysis' },
  { id: 'focus', label: 'Focus Chamber', icon: Clock, desc: 'Lockdown Studying' },
  { id: 'skills', label: 'Skill Matrix', icon: Zap, desc: 'Evolve Potential' },
  { id: 'voice', label: 'AI Voice', icon: Mic, desc: 'Voice AI Command' },
  { id: 'inventory', label: 'System Storage', icon: Package, desc: 'Study Materials' },
  { id: 'challenge', label: 'Hall of Fame', icon: Trophy, desc: 'Global Standings' },
  { id: 'shop', label: 'System Shop', icon: ShoppingBag, desc: 'Focus Boosts' },
  { id: 'vault', label: 'Student Vault', icon: FolderOpen, desc: 'Store Files & Images' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'App Configuration' },
];
