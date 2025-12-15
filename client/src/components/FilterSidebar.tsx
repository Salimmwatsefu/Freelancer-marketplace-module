import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  allSkills: string[];
  selectedSkills: string[];
  budgetMin: number;
  budgetMax: number;
  statusFilter: string[];
  onSkillToggle: (skill: string) => void;
  onBudgetChange: (min: number, max: number) => void;
  onStatusToggle: (status: string) => void;
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({
  allSkills,
  selectedSkills,
  budgetMin,
  budgetMax,
  statusFilter,
  onSkillToggle,
  onBudgetChange,
  onStatusToggle,
  onReset,
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    budget: true,
    status: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const statuses = ['Open', 'Assigned', 'Completed'];

  const handleBudgetChange = (value: number[]) => {
    onBudgetChange(value[0], value[1]);
  };

  return (
    <div
      className={`fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-border p-4 overflow-y-auto transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="Reset all filters"
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Skills Filter */}
      <div className="mb-6 pb-6 border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection('skills')}
          className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between w-full hover:text-primary transition-colors"
        >
          <span>Skills</span>
          {expandedSections.skills ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.skills && (
          <div className="space-y-2">
            {allSkills.map(skill => (
              <label key={skill} className="flex items-center gap-2 cursor-pointer mb-2 text-sm">
                <Checkbox
                  checked={selectedSkills.includes(skill)}
                  onCheckedChange={() => onSkillToggle(skill)}
                />
                <span className="text-sm text-foreground">{skill}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Budget Filter */}
      <div className="mb-6 pb-6 border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection('budget')}
          className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between w-full hover:text-primary transition-colors"
        >
          <span>Budget Range</span>
          {expandedSections.budget ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.budget && (
          <div className="space-y-4">
            <Slider
              value={[budgetMin, budgetMax]}
              onValueChange={handleBudgetChange}
              min={0}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex gap-2 text-sm">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Min</label>
                <Input
                  type="number"
                  value={budgetMin}
                  onChange={e => onBudgetChange(parseInt(e.target.value) || 0, budgetMax)}
                  className="text-sm w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Max</label>
                <Input
                  type="number"
                  value={budgetMax}
                  onChange={e => onBudgetChange(budgetMin, parseInt(e.target.value) || 2000)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6 pb-6 border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection('status')}
          className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between w-full hover:text-primary transition-colors"
        >
          <span>Job Status</span>
          {expandedSections.status ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.status && (
          <div className="space-y-2">
            {statuses.map(status => (
              <label key={status} className="flex items-center gap-2 cursor-pointer mb-2 text-sm">
                <Checkbox
                  checked={statusFilter.includes(status)}
                  onCheckedChange={() => onStatusToggle(status)}
                />
                <span className="text-sm text-foreground">{status}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
