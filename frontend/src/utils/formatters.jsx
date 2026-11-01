import React from 'react';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Utensils,
  Home,
  ShoppingCart,
  ShoppingBag,
  Car,
  Film,
  Zap,
  HeartPulse,
  BookOpen,
  Tag,
  CircleDollarSign
} from 'lucide-react';

export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getCategoryIcon = (iconName, size = 18, className = '') => {
  const props = { size, className };
  switch (iconName) {
    case 'Briefcase': return <Briefcase {...props} />;
    case 'Laptop': return <Laptop {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'Gift': return <Gift {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'Home': return <Home {...props} />;
    case 'ShoppingCart': return <ShoppingCart {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'Car': return <Car {...props} />;
    case 'Film': return <Film {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'HeartPulse': return <HeartPulse {...props} />;
    case 'BookOpen': return <BookOpen {...props} />;
    default: return <Tag {...props} />;
  }
};
