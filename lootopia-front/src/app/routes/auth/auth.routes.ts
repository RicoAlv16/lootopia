import { LoginComponent } from './login/login.component';

export const authRoutes = [
  {
    path: 'login',
    title: 'login page',
    component: LoginComponent,
  },
  //   {
  //     path: 'register',
  //     title: 'register page',
  //     component: () => import('./register/register.component'),
  //   },
];
