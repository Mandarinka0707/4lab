import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Вход в панель администратора</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Введите email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email обязателен
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Введите корректный email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Пароль</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Введите пароль">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Пароль обязателен
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading">
              {{ isLoading ? 'Вход...' : 'Войти' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }

    mat-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    mat-card-header {
      margin-bottom: 2rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    button {
      width: 100%;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.adminService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          if (response && response.access_token) {
            localStorage.setItem('admin_token', response.access_token);
            this.router.navigate(['/admin']);
          } else if (response && response.token) {
            localStorage.setItem('admin_token', response.token);
            this.router.navigate(['/admin']);
          } else {
            this.showError('Неверный формат ответа от сервера');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          let errorMessage = 'Ошибка при входе в систему';
          
          if (error.status === 401) {
            errorMessage = 'Неверный email или пароль';
          } else if (error.status === 404) {
            errorMessage = 'Сервер авторизации недоступен';
          } else if (error.status >= 500) {
            errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.showError(errorMessage);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Закрыть', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 