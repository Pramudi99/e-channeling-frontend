export interface CreateAppointmentRequest {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName?: string;
  specialization?: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  consultationFee: number;
}

export interface CreateAppointmentResponse {
  message: string;
  id: number;
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  consultationFee: number;
}

