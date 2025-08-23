// Types partagés pour les tenues
export type OutfitItem = {
  label: string;
  value: string;
};

export type Outfit = {
  title: string;
  items: OutfitItem[];
  image: string;
  imageAlt?: string;
  secondImage?: string;
  secondImageAlt?: string;
  thirdImage?: string;
  thirdImageAlt?: string;
  fourthImage?: string;
  fourthImageAlt?: string;
  fifthImage?: string;
  fifthImageAlt?: string;
};
