import React from "react";
import { motion } from "framer-motion";

interface ScenarioCardProps {
  image: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ image, title, description, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }} 
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-200">
        <figure className="h-48 sm:h-40 w-full">
          <img src={image} alt={title} className="object-cover w-full h-full" />
        </figure>
        <div className="card-body text-center p-4">
          <h3 className="card-title text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <button className="btn btn-info btn-sm mt-2 text-black">選擇場景</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScenarioCard;
