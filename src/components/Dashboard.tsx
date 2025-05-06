
import React, { useState, useEffect } from 'react';
import { UserData, Semester } from '../types';
import { calculateOverallGPA, calculateOverallCredits } from '../utils/gpaCalculator';
import { getUserData, saveUserData, addSemester, deleteSemester } from '../utils/localStorage';
import SemesterCard from './SemesterCard';
import SemesterDetail from './SemesterDetail';
import Settings from './Settings';
import Analytics from './Analytics';
import { PDFDownloadButton } from '../utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Settings as SettingsIcon, Trash2, FileText } from 'lucide-react';
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

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>(getUserData());
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [newSemesterData, setNewSemesterData] = useState({
    year: new Date().getFullYear(),
    semester: 1
  });

  // Load user data on component mount
  useEffect(() => {
    setUserData(getUserData());
  }, []);

  const handleProfileUpdate = () => {
    saveUserData(userData);
    setEditingProfile(false);
    toast("Profile updated successfully");
  };

  const handleAddSemester = () => {
    addSemester(newSemesterData.year, newSemesterData.semester);
    setUserData(getUserData());
    toast("New semester added");
  };

  const handleDeleteSemester = (semesterId: string) => {
    deleteSemester(semesterId);
    setUserData(getUserData());
    toast("Semester deleted successfully");
  };

  const handleSemesterClick = (semester: Semester) => {
    setSelectedSemester(semester);
  };

  const handleSemesterClose = () => {
    setSelectedSemester(null);
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const refreshData = () => {
    setUserData(getUserData());
  };

  const overallGPA = calculateOverallGPA(userData);
  const totalCredits = calculateOverallCredits(userData);

  // If settings is selected, show settings screen
  if (showSettings) {
    return <Settings onClose={handleSettingsClose} />;
  }

  // If a semester is selected, show its details
  if (selectedSemester) {
    return (
      <SemesterDetail 
        semester={selectedSemester} 
        onClose={handleSemesterClose} 
        onUpdate={refreshData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="space-y-4">
        {!editingProfile ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.university}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSettingsToggle}>
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Overall GPA</p>
                  <p className="text-3xl font-bold text-primary">{overallGPA.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-3xl font-bold">{totalCredits}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <PDFDownloadButton userData={userData} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  id="name" 
                  value={userData.name} 
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="university" className="block text-sm font-medium mb-1">University</label>
                <Input 
                  id="university" 
                  value={userData.university} 
                  onChange={(e) => setUserData({...userData, university: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                <Button onClick={handleProfileUpdate}>Save</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Analytics</h2>
        <Analytics userData={userData} />
      </div>

      {/* Add Semester Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Add New Semester</h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="year" className="block text-sm font-medium mb-1">Year</label>
              <Input
                id="year"
                type="number"
                value={newSemesterData.year}
                onChange={(e) => setNewSemesterData({...newSemesterData, year: Number(e.target.value)})}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="semester" className="block text-sm font-medium mb-1">Semester</label>
              <Input
                id="semester"
                type="number"
                min={1}
                max={3}
                value={newSemesterData.semester}
                onChange={(e) => setNewSemesterData({...newSemesterData, semester: Number(e.target.value)})}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddSemester} className="whitespace-nowrap">
                Add Semester
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester Cards Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Semester Records</h2>
        {userData.semesters.length === 0 ? (
          <p className="text-muted-foreground">No semesters added yet. Add your first semester to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData.semesters.map(semester => (
              <div key={semester.id} className="relative">
                <SemesterCard
                  semester={semester}
                  onClick={() => handleSemesterClick(semester)}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-100 z-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Semester</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {semester.year} - Semester {semester.semester}? 
                        This will permanently delete all subjects and grades for this semester.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteSemester(semester.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
