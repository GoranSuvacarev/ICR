import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../services/utils.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, RouterLink, MatSnackBarModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public email: string = ''
  public password: string = ''

  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private router: Router, public utils: UtilsService, private snackBar: MatSnackBar) {
    if (UserService.getActiveUser()) {
      router.navigate(['/user'])
      return
    }
  }

  public doLogin() {
    if (!this.email || !this.emailPattern.test(this.email)) {
      this.utils.showSnackBar('Unesite validnu email adresu', 'error', this.snackBar);
      return;
    }

    
    if (!this.password || this.password.length < 6) {
      this.utils.showSnackBar('Šifra mora imati najmanje 6 karaktera', 'error', this.snackBar);
      return;
    }

    if (UserService.login(this.email, this.password)) {
      this.router.navigate(['/'])
      return
    }

    this.utils.showSnackBar('Pogrešan email ili lozinka', 'error', this.snackBar);
  }
}
