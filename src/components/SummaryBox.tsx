import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, FileText } from 'lucide-react';

interface SummaryBoxProps {
  summary: string;
  onRefresh: () => void;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ summary, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-blue-50 border-b border-blue-100 p-3"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-blue-700">AI Summary</h3>
              <button
                onClick={onRefresh}
                className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-100"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-blue-800">{summary}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryBox;