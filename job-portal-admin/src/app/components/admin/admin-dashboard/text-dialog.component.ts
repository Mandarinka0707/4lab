import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-text-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Полный текст</h2>
    <mat-dialog-content>
      <div class="text-content">
        {{ data.text }}
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Закрыть</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .text-content {
      white-space: pre-wrap;
      max-height: 60vh;
      overflow-y: auto;
      padding: 1rem;
    }
  `]
})
export class TextDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { text: string }) {}
}