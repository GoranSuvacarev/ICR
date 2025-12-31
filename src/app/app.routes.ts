import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { SignupComponent } from './signup/signup.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details/:shortUrl', component: DetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user', component: UserComponent },
    { path: 'cart', component: CartComponent },
    { path: 'signup', component: SignupComponent },
    { path: '**', redirectTo: '' }
]
