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
    <div className="p-6 mx-auto h-full overflow-hidden bg-sky-400">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">請選擇對話場景</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-full overflow-auto px-2 sm:px-8 pt-4 pb-12">
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
                voice_accent: scenario.voice_accent,
                voice_gender: scenario.voice_gender,
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
