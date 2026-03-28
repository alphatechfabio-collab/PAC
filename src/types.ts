export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  athlete_id: string;
  athlete_name: string;
  academy_id: string;
  academy_name: string;
  belt: string;
  stripes?: number;
  weight_class: string;
  age_category: string;
  gender: 'M' | 'F';
  payment_status: 'pending' | 'paid';
  approved?: boolean;
  registration_date: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  registration_fee: number;
  registration_deadline: string;
  organizer_id: string;
  status: 'draft' | 'open' | 'closed' | 'finished';
  rules: string;
  prizes: string;
  categories: {
    age: string[];
    belts: string[];
    weights: string[];
  };
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'professor' | 'academy' | 'developer';
  academy_id?: string;
  unit_ids?: string[];
  created_at?: string;
  professor_permissions?: {
    gestao: boolean;
    administrativa: boolean;
    pedagogica: boolean;
  };
  available_academies?: {
    academy_id: string;
    academy_name: string;
    role: 'athlete' | 'professor' | 'academy';
    permissions: {
      gestao: boolean;
      administrativa: boolean;
      pedagogica: boolean;
    };
  }[];
}

export interface CooperTestResult {
  date: string;
  distance_meters: number;
  vo2_max_estimated: number;
  rpe_perceived: number;
}

export interface CalorimetryResult {
  date: string;
  resting_metabolic_rate: number;
  active_metabolic_rate: number;
  tdee_estimated: number;
}

export interface DiagnosticReport {
  date: string;
  report: string;
}

export interface Athlete {
  id: string;
  user_id: string;
  academy_id?: string;
  unit_id?: string;
  owner_id?: string;
  name: string;
  birth_date: string;
  gender?: 'M' | 'F';
  height?: number;
  profile_photo?: string;
  weight_class: string;
  belt: string;
  stripes: number;
  team: string;
  injury_history: string;
  goals: string;
  score: number;
  classification: string;
  email?: string;
  latest_weight?: number;
  nutrition?: any[];
  nutrition_summary?: any;
  cooper_tests?: CooperTestResult[];
  calorimetry_history?: CalorimetryResult[];
  diagnostics?: DiagnosticReport[];
  physical?: any[];
  psychological?: any[];
  training?: any[];
  competitions?: any[];
  technical?: any[];
  health?: any[];
  discipline?: any[];
  training_count_30d?: number;
  latest_psych_score?: number;
  latest_physical_power?: number;
  latest_discipline_score?: number;
  medals_count?: {
    gold: number;
    silver: number;
    bronze: number;
  };
  merit_points?: number;
  location?: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  badges?: string[];
  // PAC Intelligence Dossier Metrics
  sleep_telemetry?: {
    avg_hours: number;
    recovery_quality: number; // 0-100
    deep_sleep_pct: number; // 0-100
  };
  biometrics?: {
    fat_percentage: number;
    target_weight: number;
    resting_hr?: number;
    hrv?: number;
    spo2?: number;
  };
  technical_history?: {
    raspagens_efficiency: number; // 0-100
    passagens_efficiency: number; // 0-100
    finalizacoes_efficiency: number; // 0-100
    quedas_efficiency?: number;
    defesa_efficiency?: number;
  };
  mastered_techniques_percentage?: number;
  technical_competencies?: {
    [technique: string]: number;
  };
  plan_id?: string;
  payment_status?: 'paid' | 'pending' | 'overdue';
  payment_day?: number;
  is_blocked?: boolean;
  last_graduation_date?: string;
  is_candidate?: boolean;
  selection_status?: 'Avaliação' | 'Teste' | 'Aprovado' | 'Reprovado';
}

export interface ClassSchedule {
  id: string;
  academy_id: string;
  unit_id?: string;
  day_of_week: number; // 0 (Sunday) to 6 (Saturday)
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  activity: string;
  instructor_id: string;
  instructor_name: string;
  max_capacity: number;
  technical_focus?: string;
  lesson_plan?: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  athlete_id: string;
  academy_id?: string;
  athlete_name: string;
  schedule_id: string;
  date: string; // YYYY-MM-DD
  status: 'pending' | 'confirmed' | 'cancelled';
  checkin_time: any; // Timestamp
  confirmed_at?: any; // Timestamp
  confirmed_by?: string; // professor_id
}

export interface Post {
  id: string;
  athlete_id: string;
  academy_id?: string;
  athlete_name: string;
  content: string;
  type: 'manual' | 'automatic';
  media_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  metadata?: any;
}

export interface Story {
  id: string;
  athlete_id: string;
  academy_id?: string;
  athlete_name: string;
  content: string;
  image_url?: string;
  media_type?: 'image' | 'video';
  filter?: string;
  object_fit?: 'cover' | 'contain';
  created_at: string;
  expires_at: string;
}

export interface Challenge {
  id: string;
  academy_id?: string;
  title: string;
  description: string;
  type: 'physical' | 'technical' | 'consistency';
  start_date: string;
  end_date: string;
  points: number;
}

export interface Mission {
  id: string;
  academy_id?: string;
  title: string;
  description: string;
  points: number;
  target_value?: number;
  unit?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  academy_id?: string;
  type: 'performance_drop' | 'attendance_drop' | 'ranking_drop' | 'weight_warning';
  message: string;
  created_at: any;
  read: boolean;
}

export interface PhysicalEvaluation {
  id: string;
  athlete_id: string;
  academy_id?: string;
  date: string;
  pull_ups: number; // Barra Fixa
  push_ups: number; // Flexão 2 min
  kimono_grip_seconds: number; // Isometria Pegada
  sprint_seconds: number; // Sprint 50m
  burpees: number; // Burpees 2 min
  shuttle_run_seconds: number; // Shuttle Run (Agilidade)
  rounds_resistance: number; // Rounds de Resistência (3x 5min)
  weight: number;
  total_score: number; // 0-100
}

export interface PsychologicalEvaluation {
  id: string;
  athlete_id: string;
  academy_id?: string;
  date: string;
  disciplina: number; // 0-100
  resiliencia: number; // 0-100
  mentalidade_competitiva: number; // 0-100
  controle_emocional: number; // 0-100
  responsabilidade: number; // 0-100
  tolerancia_dor: number; // 0-100
  mentalidade_crescimento: number; // 0-100
  overall_score: number; // 0-200
}

export interface TrainingLog {
  id: string;
  athlete_id: string;
  academy_id?: string;
  date: string;
  type: 'técnico' | 'sparring' | 'condicionamento' | 'estratégia' | 'recuperação';
  intensity: number;
  duration_minutes: number;
  notes: string;
}

export interface Competition {
  id: string;
  athlete_id: string;
  academy_id?: string;
  name: string;
  date: string;
  category: string;
  result: string;
  points_earned: number;
}

export interface NutritionPlan {
  id: string;
  athlete_id: string;
  academy_id?: string;
  date: string;
  weight: number;
  height: number;
  age: number;
  gender: 'M' | 'F';
  activity_level: number;
  body_fat_pct: number;
  skinfolds?: {
    triceps?: number;
    biceps?: number;
    subscapular?: number;
    suprailiac?: number;
    abdominal?: number;
    thigh?: number;
    calf?: number;
    chest?: number;
    midaxillary?: number;
  };
  bmr: number;
  tdee: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  water_target_ml?: number;
  goal: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  supplements: string;
  notes: string;
  front_photo_url?: string;
  side_photo_url?: string;
  front_photo_base64?: string;
  side_photo_base64?: string;
  clinical_analysis?: string;
  ai_feedback?: string;
  preferences?: string;
}

export interface MealLog {
  id: string;
  athlete_id: string;
  academy_id?: string;
  date: string; // ISO Date
  meal_type: 'Café da Manhã' | 'Almoço' | 'Jantar' | 'Lanche' | 'Suplementação';
  food_name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at: any;
}

export interface WaterLog {
  id: string;
  athlete_id: string;
  academy_id?: string;
  date: string; // YYYY-MM-DD
  amount_ml: number;
  timestamp: any;
}

export interface Media {
  id: string;
  academy_id?: string;
  title: string;
  url: string;
  type: 'video' | 'pdf';
  thumbnail?: string;
  description?: string;
}

export interface Professor {
  id: string;
  user_id?: string;
  academy_id: string;
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  permissions: {
    gestao: boolean;
    administrativa: boolean;
    pedagogica: boolean;
  };
  created_at: string;
}

export interface Academy {
  id: string;
  name: string;
  owner_id?: string;
  head_coach: string;
  location: string;
  lat?: number;
  lng?: number;
  contact: string;
  created_at: string;
  athlete_count?: number;
  plan_id?: string;
  payment_status?: 'paid' | 'pending' | 'overdue';
  payment_day?: number;
  is_blocked?: boolean;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  tv_scroll_speed?: number;
  tv_media_ids?: string[];
}

export interface Plan {
  id: string;
  name: string;
  type: 'Presencial' | 'A distância';
  frequency: 'Day Use' | 'Semanal' | 'Mensal' | 'Trimestral' | 'Anual';
  basePrice: number;
  discount: number;
  isSocial: boolean;
  isScholarship: boolean;
  target: 'athletes' | 'academies';
  academy_id?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Technique {
  id: string;
  name: string;
  position: string;
  category: string;
  belt: 'Branca' | 'Azul' | 'Roxa' | 'Marrom' | 'Preta';
  modality: 'Gi' | 'No-Gi' | 'Both';
  initial_position: string;
  objective: string;
  steps: string[];
  common_errors: string[];
  technical_adjustments: string;
  defenses: string[];
  continuations: string[];
  variations: string[];
  visuals: {
    image_url?: string;
    gif_url?: string;
    video_url?: string;
    illustration_url?: string;
  };
  created_at: string;
}

export interface TechniqueSubmission {
  id: string;
  technique_id: string;
  technique_name: string;
  athlete_id: string;
  athlete_name: string;
  video_url: string;
  status: 'pending' | 'validated' | 'rejected';
  professor_feedback?: string;
  evaluated_by?: string;
  evaluated_at?: string;
  submitted_at: string;
  created_at?: string;
}

export interface StudentTechniqueProgress {
  id: string;
  athlete_id: string;
  technique_id: string;
  status: 'not_started' | 'studying' | 'submitted' | 'validated' | 'rejected';
  last_updated: string;
}
