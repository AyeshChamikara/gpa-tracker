
import React from 'react';
import { Semester } from '../types';
import { calculateSemesterGPA, calculateTotalCredits } from '../utils/gpaCalculator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SemesterCardProps {
  semester: Semester;
  onClick: () => void;
}

const SemesterCard: React.FC<SemesterCardProps> = ({ semester, onClick }) => {
  const gpa = calculateSemesterGPA(semester);
  const credits = calculateTotalCredits(semester.subjects);
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg flex justify-between items-center">
          <span>{semester.year} - Semester {semester.semester}</span>
          <span className="text-primary font-bold">{gpa.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{credits} credits</p>
        <p className="text-sm text-muted-foreground">{semester.subjects.length} subjects</p>
      </CardContent>
    </Card>
  );
};

export default SemesterCard;
