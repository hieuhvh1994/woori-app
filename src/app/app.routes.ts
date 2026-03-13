import { Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { TransactionsComponent } from './pages/transactions/transactions';
import { ProfileComponent } from './pages/profile/profile';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'transactions/:accountId', component: TransactionsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
