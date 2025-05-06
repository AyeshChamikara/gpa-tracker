
import React, { useState } from 'react';
import { Semester, Subject } from '../types';
import { calculateSemesterGPA, calculateTotalCredits, gradePoints } from '../utils/gpaCalculator';
import { addSubject, deleteSubject } from '../utils/localStorage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/components/ui/sonner';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SemesterDetailProps {
  semester: Semester;
  onClose: () => void;
  onUpdate: () => void;
}

const SemesterDetail: React.FC<SemesterDetailProps> = ({ semester, onClose, onUpdate }) => {
  const [newSubject, setNewSubject] = useState<Omit<Subject, "id">>({
    name: "",
    credits: 3,
    grade: "A"
  });

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast("Please enter a subject name");
      return;
    }
    
    addSubject(semester.id, newSubject);
    setNewSubject({
      name: "",
      credits: 3,
      grade: "A"
    });
    onUpdate();
    toast("Subject added successfully");
  };

  const handleDeleteSubject = (subjectId: string) => {
    deleteSubject(semester.id, subjectId);
    onUpdate();
    toast("Subject deleted successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {semester.year} - Semester {semester.semester}
        </h2>
        <Button variant="outline" onClick={onClose}>Back</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium">GPA</p>
            <p className="text-2xl font-bold">{calculateSemesterGPA(semester).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium">Credits</p>
            <p className="text-2xl font-bold">{calculateTotalCredits(semester.subjects)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                placeholder="Introduction to Computer Science"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({...newSubject, credits: Number(e.target.value)})}
                  min={0}
                />
              </div>
              
              <div>
                <Label htmlFor="grade">Grade</Label>
                <select
                  id="grade"
                  value={newSubject.grade}
                  onChange={(e) => setNewSubject({...newSubject, grade: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.keys(gradePoints).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button onClick={handleAddSubject} className="w-full">Add Subject</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Subjects</h3>
        {semester.subjects.length === 0 ? (
          <p className="text-muted-foreground">No subjects added yet</p>
        ) : (
          <div className="space-y-2">
            {semester.subjects.map(subject => (
              <Card key={subject.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.credits} credits</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{subject.grade}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-100">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{subject.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSubject(subject.id)}
                            className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SemesterDetail;
