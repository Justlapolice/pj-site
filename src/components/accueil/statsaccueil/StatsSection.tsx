"use client";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import BlocNote from "../../note/BlocNote";

interface StatsSectionProps {
  totalEffectifs: number;
  roles: string[];
}

export default function StatsSection({
  totalEffectifs,
  roles,
}: StatsSectionProps) {
  const InfoCard = ({
    title,
    children,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-600/20 rounded-lg mr-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      </div>
      <div className="text-gray-300 flex-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <InfoCard
        title="Effectif Total"
        icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
      >
        <p className="text-3xl font-bold text-white mb-1">{totalEffectifs}</p>
        <p className="text-sm text-gray-400">Membres au total</p>
      </InfoCard>

      <InfoCard
        title="Bloc-note"
        icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
      >
        <BlocNote roles={roles} />
      </InfoCard>
    </div>
  );
}
