import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const InternalFlagBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute -top-6 right-0 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-md shadow-sm flex items-center"
    >
      <AlertTriangle className="w-3 h-3 text-amber-500 mr-1" />
      <span>Internal Content – Review before sending</span>
    </motion.div>
  );
};

export default InternalFlagBadge;