"use client";

import { motion } from "framer-motion";

export interface ToolData {
  id: string;
  name: string;
  fullName: string;
  description: string;
  capabilities: string[];
  color: string;
  icon: string;
}

interface ToolModalProps {
  tool: ToolData;
  onClose: () => void;
}

export default function ToolModal({ tool, onClose }: ToolModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 max-w-md w-full overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${tool.color}, ${tool.color}88)`,
          }}
        />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${tool.color}12`,
                border: `1.5px solid ${tool.color}30`,
              }}
            >
              <span
                className="text-lg"
                style={{ color: tool.color }}
              >
                {tool.icon}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">{tool.fullName}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
            {tool.description}
          </p>

          {/* Capabilities */}
          <div className="mb-7">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Capabilities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {tool.capabilities.map((cap) => (
                <div
                  key={cap}
                  className="flex items-center gap-2.5 text-[13px] text-slate-600 py-1.5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: tool.color }}
                  />
                  {cap}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              className="flex-1 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{
                backgroundColor: tool.color,
                boxShadow: `0 4px 12px ${tool.color}30`,
              }}
            >
              Join Waitlist
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
