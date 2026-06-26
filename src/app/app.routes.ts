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
  { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent), canActivate: [authGuard] },
  { path: 'calculator', loadComponent: () => import('./pages/calculator/calculator').then(m => m.CalculatorComponent), canActivate: [authGuard] },
  { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications').then(m => m.NotificationsComponent), canActivate: [authGuard] },
  { path: 'services', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent), canActivate: [authGuard] },
  { path: 'topup', loadComponent: () => import('./pages/topup/topup').then(m => m.TopupComponent), canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'transactions/:accountId', component: TransactionsComponent, canActivate: [authGuard] },
  { path: 'transactions/:accountId/detail/:txnId', loadComponent: () => import('./pages/transaction-detail/transaction-detail').then(m => m.TransactionDetailComponent), canActivate: [authGuard] },
  { path: 'transactions/:accountId/transfer', loadComponent: () => import('./pages/transfer/transfer').then(m => m.TransferComponent), canActivate: [authGuard] },
  { path: 'qr-scan', loadComponent: () => import('./pages/qr-scan/qr-scan').then(m => m.QrScanComponent), canActivate: [authGuard] },
  { path: 'my-qr', loadComponent: () => import('./pages/my-qr/my-qr').then(m => m.MyQrComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
