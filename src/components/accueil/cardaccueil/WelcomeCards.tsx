"use client";
import { motion } from "framer-motion";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

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

interface WelcomeCardsProps {
  cleanDisplayName: string;
  grade?: string | null;
  gradeRoleId?: string | null;
  qualification?: string | null;
  postePJ?: string | null;
  roleImages: Record<string, string>;
  roles: string[];
}

export default function WelcomeCards({
  cleanDisplayName,
  grade,
  gradeRoleId,
  qualification,
  roleImages,
  postePJ,
}: WelcomeCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Accueil"
          icon={<UserGroupIcon className="h-6 w-6 text-yellow-400" />}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Bonjour,{" "}
            <span className="text-yellow-400">
              {cleanDisplayName.split(" ")[0]}
            </span>{" "}
            👋
          </h2>
          <p className="text-gray-400 mt-2">
            Ravi de vous revoir sur votre espace personnel
          </p>
        </InfoCard>

        <InfoCard
          title="Nom & Prénom et Poste PJ"
          icon={<UserGroupIcon className="h-6 w-6 text-green-400" />}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            {cleanDisplayName}
          </h2>
          <p className="text-gray-400 mt-1">{postePJ || "Aucun poste"}</p>
        </InfoCard>

        <InfoCard
          title="Votre grade actuel et votre qualification judiciaire"
          icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
        >
          <div className="flex items-center gap-4">
            <Image
              src={roleImages[gradeRoleId || ""] || "/default-grade.png"}
              alt={grade || "Grade"}
              width={60}
              height={60}
            />
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                {grade || "Aucun grade"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Qualification Judiciaire :{" "}
                {qualification || "Aucune qualification"}
              </p>
            </div>
          </div>
        </InfoCard>
      </div>
    </motion.div>
  );
}
