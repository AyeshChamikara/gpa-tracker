
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserData, Subject } from '../types';
import { gradePoints } from '../utils/gpaCalculator';
import { AlertCircle } from 'lucide-react';

interface AnalyticsProps {
  userData: UserData;
}

interface SubjectWithSemester extends Subject {
  year: number;
  semesterNumber: number;
}

const Analytics: React.FC<AnalyticsProps> = ({ userData }) => {
  // Find subjects that need attention (lower grades)
  const getLowPerformingSubjects = (): SubjectWithSemester[] => {
    const threshold = 2.0; // Subjects with GPA lower than this need attention
    const allSubjectsWithSemester: SubjectWithSemester[] = [];
    
    userData.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        const gradePoint = gradePoints[subject.grade] || 0;
        if (gradePoint < threshold) {
          allSubjectsWithSemester.push({
            ...subject,
            year: semester.year,
            semesterNumber: semester.semester
          });
        }
      });
    });
    
    return allSubjectsWithSemester.sort((a, b) => {
      // Sort by grade points (ascending) then by year and semester (descending)
      const gradePointA = gradePoints[a.grade] || 0;
      const gradePointB = gradePoints[b.grade] || 0;
      
      if (gradePointA !== gradePointB) {
        return gradePointA - gradePointB;
      }
      
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      
      return b.semesterNumber - a.semesterNumber;
    });
  };

  const lowPerformingSubjects = getLowPerformingSubjects();
  
  if (lowPerformingSubjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Need Your Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <AlertTitle>Good job!</AlertTitle>
            <AlertDescription>
              You don't have any subjects that need special attention at the moment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Need Your Attention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Year & Semester</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowPerformingSubjects.map(subject => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {subject.year} - Semester {subject.semesterNumber}
                  </Badge>
                </TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>
                  <Badge variant="destructive">{subject.grade}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Analytics;
