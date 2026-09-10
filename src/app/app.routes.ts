import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Register} from './features/auth/pages/register/register';

import { DoctorsList } from './features/doctors/pages/doctors-list/doctors-list';
import { DoctorsDetails } from './features/doctors/pages/doctors-details/doctors-details';
import { BookAppointment } from './features/appointments/pages/book-appointment/book-appointment';
import { MyAppointments } from './features/appointments/pages/my-appointments/my-appointments';
import { PatientDashboard } from './features/patient/pages/patient-dashboard/patient-dashboard';
import { PatientProfile } from './features/patient/pages/patient-profile/patient-profile';
import { DoctorDashboard } from './features/doctor/pages/doctor-dashboard/doctor-dashboard';
import { DoctorAppointments } from './features/doctor/pages/doctor-appointments/doctor-appointments';
import { DoctorSchedule } from './features/doctor/pages/doctor-schedule/doctor-schedule';
import { AdminDashboard } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { AdminDoctors } from './features/admin/pages/admin-doctors/admin-doctors';
import { AdminPatients } from './features/admin/pages/admin-patients/admin-patients';
import { AdminAppointments } from './features/admin/pages/admin-appointments/admin-appointments';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [

    //Authetication
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    // Doctors
    {
      path: 'doctors',
      component: DoctorsList
    },

    {
      path: 'doctors/:id',
      component: DoctorsDetails
    },

    // Appointments
    {
      path: 'appointments/book',
      component: BookAppointment
    },

    {
      path: 'appointments/my-appointments',
      component: MyAppointments
    },

    // Patient
    {
      path: 'patient/dashboard',
      component: PatientDashboard,
      canActivate: [authGuard,
        roleGuard(['Patient'])
      ]
      
    },

    {
      path: 'patient/profile',
      component: PatientProfile
    },

    // Doctor
    {
      path: 'doctor/dashboard',
      component: DoctorDashboard,
      canActivate: [authGuard,
        roleGuard(['Doctor'])
      ]
    },

    {
      path: 'doctor/appointments',
      component: DoctorAppointments
    },

    {
      path: 'doctor/schedule',
      component: DoctorSchedule
    },

    // Admin
    {
      path: 'admin/dashboard',
      component: AdminDashboard
    },

    {
      path: 'admin/doctors',
      component: AdminDoctors
    },

    {
      path: 'admin/patients',
      component: AdminPatients
    },

    {
      path: 'admin/appointments',
      component: AdminAppointments
    },

    // Default route
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },

    // Unknown route
    {
      path: '**',
      redirectTo: 'login'
    }
];
