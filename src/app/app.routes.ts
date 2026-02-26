import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'reports', component: ReportComponent },
	{ path: 'my-profile', component: MyProfileComponent },
	{ path: 'patients', component: PlaceholderComponent },
	{ path: 'call-list', component: PlaceholderComponent },
	{ path: 'list', component: PlaceholderComponent },
	{ path: 'batch-payment', component: PlaceholderComponent },
	{ path: 'invoices', component: PlaceholderComponent },
	{ path: 'users', component: PlaceholderComponent },
	{ path: '**', redirectTo: '' }
];
