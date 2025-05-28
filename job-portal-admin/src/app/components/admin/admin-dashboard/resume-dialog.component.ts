import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Resume, User } from '../../../interfaces/interfaces';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-resume-dialog',
  templateUrl: './resume-dialog.component.html',
  styleUrls: ['./resume-dialog.component.scss']
})
export class ResumeDialogComponent implements OnInit {
  resumeForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResumeDialogComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: Resume
  ) {
    this.resumeForm = this.fb.group({
      user_id: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      experience: [''],
      education: [''],
      skills: ['']
    });

    if (data) {
      this.resumeForm.patchValue({
        user_id: data.userId,
        title: data.title,
        description: data.description,
        experience: data.experience,
        education: data.education,
        skills: data.skills ? data.skills.join(', ') : ''
      });
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  onSubmit() {
    if (this.resumeForm.valid) {
      const formValue = this.resumeForm.value;
      const resume: Partial<Resume> = {
        userId: formValue.user_id,
        title: formValue.title,
        description: formValue.description,
        experience: formValue.experience,
        education: formValue.education,
        skills: formValue.skills ? formValue.skills.split(',').map((s: string) => s.trim()) : [],
        status: 'active'
      };

      if (this.data) {
        resume.id = this.data.id;
      }

      this.dialogRef.close(resume);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 