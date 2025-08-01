import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ImageModal } from './ImageModal';

interface VehiculeItem {
  label: string;
  value: string;
}

interface VehiculeCardProps {
  title: string;
  items: VehiculeItem[];
  imageSrc: string;
  imageAlt: string;
  secondImageSrc?: string;
  secondImageAlt?: string;
}

export const VehiculeCard = ({ 
  title, 
  items, 
  imageSrc,
  imageAlt,
  secondImageSrc,
  secondImageAlt = ''
}: VehiculeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: imageSrc, alt: imageAlt });

  const openModal = (src: string, alt: string) => {
    setCurrentImage({ src, alt });
    setIsModalOpen(true);
  };

  return (
    <div>
      <motion.div 
        className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <div className="flex">
            {/* Première image */}
            <div 
              className={`relative h-48 ${secondImageSrc ? 'w-1/2' : 'w-full'} bg-gray-900 cursor-pointer group overflow-hidden transition-all duration-300`}
              onClick={() => openModal(imageSrc, imageAlt)}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/50 text-white p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Deuxième image - affichée uniquement si elle existe */}
            {secondImageSrc && (
              <div 
                className="relative h-48 w-1/2 bg-gray-900 cursor-pointer group overflow-hidden"
                onClick={() => openModal(secondImageSrc, secondImageAlt)}
              >
                <Image
                  src={secondImageSrc}
                  alt={secondImageAlt}
                  fill
                  className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/50 text-white p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{title}</h3>
        </div>
    
        <div className="p-6">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="text-gray-400 text-sm">{item.label}</span>
                <span className="font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        src={currentImage.src} 
        alt={currentImage.alt} 
      />
    </div>
  );
};
