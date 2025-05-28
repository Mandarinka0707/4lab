import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Vacancy } from '../../../interfaces/interfaces';

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
    MatChipsModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.isEdit ? 'Редактировать вакансию' : 'Создать вакансию' }}</h2>
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
          <mat-label>Образование</mat-label>
          <input matInput formControlName="Education">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Навыки (через запятую)</mat-label>
          <input matInput formControlName="Skills" placeholder="JavaScript, TypeScript, Angular">
          <mat-hint>Введите навыки через запятую</mat-hint>
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
        {{ data?.isEdit ? 'Сохранить' : 'Создать' }}
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
      padding: 20px;
    }
  `]
})
export class CreateVacancyDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateVacancyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      Title: ['', Validators.required],
      Company: ['', Validators.required],
      Description: ['', Validators.required],
      Requirements: ['', Validators.required],
      Responsibilities: ['', Validators.required],
      Salary: ['', [Validators.required, Validators.min(0)]],
      Location: ['', Validators.required],
      EmploymentType: ['full-time', Validators.required],
      Status: ['active', Validators.required],
      Education: [''],
      Skills: ['']
    });

    if (data?.isEdit && data?.vacancy) {
      this.form.patchValue({
        Title: data.vacancy.Title,
        Company: data.vacancy.Company,
        Description: data.vacancy.Description,
        Requirements: data.vacancy.Requirements,
        Responsibilities: data.vacancy.Responsibilities,
        Salary: data.vacancy.Salary,
        Location: data.vacancy.Location,
        EmploymentType: data.vacancy.EmploymentType,
        Status: data.vacancy.Status,
        Education: data.vacancy.Education,
        Skills: Array.isArray(data.vacancy.Skills) ? data.vacancy.Skills.join(', ') : ''
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const skills = formValue.Skills ? formValue.Skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      
      this.dialogRef.close({
        ...formValue,
        Skills: skills
      });
    }
  }
} 