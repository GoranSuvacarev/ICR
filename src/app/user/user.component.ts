import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router} from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { TicketModel } from '../../models/ticket.model';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgFor } from '@angular/common';
import {UtilsService} from '../../services/utils.service';
import {MatOption, MatSelect} from '@angular/material/select';
import {GenreModel} from '../../models/genre.model';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-user',
  imports: [
    NgIf,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    MatAccordion,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgClass,
    NgFor,
    MatSelect,
    MatOption,
    MatSnackBarModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public displayedColumns: string[] = ['title', 'runTime', 'scheduledAt', 'price','rating'];
  public user: UserModel | null = null
  public copyUser : UserModel | null = null
  public watchedMovies: TicketModel[] | null = null



  public oldPasswordValue = ''
  public newPasswordValue = ''
  public repeatPasswordValue = ''

  public genres : GenreModel[] = []
  public genreNames : string[] = []
  public genre = ''

  constructor(private router: Router,  public utils: UtilsService, private snackBar: MatSnackBar) {
    if (!UserService.getActiveUser()) {
      router.navigate(['/home'])
      return
    }

    MovieService.getGenres()
          .then(rsp => {
            this.genres = rsp.data;

            for (let genre of this.genres) {
              let name = genre.name;
              this.genreNames.push(name);
            }
          })

    this.loadProfile()
  }

  public doChangePassword() {
    if (this.oldPasswordValue == '' || this.newPasswordValue == '') {
      this.utils.showSnackBar('Lozinka ne može biti prazna', 'error', this.snackBar);
      return;
    }

    if (this.newPasswordValue !== this.repeatPasswordValue) {
      this.utils.showSnackBar('Lozinke se ne podudaraju', 'error', this.snackBar);
      return;
    }

    if (this.oldPasswordValue !== this.user?.password) {
      this.utils.showSnackBar('Trenutna lozinka nije ispravna', 'error', this.snackBar);
      return;
    }

    if (UserService.changePassword(this.newPasswordValue)) {
      this.utils.showSnackBar('Lozinka je uspešno promenjena', 'success', this.snackBar);
    } else {
      this.utils.showSnackBar('Greška pri promeni lozinke', 'error', this.snackBar);
    }

    this.oldPasswordValue = '';
    this.newPasswordValue = '';
    this.repeatPasswordValue = '';
  }

  public doUpdateUser() {
    if (this.user == null) {
      this.utils.showSnackBar('Greška pri promeni podataka', 'error', this.snackBar);
      return
    }

    UserService.updateUser(this.copyUser!)
    this.user = UserService.getActiveUser()
    this.utils.showSnackBar('Korisničke informacije uspešno ažurirane', 'success', this.snackBar);
  }

  public doRating(ticket: TicketModel, rating: number) {
    if (UserService.changeRating(rating, ticket.id)) {
      this.loadProfile();
      this.utils.showSnackBar('Ocena je uspešno dodata', 'success', this.snackBar);
    } else {
      this.utils.showSnackBar('Greška pri dodavanju ocene', 'error', this.snackBar);
    }
  }

  public loadProfile(){
    this.user = UserService.getActiveUser()
    this.copyUser = UserService.getActiveUser()
    this.watchedMovies = this.user?.tickets.filter(ticket => ticket.status === "watched") || [];
  }
}
