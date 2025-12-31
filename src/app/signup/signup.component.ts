import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { GenreModel } from '../../models/genre.model';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, NgFor, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public genres: GenreModel[] = []
  public genreNames : string[] = []
  public email = ''
  public password = ''
  public repeatPassword = ''
  public username = ''
  public phone = ''
  public address = ''
  public genre = ''

  public constructor(private router: Router, public utils: UtilsService, private snackBar: MatSnackBar) {
    MovieService.getGenres()
      .then(rsp => {
        this.genres = rsp.data;

        for (let genre of this.genres) {
          let name = genre.name;
          this.genreNames.push(name);
        }
      })
  }

  public doSignup() {
    if (this.email == '' || this.password == '') {
      this.utils.showSnackBar('Email i lozinka su obavezna polja', 'error', this.snackBar);
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
      favoriteGenre: this.genre,
      tickets: []
    });

    if (result) {
      this.utils.showSnackBar('Uspešno ste se registrovali!', 'success', this.snackBar);
      this.router.navigate(['/login']);
    } else {
      this.utils.showSnackBar('Email adresa je već u upotrebi', 'error', this.snackBar);
    }
  }
}
