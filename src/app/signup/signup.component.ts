import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {UtilsService} from '../../services/utils.service';
import { ToyService } from '../../services/toy.service';
import { TypeModel } from '../../models/type.model';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, NgFor, NgIf, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public types: TypeModel[] = []
  public typeNames : string[] = []
  public email = ''
  public password = ''
  public repeatPassword = ''
  public username = ''
  public phone = ''
  public address = ''
  public type = ''

  
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private usernamePattern = /^[a-zA-Z0-9_-]+$/;
  private phonePattern = /^[0-9]{9,10}$/;

  public constructor(private router: Router, public utils: UtilsService, private snackBar: MatSnackBar) {
    ToyService.getTypes()
      .then(rsp => {
        this.types = rsp.data;

        for (let type of this.types) {
          let name = type.name;
          this.typeNames.push(name);
        }
      })
  }

  public doSignup() {
    if (!this.type) {
      this.utils.showSnackBar('Morate odabrati omiljeni žanr', 'error', this.snackBar);
      return;
    }

    if (!this.email || !this.emailPattern.test(this.email)) {
      this.utils.showSnackBar('Unesite validnu email adresu', 'error', this.snackBar);
      return;
    }

    if (!this.username || this.username.length < 3 || this.username.length > 20 || !this.usernamePattern.test(this.username)) {
      this.utils.showSnackBar('Username mora imati 3-20 karaktera (slova, brojevi, _, -)', 'error', this.snackBar);
      return;
    }

    if (!this.phone || !this.phonePattern.test(this.phone)) {
      this.utils.showSnackBar('Telefon mora imati 9-10 cifara', 'error', this.snackBar);
      return;
    }

    if (!this.address || this.address.length < 5 || this.address.length > 100) {
      this.utils.showSnackBar('Adresa mora imati najmanje 5 karaktera', 'error', this.snackBar);
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.utils.showSnackBar('Šifra mora imati najmanje 6 karaktera', 'error', this.snackBar);
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.utils.showSnackBar('Lozinke se ne podudaraju', 'error', this.snackBar);
      return;
    }

    const result = UserService.createUser({
      email: this.email,
      password: this.password,
      username: this.username,
      phone: this.phone,
      address: this.address,
      favoriteType: this.type,
      reservations: []
    });

    if (result) {
      this.utils.showSnackBar('Uspešno ste se registrovali!', 'success', this.snackBar);
      this.router.navigate(['/login']);
    } else {
      this.utils.showSnackBar('Email adresa je već u upotrebi', 'error', this.snackBar);
    }
  }
}
