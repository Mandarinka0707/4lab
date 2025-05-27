import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-vacancy-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Редактировать вакансию' : 'Создать вакансию' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Название</mat-label>
          <input matInput formControlName="Title" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Компания</mat-label>
          <input matInput formControlName="Company" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Описание</mat-label>
          <textarea matInput formControlName="Description" required rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Требования</mat-label>
          <textarea matInput formControlName="Requirements" required rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Обязанности</mat-label>
          <textarea matInput formControlName="Responsibilities" required rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Зарплата</mat-label>
          <input matInput formControlName="Salary" required type="number">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Местоположение</mat-label>
          <input matInput formControlName="Location" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Тип занятости</mat-label>
          <mat-select formControlName="EmploymentType" required>
            <mat-option value="full-time">Полная занятость</mat-option>
            <mat-option value="part-time">Частичная занятость</mat-option>
            <mat-option value="contract">Контракт</mat-option>
            <mat-option value="internship">Стажировка</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Статус</mat-label>
          <mat-select formControlName="Status" required>
            <mat-option value="active">Активна</mat-option>
            <mat-option value="closed">Закрыта</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Отмена</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid">
        {{ data ? 'Сохранить' : 'Создать' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      max-height: 80vh;
      overflow-y: auto;
    }
  `]
})
export class CreateVacancyDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateVacancyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = data?.form || null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(true);
    }
  }
} 