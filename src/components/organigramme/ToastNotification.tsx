"use client";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ToastProps {
  show: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function ToastNotification({
  show,
  message,
  type,
  onClose,
}: ToastProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center ${
        type === "error"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      <span className="mr-2">{message}</span>
      <button onClick={onClose} className="ml-2">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </motion.div>
  );
}
