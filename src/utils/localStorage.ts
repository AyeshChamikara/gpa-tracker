
import { UserData, Semester, Subject } from "../types";

// Default user data for first-time users
const defaultUserData: UserData = {
  name: "Student Name",
  university: "University Name",
  semesters: []
};

// Get user data from local storage
export function getUserData(): UserData {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : defaultUserData;
}

// Save user data to local storage
export function saveUserData(userData: UserData): void {
  localStorage.setItem("userData", JSON.stringify(userData));
}

// Add a new semester
export function addSemester(year: number, semesterNumber: number): void {
  const userData = getUserData();
  
  const newSemester: Semester = {
    id: Date.now().toString(),
    year,
    semester: semesterNumber,
    subjects: []
  };
  
  userData.semesters.push(newSemester);
  saveUserData(userData);
}

// Delete a semester by ID
export function deleteSemester(semesterId: string): void {
  const userData = getUserData();
  userData.semesters = userData.semesters.filter(semester => semester.id !== semesterId);
  saveUserData(userData);
}

// Add a subject to a semester
export function addSubject(semesterId: string, subject: Omit<Subject, "id">): void {
  const userData = getUserData();
  
  const semesterIndex = userData.semesters.findIndex(sem => sem.id === semesterId);
  if (semesterIndex !== -1) {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString()
    };
    
    userData.semesters[semesterIndex].subjects.push(newSubject);
    saveUserData(userData);
  }
}

// Delete a subject from a semester
export function deleteSubject(semesterId: string, subjectId: string): void {
  const userData = getUserData();
  
  const semesterIndex = userData.semesters.findIndex(sem => sem.id === semesterId);
  if (semesterIndex !== -1) {
    userData.semesters[semesterIndex].subjects = userData.semesters[semesterIndex].subjects.filter(
      subject => subject.id !== subjectId
    );
    saveUserData(userData);
  }
}

// Update user profile information
export function updateUserProfile(name: string, university: string): void {
  const userData = getUserData();
  userData.name = name;
  userData.university = university;
  saveUserData(userData);
}
