export interface CreateDoctorRequest {
  fullName: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  description: string | null;
}