"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ImageModal from "./ImageModal";
import { OutfitItem } from "../../types/tenues";

export type OutfitCardProps = {
  title: string;
  items: OutfitItem[];
  imageSrc: string;
  imageAlt: string;
  secondImageSrc?: string;
  secondImageAlt?: string;
  thirdImageSrc?: string;
  thirdImageAlt?: string;
  fourthImageSrc?: string;
  fourthImageAlt?: string;
  fifthImageSrc?: string;
  fifthImageAlt?: string;
};

const OutfitCard: React.FC<OutfitCardProps> = ({
  title,
  items,
  imageSrc,
  imageAlt,
  secondImageSrc,
  secondImageAlt,
  thirdImageSrc,
  thirdImageAlt,
  fourthImageSrc,
  fourthImageAlt,
  fifthImageSrc,
  fifthImageAlt,
}) => {
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
        <div className="flex flex-col h-full">
          <div className="flex h-48 w-full">
            {/* Première image */}
            <div
              className={`relative ${secondImageSrc ? "w-1/2" : "w-full"} h-full bg-gray-900 cursor-pointer group transition-all duration-300`}
              onClick={() => openModal(imageSrc, imageAlt)}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/50 text-white p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Deuxième image */}
            {secondImageSrc && (
              <div
                className="relative w-1/2 h-full bg-gray-900 cursor-pointer group border-l border-gray-700/50"
                onClick={() => openModal(secondImageSrc, secondImageAlt || "")}
              >
                <Image
                  src={secondImageSrc}
                  alt={secondImageAlt || ""}
                  fill
                  className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/50 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Troisième image */}
            {thirdImageSrc && (
              <div
                className="relative w-1/2 h-full bg-gray-900 cursor-pointer group border-l border-gray-700/50"
                onClick={() => openModal(thirdImageSrc, thirdImageAlt || "")}
              >
                <Image
                  src={thirdImageSrc}
                  alt={thirdImageAlt || ""}
                  fill
                  className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/50 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Quatrième image */}
            {fourthImageSrc && (
              <div
                className="relative w-1/2 h-full bg-gray-900 cursor-pointer group border-l border-gray-700/50"
                onClick={() => openModal(fourthImageSrc, fourthImageAlt || "")}
              >
                <Image
                  src={fourthImageSrc}
                  alt={fourthImageAlt || ""}
                  fill
                  className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/50 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Cinquième image */}
            {fifthImageSrc && (
              <div
                className="relative w-1/2 h-full bg-gray-900 cursor-pointer group border-l border-gray-700/50"
                onClick={() => openModal(fifthImageSrc, fifthImageAlt || "")}
              >
                <Image
                  src={fifthImageSrc}
                  alt={fifthImageAlt || ""}
                  fill
                  className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/50 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          <h3 className="px-4 pt-3 pb-2 text-xl font-bold text-white">{title}</h3>
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

export default OutfitCard;
