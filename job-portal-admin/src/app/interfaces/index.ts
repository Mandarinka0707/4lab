export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Интерфейс должен точно соответствовать данным с бэкенда
export interface Vacancy {
  ID: number;
  Title: string;
  Description: string;
  Company: string;
  Location: string;
  Salary: number;
  Requirements: string;
  Responsibilities: string;
  Skills: string[];
  Education: string;
  EmploymentType: string;
  Status: string;
  EmployerID: number;  // Исправлено с EmployerId на EmployerID
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Resume {
  id: number;
  title: string;
  description: string;
  userId: number;
  skills: string[];
  education: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  totalEmployers: number;
  totalJobseekers: number;
  totalVacancies: number;
  totalResumes: number;
  totalApplications: number;
} 