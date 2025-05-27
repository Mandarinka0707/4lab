import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data ? 'Редактировать пользователя' : 'Создать пользователя' }}</h2>
      <mat-dialog-content>
        <form [formGroup]="form" class="form-container">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Имя</mat-label>
            <input matInput formControlName="name" required>
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email">
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <div class="role-selection">
            <label>Роль</label>
            <div class="role-options">
              <button type="button" 
                      [class.selected]="form.get('role')?.value === 'admin'"
                      (click)="selectRole('admin')"
                      class="role-button admin">
                Администратор
              </button>
              <button type="button" 
                      [class.selected]="form.get('role')?.value === 'employer'"
                      (click)="selectRole('employer')"
                      class="role-button employer">
                Работодатель
              </button>
              <button type="button" 
                      [class.selected]="form.get('role')?.value === 'jobseeker'"
                      (click)="selectRole('jobseeker')"
                      class="role-button jobseeker">
                Пользователь
              </button>
            </div>
          </div>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" class="cancel-button">Отмена</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid" class="submit-button">
          {{ data ? 'Сохранить' : 'Создать' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      background: white;
      border-radius: 12px;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;
    }

    .full-width {
      width: 100%;
    }

    .role-selection {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .role-selection label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }

    .role-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .role-button {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      color: #333;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      &.selected {
        border-color: #2196F3;
        background: rgba(33, 150, 243, 0.05);
        color: #1976D2;
      }

      &.admin {
        &.selected {
          border-color: #f44336;
          background: rgba(244, 67, 54, 0.05);
          color: #d32f2f;
        }
      }

      &.employer {
        &.selected {
          border-color: #2196F3;
          background: rgba(33, 150, 243, 0.05);
          color: #1976D2;
        }
      }

      &.user {
        &.selected {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.05);
          color: #2e7d32;
        }
      }
    }

    .cancel-button {
      margin-right: 12px;
    }

    .submit-button {
      background: linear-gradient(45deg, #2196F3, #1976D2);
      color: white;
      padding: 8px 24px;
      border-radius: 8px;
      font-weight: 500;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      &:disabled {
        background: #e0e0e0;
        transform: none;
        box-shadow: none;
      }
    }
  `]
})
export class CreateUserDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    console.log('CreateUserDialogComponent: Initializing with data:', data);
    this.form = this.fb.group({
      name: [data?.user?.name || '', Validators.required],
      email: [data?.user?.email || '', [Validators.required, Validators.email]],
      role: [data?.user?.role || '', Validators.required]
    });
    console.log('CreateUserDialogComponent: Form initialized with values:', this.form.value);
  }

  selectRole(role: string): void {
    console.log('CreateUserDialogComponent: Selecting role:', role);
    this.form.patchValue({ role });
    console.log('CreateUserDialogComponent: Form value after role selection:', this.form.value);
  }

  onCancel(): void {
    console.log('CreateUserDialogComponent: Cancelling dialog');
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('CreateUserDialogComponent: Submitting form with values:', this.form.value);
      this.dialogRef.close(this.form.value);
    } else {
      console.log('CreateUserDialogComponent: Form is invalid:', this.form.errors);
    }
  }
} 