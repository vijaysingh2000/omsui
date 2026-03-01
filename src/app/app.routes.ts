import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { PatientsComponent } from './patients/patients.component';
import { ClientsComponent } from './clients/clients.component';
import { DrugsComponent } from './drugs/drugs.component';
import { InsurancesComponent } from './insurances/insurances.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { ProvidersComponent } from './providers/providers.component';
import { UsersComponent } from './users/users.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'dashboard',    component: DashboardComponent,  canActivate: [authGuard] },
	{ path: 'reports',      component: ReportComponent,     canActivate: [authGuard] },
	{ path: 'my-profile',   component: MyProfileComponent,  canActivate: [authGuard] },
	{ path: 'patients',     component: PatientsComponent,   canActivate: [authGuard] },
	{ path: 'call-list',    component: PlaceholderComponent, canActivate: [authGuard] },
	{ path: 'list',         component: PlaceholderComponent, canActivate: [authGuard] },
	{ path: 'batch-payment', component: PlaceholderComponent, canActivate: [authGuard] },
	{ path: 'invoices',     component: PlaceholderComponent, canActivate: [authGuard] },
	{ path: 'users',        component: UsersComponent,      canActivate: [authGuard] },
	{ path: 'clients',      component: ClientsComponent,    canActivate: [authGuard] },
	{ path: 'drugs',        component: DrugsComponent,      canActivate: [authGuard] },
	{ path: 'insurances',   component: InsurancesComponent, canActivate: [authGuard] },
	{ path: 'manufacturer', component: ManufacturerComponent, canActivate: [authGuard] },
	{ path: 'providers',    component: ProvidersComponent,  canActivate: [authGuard] },
	{ path: '**', redirectTo: 'login' }
];
