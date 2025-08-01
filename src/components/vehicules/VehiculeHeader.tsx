import { motion } from 'framer-motion';

interface VehiculeHeaderProps {
  title: string;
  description: string;
}

export const VehiculeHeader = ({ title, description }: VehiculeHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {title}
        </h2>
      </div>
      <p className="text-gray-400 mt-2">{description}</p>
    </motion.div>
  );
};
