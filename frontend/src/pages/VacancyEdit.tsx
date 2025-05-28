import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { vacancies } from '../services/api';
import { Vacancy } from '../types';

// Interface for backend response
interface VacancyResponse {
  // PascalCase properties (from backend)
  ID?: number;
  EmployerID?: number;
  Title?: string;
  Description?: string;
  Requirements?: string;
  Responsibilities?: string;
  Salary?: number;
  Location?: string;
  EmploymentType?: string;
  Company?: string;
  Status?: string;
  Skills?: string[];
  Education?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  
  // camelCase properties (from frontend)
  id?: number;
  employerId?: number;
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  salary?: number;
  location?: string;
  employmentType?: string;
  company?: string;
  status?: string;
  skills?: string[];
  education?: string;
  createdAt?: string;
  updatedAt?: string;
}

const employmentTypes = [
  'Полная занятость',
  'Частичная занятость',
  'Проектная работа',
  'Стажировка',
  'Удаленная работа'
];

const VacancyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState<Partial<Vacancy>>({
    id: undefined,
    employerId: user?.id,
    title: '',
    description: '',
    requirements: [],
    responsibilities: '',
    salary: '',
    location: '',
    employmentType: '',
    company: '',
    status: 'active',
    skills: [],
    education: ''
  });

  useEffect(() => {
    if (!id) {
      setError('ID вакансии не указан');
      setLoading(false);
      return;
    }
    fetchVacancy();
  }, [id]);

  const fetchVacancy = async () => {
    try {
      const rawResponse = await vacancies.getById(id!);
      const response = rawResponse as unknown as VacancyResponse;
      console.log('Vacancy data:', response);
      console.log('Current user:', user);
      
      // Get employerId from either PascalCase or camelCase property
      const responseEmployerId = String(response.EmployerID || response.employerId);
      const currentUserId = String(user?.id);
      
      console.log('Comparing IDs:', { responseEmployerId, currentUserId });
      
      if (!responseEmployerId || !currentUserId || responseEmployerId !== currentUserId) {
        setError('У вас нет прав на редактирование этой вакансии');
        setLoading(false);
        return;
      }
      
      // Transform the data to match the form structure
      setFormData({
        id: String(response.ID || response.id),
        employerId: responseEmployerId,
        title: response.Title || response.title || '',
        description: response.Description || response.description || '',
        requirements: ((): string[] => {
          const reqs = response.Requirements || response.requirements;
          if (Array.isArray(reqs)) return reqs;
          if (typeof reqs === 'string') return [reqs];
          return [''];
        })(),
        responsibilities: response.Responsibilities || response.responsibilities || '',
        salary: String(response.Salary || response.salary || ''),
        location: response.Location || response.location || '',
        employmentType: response.EmploymentType || response.employmentType || '',
        company: response.Company || response.company || '',
        status: (response.Status || response.status || 'active') as 'active' | 'archived',
        skills: response.Skills || response.skills || [],
        education: response.Education || response.education || ''
      });
    } catch (err: any) {
      console.error('Ошибка при загрузке вакансии:', err);
      setError(err.response?.data?.error || 'Не удалось загрузить вакансию');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        salary: formData.salary,
        location: formData.location,
        employmentType: formData.employmentType,
        company: formData.company
      };

      const emptyFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value || (Array.isArray(value) && value.length === 0))
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        throw new Error(`Пожалуйста, заполните следующие обязательные поля: ${emptyFields.join(', ')}`);
      }

      // Transform the data to match backend expectations
      const updateData = {
        ID: parseInt(formData.id!),
        EmployerID: parseInt(formData.employerId!),
        Title: formData.title!.trim(),
        Description: formData.description!.trim(),
        Requirements: Array.isArray(formData.requirements) 
          ? formData.requirements.filter(Boolean).join('\n')
          : String(formData.requirements).trim(),
        Responsibilities: formData.responsibilities!.trim(),
        Salary: parseInt(formData.salary!),
        Location: formData.location!.trim(),
        EmploymentType: formData.employmentType!.trim(),
        Company: formData.company!.trim(),
        Status: formData.status || 'active',
        Skills: (formData.skills || []).filter(Boolean),
        Education: formData.education?.trim() || ''
      };

      // Additional validation for numeric fields
      if (isNaN(updateData.Salary) || updateData.Salary <= 0) {
        throw new Error('Пожалуйста, укажите корректную зарплату');
      }

      console.log('Sending update data:', updateData);
      await vacancies.update(id!, updateData);
      navigate('/employer/dashboard');
    } catch (err: any) {
      console.error('Ошибка при обновлении вакансии:', err);
      setError(err.response?.data?.error || err.message || 'Не удалось обновить вакансию');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Редактирование вакансии
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Название вакансии"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Описание"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Требования"
                name="requirements"
                multiline
                rows={4}
                value={Array.isArray(formData.requirements) ? formData.requirements.join('\n') : formData.requirements}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requirements: e.target.value.split('\n').filter(line => line.trim())
                }))}
                required
              />

              <TextField
                fullWidth
                label="Обязанности"
                name="responsibilities"
                multiline
                rows={4}
                value={formData.responsibilities}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Зарплата"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Местоположение"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />

              <FormControl fullWidth required>
                <InputLabel>Тип занятости</InputLabel>
                <Select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleSelectChange}
                  label="Тип занятости"
                >
                  {employmentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Компания"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Навыки
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Добавить навык"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {formData.skills?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                    />
                  ))}
                </Stack>
              </Box>

              <TextField
                fullWidth
                label="Образование"
                name="education"
                value={formData.education}
                onChange={handleChange}
              />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/employer/dashboard')}
                >
                  Отмена
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default VacancyEdit; 