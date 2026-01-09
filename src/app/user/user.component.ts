import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserModel } from '../../models/user.model';
import { TypeModel } from '../../models/type.model';
import { ReservationModel } from '../../models/reservation.model';
import { ToyService } from '../../services/toy.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelect,
    MatOption,
    MatSnackBarModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public user: UserModel | null = null
  public copyUser: UserModel | null = null
  public reservedToys: ReservationModel[] | null = null

  public oldPasswordValue = ''
  public newPasswordValue = ''
  public repeatPasswordValue = ''

  public types: TypeModel[] = []
  public typeNames: string[] = []

  constructor(private router: Router, public utils: UtilsService, private snackBar: MatSnackBar) {
    if (!UserService.getActiveUser()) {
      router.navigate(['/home'])
      return
    }

    ToyService.getTypes()
      .then(rsp => {
        this.types = rsp.data;

        for (let type of this.types) {
          let name = type.name;
          this.typeNames.push(name);
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

  public doRating(reservation: ReservationModel, rating: number) {
    if (UserService.changeRating(rating, reservation.id)) {
      this.loadProfile();
      this.utils.showSnackBar('Ocena je uspešno dodata', 'success', this.snackBar);
    } else {
      this.utils.showSnackBar('Greška pri dodavanju ocene', 'error', this.snackBar);
    }
  }

  public loadProfile() {
    this.user = UserService.getActiveUser()
    this.copyUser = UserService.getActiveUser()
    this.reservedToys = this.user?.reservations.filter(reservation => reservation.status === "rezervisano") || [];
  }

  public goToHome() {
    this.router.navigate(['/']);
  }
}
