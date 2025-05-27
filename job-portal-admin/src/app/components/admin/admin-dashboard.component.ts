import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

styles: [`
  .main-toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
    height: 64px;
  }
  .main-toolbar .logo {
    font-size: 22px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .main-toolbar .spacer {
    flex: 1 1 auto;
  }
  .admin-dashboard {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-top: 90px;
  }
  .stats-cards {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .stat-card {
    display: flex;
    align-items: center;
    min-width: 220px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(25, 118, 210, 0.07);
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: pointer;
    border: none;
  }
  .stat-card:hover {
    box-shadow: 0 6px 24px rgba(25, 118, 210, 0.15);
    transform: translateY(-4px) scale(1.03);
  }
  .stat-card .stat-icon {
    font-size: 40px;
    margin-right: 18px;
    color: #1976d2;
    background: #e3f2fd;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  }
  .stat-card.users .stat-icon { color: #1976d2; background: #e3f2fd; }
  .stat-card.vacancies .stat-icon { color: #388e3c; background: #e8f5e9; }
  .stat-card.resumes .stat-icon { color: #f57c00; background: #fff3e0; }
  .stat-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .stat-label {
    font-size: 15px;
    color: #888;
    font-weight: 500;
  }
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #222;
    margin-top: 2px;
  }
  @media (max-width: 900px) {
    .stats-cards { flex-direction: column; gap: 16px; }
    .stat-card { min-width: 0; width: 100%; }
  }
  // ... остальные стили ...
`] 