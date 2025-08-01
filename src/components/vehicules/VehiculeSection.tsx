import { VehiculeCard } from './VehiculeCard';

interface VehiculeItem {
  label: string;
  value: string;
}

interface Vehicule {
  title: string;
  items: VehiculeItem[];
  image: string;
  secondImageSrc?: string;
  secondImageAlt?: string;
}

interface VehiculeSectionProps {
  title: string;
  vehicules: Vehicule[];
  className?: string;
}

export const VehiculeSection = ({ title, vehicules, className = '' }: VehiculeSectionProps) => {
  if (!vehicules || vehicules.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12 w-full">
        {vehicules.map((vehicule, index) => (
          <VehiculeCard
            key={index}
            title={vehicule.title}
            items={vehicule.items}
            imageSrc={vehicule.image}
            imageAlt={`Véhicule ${vehicule.title}`}
            secondImageSrc={vehicule.secondImageSrc}
            secondImageAlt={vehicule.secondImageAlt || `${vehicule.title} aucune image supplémentaire`}
          />
        ))}
      </div>
    </div>
  );
};
