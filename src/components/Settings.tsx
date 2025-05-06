
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { gradePoints, setGradePoints } from '../utils/gpaCalculator';
import { toast } from '@/components/ui/sonner';
import { useTheme } from '../hooks/useTheme';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [customGradePoints, setCustomGradePoints] = useState<Record<string, number>>({...gradePoints});
  const { theme, setTheme } = useTheme();
  
  const handleGradePointChange = (grade: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCustomGradePoints({
        ...customGradePoints,
        [grade]: numValue
      });
    }
  };
  
  const saveGradePoints = () => {
    setGradePoints(customGradePoints);
    toast("Grade point scale updated successfully");
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Settings</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Toggle Dark/Light Mode</span>
            <Toggle 
              pressed={theme === 'dark'}
              onPressedChange={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Toggle>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Grade Point Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Customize the GPA value for each grade letter according to your university's grading system.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.keys(customGradePoints).map(grade => (
                <div key={grade} className="space-y-1">
                  <Label htmlFor={`grade-${grade}`}>{grade}</Label>
                  <Input
                    id={`grade-${grade}`}
                    type="number"
                    value={customGradePoints[grade]}
                    onChange={(e) => handleGradePointChange(grade, e.target.value)}
                    step="0.1"
                    min="0"
                    max="4.0"
                  />
                </div>
              ))}
            </div>
            <Button onClick={saveGradePoints} className="w-full">Save Grade Scale</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
