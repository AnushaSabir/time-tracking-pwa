"use client";

import { useState, useEffect } from "react";
import EmployeeLogin from "@/components/employee-login";
import AdminLogin from "@/components/admin-login";
import EmployeeDashboard from "@/components/employee-dashboard";
import AdminPanel from "@/components/admin-panel";
import SuccessPage from "@/components/success-page";
import { db } from "@/app/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";



// Employee type with string id for Firestore
export type Employee = {
  id: string; // Firestore document id
  name: string;
  pin: string;
};

type AppState = "employee-login" | "admin-login" | "employee-dashboard" | "admin-panel" | "success";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("employee-login");
  const [employeeName, setEmployeeName] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch employees from Firestore on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, "employees"));
        const list: Employee[] = snapshot.docs.map((d) => {
          const data = d.data() as { name: string; pin: string };
          return { id: d.id, name: data.name, pin: data.pin };
        });
        setEmployees(list);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeLogin = (name: string) => {
    setEmployeeName(name);
    setAppState("employee-dashboard");
  };

  const handleAdminLogin = () => {
    setAppState("admin-panel");
  };

  const handleLogout = () => {
    setAppState("employee-login");
    setEmployeeName("");
  };

  const handleSuccess = () => {
    setAppState("success");
    setTimeout(() => setAppState("employee-dashboard"), 2000);
  };

  // Firestore CRUD functions
  const handleAddEmployee = async (name: string, pin: string) => {
    const docRef = await addDoc(collection(db, "employees"), { name, pin });
    const newEmployee: Employee = { id: docRef.id, name, pin };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleRemoveEmployee = async (id: string) => {
    await deleteDoc(doc(db, "employees", id));
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleRenameEmployee = async (id: string, newName: string) => {
    await updateDoc(doc(db, "employees", id), { name: newName });
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, name: newName } : e)));
  };

  const handleResetPin = async (id: string, newPin: string) => {
    await updateDoc(doc(db, "employees", id), { pin: newPin });
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, pin: newPin } : e)));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      {appState === "employee-login" && (
        <EmployeeLogin
          employees={employees}
          onLogin={handleEmployeeLogin}
          onAdminClick={() => setAppState("admin-login")}
        />
      )}

      {appState === "admin-login" && (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setAppState("employee-login")} />
      )}

      {appState === "employee-dashboard" && (
        <EmployeeDashboard
          employeeName={employeeName}
          onLogout={handleLogout}
          onSuccess={handleSuccess}
        />
      )}

      {appState === "admin-panel" && (
        <AdminPanel
          employees={employees}
          onAddEmployee={handleAddEmployee}
          onRemoveEmployee={handleRemoveEmployee}
          onRenameEmployee={handleRenameEmployee}
          onResetPin={handleResetPin}
          onLogout={handleLogout}
        />
      )}

      {appState === "success" && <SuccessPage />}
    </main>
  );
}
