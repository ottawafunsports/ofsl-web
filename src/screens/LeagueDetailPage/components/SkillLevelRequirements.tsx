export function SkillLevelRequirements() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#6F6F6F] mb-4">Skill Level Requirements</h2>
      <div className="text-[#6F6F6F] space-y-4">
        <h3 className="text-lg font-bold text-[#6F6F6F] mb-3">Elite Level</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Current or former college/university players</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Advanced offensive and defensive systems</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Consistent high-level execution</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Specialized positions and strategic play</span>
          </li>
        </ul>
      </div>
    </div>
  );
}