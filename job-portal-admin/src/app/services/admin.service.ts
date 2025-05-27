import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, Vacancy, Resume } from '../interfaces';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private authUrl = environment.apiUrl.replace('/admin', '/auth');

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('admin_token');
    console.log('AdminService: Current token:', token);
    if (!token) {
      console.error('AdminService: No token found in localStorage');
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'Произошла ошибка при выполнении запроса';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Не удалось подключиться к серверу. Проверьте, запущен ли сервер.';
          break;
        case 401:
          errorMessage = 'Требуется авторизация. Пожалуйста, войдите в систему.';
          break;
        case 403:
          errorMessage = 'У вас нет прав для доступа к этой странице.';
          break;
        case 404:
          errorMessage = 'Запрашиваемые данные не найдены.';
          break;
        case 500:
          errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
          break;
        default:
          errorMessage = `Ошибка сервера: ${error.status} ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  // Auth operations
  login(email: string, password: string): Observable<LoginResponse> {
    console.log('AdminService: Attempting login for:', email);
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('AdminService: Login response:', response);
        if (response && response.token) {
          localStorage.setItem('admin_token', response.token);
          console.log('AdminService: Token stored in localStorage');
        } else {
          console.error('AdminService: No token in login response');
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
  }

  // User operations
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createUser(user: Partial<User>): Observable<User> {
    console.log('AdminService: Creating user with data:', user);
    const options = this.getHttpOptions();
    console.log('AdminService: Request options:', options);
    return this.http.post<User>(`${this.apiUrl}/users`, user, options).pipe(
      tap(response => console.log('AdminService: Create user response:', response)),
      catchError(error => {
        console.error('AdminService: Error creating user:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: number, user: any): Observable<any> {
    console.log('AdminService: Updating user with ID:', id);
    console.log('AdminService: User data to update:', user);
    const options = this.getHttpOptions();
    console.log('AdminService: Request options:', options);
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, user, options).pipe(
      tap(response => console.log('AdminService: Update response:', response)),
      catchError(error => {
        console.error('AdminService: Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // Vacancy operations
  getAllVacancies(): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(`${this.apiUrl}/vacancies`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getVacancyById(id: number): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${this.apiUrl}/vacancies/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createVacancy(vacancy: Partial<Vacancy>): Observable<Vacancy> {
    return this.http.post<Vacancy>(`${this.apiUrl}/vacancies`, vacancy, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateVacancy(id: number, vacancy: Partial<Vacancy>): Observable<Vacancy> {
    return this.http.put<Vacancy>(`${this.apiUrl}/admin/vacancies/${id}`, vacancy, this.getHttpOptions())
      .pipe(
        tap(response => console.log('Admin vacancy update response:', response)),
        catchError(error => {
          console.error('Admin vacancy update error:', error);
          return throwError(() => error);
        })
      );
  }

  deleteVacancy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vacancies/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // Resume operations
  getAllResumes(): Observable<Resume[]> {
    return this.http.get<Resume[]>(`${this.apiUrl}/resumes`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getResumeById(id: number): Observable<Resume> {
    return this.http.get<Resume>(`${this.apiUrl}/resumes/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createResume(resume: Partial<Resume>): Observable<Resume> {
    return this.http.post<Resume>(`${this.apiUrl}/resumes`, resume, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateResume(id: number, resume: Partial<Resume>): Observable<Resume> {
    return this.http.put<Resume>(`${this.apiUrl}/resumes/${id}`, resume, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  deleteResume(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/resumes/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }
} 