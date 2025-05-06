
import { Semester, Subject, UserData } from "../types";

// Common grade point scale (can be customized)
export const defaultGradePoints: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

// Initialize gradePoints from localStorage or use defaults
export let gradePoints: Record<string, number> = loadGradePoints();

// Save custom grade points to localStorage
export function setGradePoints(customGradePoints: Record<string, number>): void {
  localStorage.setItem('gradePoints', JSON.stringify(customGradePoints));
  gradePoints = customGradePoints;
}

// Load grade points from localStorage
export function loadGradePoints(): Record<string, number> {
  const savedGradePoints = localStorage.getItem('gradePoints');
  return savedGradePoints ? JSON.parse(savedGradePoints) : {...defaultGradePoints};
}

// Calculate GPA for a list of subjects
export function calculateGPA(subjects: Subject[]): number {
  if (!subjects.length) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  subjects.forEach(subject => {
    const points = gradePoints[subject.grade] || 0;
    totalPoints += points * subject.credits;
    totalCredits += subject.credits;
  });
  
  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
}

// Calculate total credits
export function calculateTotalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, subject) => sum + subject.credits, 0);
}

// Calculate semester GPA
export function calculateSemesterGPA(semester: Semester): number {
  return calculateGPA(semester.subjects);
}

// Calculate overall GPA
export function calculateOverallGPA(userData: UserData): number {
  const allSubjects = userData.semesters.flatMap(semester => semester.subjects);
  return calculateGPA(allSubjects);
}

// Calculate total credits for all semesters
export function calculateOverallCredits(userData: UserData): number {
  const allSubjects = userData.semesters.flatMap(semester => semester.subjects);
  return calculateTotalCredits(allSubjects);
}
