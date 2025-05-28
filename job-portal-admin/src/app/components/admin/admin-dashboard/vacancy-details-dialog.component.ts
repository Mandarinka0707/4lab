// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';
// import { Vacancy } from '../../../interfaces';

// @Component({
//   selector: 'app-vacancy-details-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatButtonModule
//   ],
//   template: `
//     <h2 mat-dialog-title>{{ data.title }}</h2>
//     <mat-dialog-content>
//       <div class="vacancy-details">
//         <div class="detail-row">
//           <span class="label">Компания:</span>
//           <span>{{ data.company }}</span>
//         </div>
//         <div class="detail-row">
//           <span class="label">Локация:</span>
//           <span>{{ data.location }}</span>
//         </div>
//         <div class="detail-row">
//           <span class="label">Зарплата:</span>
//           <span>{{ data.salary | currency:'RUB':'symbol':'1.0-0' }}</span>
//         </div>
//         <div class="detail-row">
//           <span class="label">Требования:</span>
//           <p>{{ data.requirements }}</p>
//         </div>
//         <div class="detail-row">
//           <span class="label">Обязанности:</span>
//           <p>{{ data.responsibilities }}</p>
//         </div>
//         <div class="detail-row">
//           <span class="label">Навыки:</span>
//           <div class="skills-container">
//             <span *ngFor="let skill of data.skills" class="skill-badge">
//               {{ skill }}
//             </span>
//           </div>
//         </div>
//       </div>
//     </mat-dialog-content>
//     <mat-dialog-actions>
//       <button mat-button mat-dialog-close>Закрыть</button>
//     </mat-dialog-actions>
//   `,
//   styles: [`
//     .vacancy-details {
//       display: grid;
//       gap: 1rem;
//       padding: 1rem;
//       max-width: 600px;
//     }
    
//     .detail-row {
//       display: grid;
//       grid-template-columns: 120px 1fr;
//       align-items: start;
//       gap: 1rem;
//       padding: 0.5rem 0;
//       border-bottom: 1px solid #eee;
//     }
    
//     .detail-row:last-child {
//       border-bottom: none;
//     }
    
//     .label {
//       font-weight: 500;
//       color: #666;
//       word-break: keep-all;
//     }
    
//     .skills-container {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 0.5rem;
//     }
    
//     .skill-badge {
//       background: #e0e0e0;
//       color: rgba(0, 0, 0, 0.87);
//       border-radius: 16px;
//       padding: 4px 12px;
//       font-size: 14px;
//       white-space: nowrap;
//     }
    
//     p {
//       margin: 0;
//       white-space: pre-wrap;
//     }
//   `]
// })
// export class VacancyDetailsDialogComponent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: Vacancy) {}
// }


import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Vacancy } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-vacancy-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.Title }}</h2>
    <mat-dialog-content>
      <div class="vacancy-details">
        <div class="detail-row">
          <span class="label">Компания:</span>
          <span>{{ data.Company }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Локация:</span>
          <span>{{ data.Location }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Зарплата:</span>
          <span>{{ data.Salary | currency:'RUB':'symbol':'1.0-0' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Требования:</span>
          <p>{{ data.Requirements }}</p>
        </div>
        <div class="detail-row">
          <span class="label">Обязанности:</span>
          <p>{{ data.Responsibilities }}</p>
        </div>
        <div class="detail-row">
          <span class="label">Навыки:</span>
          <div class="skills-container">
            <span *ngFor="let skill of data.Skills" class="skill-badge">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Закрыть</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .vacancy-details {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      max-width: 600px;
    }
    
    .detail-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      align-items: start;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
      color: #666;
      word-break: keep-all;
    }
    
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .skill-badge {
      background: #e0e0e0;
      color: rgba(0, 0, 0, 0.87);
      border-radius: 16px;
      padding: 4px 12px;
      font-size: 14px;
      white-space: nowrap;
    }
    
    p {
      margin: 0;
      white-space: pre-wrap;
    }
  `]
})
export class VacancyDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Vacancy) {}
}