import React from "react";
import ScenarioCard from "@/components/ScenarioCard";
import { scenarios } from "@/settings/scenarios";

export interface ScenarioSelection {
  name: string;
  mode: string;
  topic: string;
  ai_persona: string;
  voice_accent: string;
  voice_gender: string;
  ai_avatar: string; 
  scenario_image: string; 
}

const ScenarioSelector: React.FC<{ onSelect: (selection: ScenarioSelection) => void }> = ({ onSelect }) => {
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">請選擇對話場景</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            image={scenario.scenario_image} // ✅ 確保使用正確的圖片屬性
            title={scenario.name}
            description={scenario.description}
            onClick={() =>
              onSelect({
                name: scenario.name,
                mode: scenario.mode,
                topic: scenario.topic,
                ai_persona: scenario.ai_persona,
                voice_accent: "american",
                voice_gender: "male",
                ai_avatar : scenario.ai_avatar,
                scenario_image : scenario.scenario_image
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector;
