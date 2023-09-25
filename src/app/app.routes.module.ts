import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IsAuthGuard } from './core/auth-guard/auth-guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { BinDetailsComponent } from './modules/bin/details/bin-details.component';
import { BinNewComponent } from './modules/bin/new/bin-new.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent,
        children: [{ path: 'login', component: LoginComponent }],
      },
      { path: 'register', component: RegisterComponent },
      {
        path: 'dashboard',
        canActivate: [IsAuthGuard],
        component: DashboardComponent,
      },
      {
        path: 'bin-new',
        canActivate: [IsAuthGuard],
        component: BinNewComponent,
      },
      {
        path: 'bin-details',
        canActivate: [IsAuthGuard],
        component: BinDetailsComponent,
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [],
  declarations: [],
})
export class AppRoutesModule {}
