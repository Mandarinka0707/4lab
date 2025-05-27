import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User, Vacancy, Resume } from '../../../interfaces';
import { firstValueFrom } from 'rxjs';
import { CreateUserDialogComponent } from './create-user-dialog.component';
import { CreateVacancyDialogComponent } from './create-vacancy-dialog.component';
import { CreateResumeDialogComponent } from './create-resume-dialog.component';
import { Router } from '@angular/router';
import { VacancyDetailsDialogComponent } from './vacancy-details-dialog.component';
import { TextDialogComponent } from './text-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    ReactiveFormsModule,
    CreateUserDialogComponent,
    VacancyDetailsDialogComponent,
    TextDialogComponent 
  ],
  providers: [AdminService],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  vacancies: Vacancy[] = [];
  resumes: Resume[] = [];
  loading = true;
  error: string | null = null;
  skills: string[] = [];

  userForm: FormGroup;
  vacancyForm: FormGroup;
  resumeForm: FormGroup;

  usersDataSource = new MatTableDataSource<User>([]);
  vacanciesDataSource = new MatTableDataSource<Vacancy>([]);
  resumesDataSource = new MatTableDataSource<Resume>([]);

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    this.vacancyForm = this.fb.group({
      Title: ['', Validators.required],
      Company: ['', Validators.required],
      Description: ['', Validators.required],
      Requirements: ['', Validators.required],
      Responsibilities: ['', Validators.required],
      Salary: ['', [Validators.required, Validators.min(0)]],
      Location: ['', Validators.required],
      EmploymentType: ['full-time', Validators.required],
      Status: ['active', Validators.required],
      Skills: [[]]
    });

    this.resumeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('AdminDashboardComponent: Initializing component');
    this.loadData();
  }

  async loadData(): Promise<void> {
    console.log('AdminDashboardComponent: Starting to load data');
    this.loading = true;
    try {
      console.log('AdminDashboardComponent: Fetching users, vacancies, and resumes');
      const [users, vacancies, resumes] = await Promise.all([
        firstValueFrom(this.adminService.getAllUsers()),
        firstValueFrom(this.adminService.getAllVacancies()),
        firstValueFrom(this.adminService.getAllResumes())
      ]);
      console.log('AdminDashboardComponent: Received data:', { users, vacancies, resumes });
      console.log('Raw vacancies data from backend:', vacancies);
      // Transform data to match interface
      this.users = (users || []).map(user => ({
        id: user.id || 0,
        name: user.name || '',
        email: user.email || '',
        role: user.role || ''
      }));

      // В методе loadData()
      this.vacancies = (vacancies || []).map(vacancy => ({
        ID: vacancy.ID || 0,
        Title: vacancy.Title || 'Без названия',
        Description: vacancy.Description || '',
        Company: vacancy.Company || 'Не указана',
        Location: vacancy.Location || 'Не указана',
        Salary: Number(vacancy.Salary) || 0,
        Requirements: vacancy.Requirements || 'Требования не указаны',
        Responsibilities: vacancy.Responsibilities || 'Обязанности не указаны',
        Skills: vacancy.Skills || [],
        Education: vacancy.Education || '',
        EmploymentType: vacancy.EmploymentType || '',
        Status: vacancy.Status || 'active',
        EmployerID: vacancy.EmployerID || 0,  // Исправлено поле
        CreatedAt: vacancy.CreatedAt || '',
        UpdatedAt: vacancy.UpdatedAt || ''                                                                                                            
      }));

      this.resumes = (resumes || []).map(resume => ({
        id: resume.id || 0,
        title: resume.title || '',
        description: resume.description || '',
        userId: resume.userId || 0,
        skills: resume.skills || [],
        education: resume.education || '',
        experience: resume.experience || '',
        createdAt: resume.createdAt || '',
        updatedAt: resume.updatedAt || ''
      }));

      // Update data sources
      this.usersDataSource.data = this.users;
      this.vacanciesDataSource.data = this.vacancies;
      this.resumesDataSource.data = this.resumes;

      console.log('AdminDashboardComponent: Updated component state:', {
        usersCount: this.users.length,
        vacanciesCount: this.vacancies.length,
        resumesCount: this.resumes.length
      });
    } catch (error) {
      console.error('AdminDashboardComponent: Error loading data:', error);
      this.error = 'Failed to load data';
      this.showSnackBar('Failed to load data', 'error');
    } finally {
      this.loading = false;
      console.log('AdminDashboardComponent: Finished loading data');
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    console.log('Tab changed to:', event.index);
  }
  private parseSalary(salary: any): number {
    if (typeof salary === 'number') return salary;
    const num = Number(String(salary).replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  }

  // User CRUD operations
  openCreateUserDialog() {
    this.userForm.reset();
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      data: { form: this.userForm }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser();
      }
    });
  }

  openEditDialog(user: any): void {
    console.log('AdminDashboardComponent: Opening edit dialog for user:', user);
    this.userForm.patchValue(user);
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px',
      data: { 
        form: this.userForm,
        user: user,
        isEdit: true 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('AdminDashboardComponent: Dialog closed with result:', result);
      if (result) {
        console.log('AdminDashboardComponent: Updating user with data:', { ...user, ...result });
        this.updateUser({ ...user, ...result });
      }
    });
  }

  async createUser() {
    if (this.userForm.valid) {
      try {
        const newUser = await firstValueFrom(this.adminService.createUser(this.userForm.value));
        this.users.push(newUser);
        this.usersDataSource.data = this.users;
        this.showSnackBar('User created successfully', 'success');
        this.dialog.closeAll();
      } catch (error) {
        this.showSnackBar('Failed to create user', 'error');
      }
    }
  }

  updateUser(user: any): void {
    console.log('AdminDashboardComponent: Starting user update with data:', user);
    this.adminService.updateUser(user.id, user).subscribe({
      next: (updatedUser) => {
        console.log('AdminDashboardComponent: User updated successfully:', updatedUser);
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.users = [...this.users];
        }
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('AdminDashboardComponent: Error updating user:', error);
        this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
      }
    });
  }

  // Vacancy CRUD operations
  openCreateVacancyDialog() {
    this.vacancyForm.reset();
    const dialogRef = this.dialog.open(CreateVacancyDialogComponent, {
      data: { form: this.vacancyForm }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createVacancy();
      }
    });
  }

  openEditVacancyDialog(vacancy: Vacancy) {
    // Reset form and patch values
    this.vacancyForm.reset();
    this.vacancyForm.patchValue({
      Title: vacancy.Title,
      Company: vacancy.Company,
      Description: vacancy.Description,
      Requirements: vacancy.Requirements,
      Responsibilities: vacancy.Responsibilities,
      Salary: vacancy.Salary,
      Location: vacancy.Location,
      EmploymentType: vacancy.EmploymentType,
      Status: vacancy.Status,
      Skills: vacancy.Skills
    });
    
    const dialogRef = this.dialog.open(CreateVacancyDialogComponent, {
      data: { form: this.vacancyForm, isEdit: true },
      width: '600px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateVacancy(vacancy.ID);
      }
    });
  }

  async createVacancy() {
    if (this.vacancyForm.valid) {
      try {
        const newVacancy = await firstValueFrom(this.adminService.createVacancy(this.vacancyForm.value));
        this.vacancies.push(newVacancy);
        this.vacanciesDataSource.data = this.vacancies;
        this.showSnackBar('Vacancy created successfully', 'success');
        this.dialog.closeAll();
      } catch (error) {
        this.showSnackBar('Failed to create vacancy', 'error');
      }
    }
  }

  async updateVacancy(vacancyId: number) {
    if (this.vacancyForm.valid) {
      try {
        const data = {
          ...this.vacancyForm.value,
          isAdmin: true,
          ID: vacancyId
        };
        const updatedVacancy = await firstValueFrom(this.adminService.updateVacancy(vacancyId, data));
        
        const index = this.vacancies.findIndex(v => v.ID === vacancyId);
        if (index !== -1) {
          this.vacancies[index] = updatedVacancy;
        }
        this.vacanciesDataSource.data = this.vacancies;
        this.showSnackBar('Вакансия успешно обновлена', 'success');
        this.dialog.closeAll();
      } catch (error) {
        console.error('Error updating vacancy:', error);
        this.showSnackBar('Ошибка при обновлении вакансии', 'error');
      }
    }
  }

  // Resume CRUD operations
  openCreateResumeDialog() {
    this.resumeForm.reset();
    this.skills = [];
    const dialogRef = this.dialog.open(CreateResumeDialogComponent, {
      data: { form: this.resumeForm, skills: this.skills }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createResume(result);
      }
    });
  }

  openEditResumeDialog(resume: Resume) {
    this.resumeForm.patchValue(resume);
    this.skills = [...resume.skills];
    const dialogRef = this.dialog.open(CreateResumeDialogComponent, {
      data: { form: this.resumeForm, skills: this.skills }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateResume(resume.id, result);
      }
    });
  }

  async createResume(data: any) {
    if (this.resumeForm.valid) {
      try {
        const newResume = await firstValueFrom(this.adminService.createResume(data));
        this.resumes.push(newResume);
        this.resumesDataSource.data = this.resumes;
        this.showSnackBar('Resume created successfully', 'success');
        this.dialog.closeAll();
      } catch (error) {
        this.showSnackBar('Failed to create resume', 'error');
      }
    }
  }

  async updateResume(resumeId: number, data: any) {
    if (this.resumeForm.valid) {
      try {
        const updatedResume = await firstValueFrom(this.adminService.updateResume(resumeId, data));
        const index = this.resumes.findIndex(r => r.id === resumeId);
        if (index !== -1) {
          this.resumes[index] = updatedResume;
        }
        this.resumesDataSource.data = this.resumes;
        this.showSnackBar('Resume updated successfully', 'success');
        this.dialog.closeAll();
      } catch (error) {
        this.showSnackBar('Failed to update resume', 'error');
      }
    }
  }

  // Delete operations
  async deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await firstValueFrom(this.adminService.deleteUser(userId));
        this.users = this.users.filter(user => user.id !== userId);
        this.usersDataSource.data = this.users;
        this.showSnackBar('User deleted successfully', 'success');
      } catch (error) {
        this.showSnackBar('Failed to delete user', 'error');
      }
    }
  }

  async deleteVacancy(vacancyId: number) {
    if (confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await firstValueFrom(this.adminService.deleteVacancy(vacancyId));
        this.vacancies = this.vacancies.filter(vacancy => vacancy.ID !== vacancyId);
        this.vacanciesDataSource.data = this.vacancies;
        this.showSnackBar('Vacancy deleted successfully', 'success');
      } catch (error) {
        this.showSnackBar('Failed to delete vacancy', 'error');
      }
    }
  }

  async deleteResume(resumeId: number) {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await firstValueFrom(this.adminService.deleteResume(resumeId));
        this.resumes = this.resumes.filter(resume => resume.id !== resumeId);
        this.resumesDataSource.data = this.resumes;
        this.showSnackBar('Resume deleted successfully', 'success');
      } catch (error) {
        this.showSnackBar('Failed to delete resume', 'error');
      }
    }
  }

  // Skills management
  addSkill(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.skills.push(value);
      event.chipInput!.clear();
    }
  }

  removeSkill(skill: string) {
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  // Utility methods
  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/login']);
    this.snackBar.open('Вы успешно вышли из системы', 'Закрыть', {
      duration: 3000
    });
  }


  openVacancyDetails(vacancy: Vacancy): void {
    this.dialog.open(VacancyDetailsDialogComponent, {
      data: vacancy,
      width: '600px'
    });
  }
  

  showFullText(text: string): void {
    this.dialog.open(TextDialogComponent, {
      data: { text },
      width: '500px'
    });
  }
} 

