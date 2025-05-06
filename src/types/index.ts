
export interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export interface Semester {
  id: string;
  year: number;
  semester: number;
  subjects: Subject[];
}

export interface UserData {
  name: string;
  university: string;
  semesters: Semester[];
}
