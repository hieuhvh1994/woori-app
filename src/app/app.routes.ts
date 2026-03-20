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
  { path: 'find-id', loadComponent: () => import('./pages/find-id/find-id').then(m => m.FindIdComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  { path: 'mobile-otp', loadComponent: () => import('./pages/mobile-otp/mobile-otp').then(m => m.MobileOtpComponent) },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'transactions/:accountId', component: TransactionsComponent, canActivate: [authGuard] },
  { path: 'transactions/:accountId/detail/:txnId', loadComponent: () => import('./pages/transaction-detail/transaction-detail').then(m => m.TransactionDetailComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
