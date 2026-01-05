import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router} from '@angular/router';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgFor } from '@angular/common';
import {UtilsService} from '../../services/utils.service';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { ReservationModel } from '../../models/reservation.model';

@Component({
  selector: 'app-cart',
  imports: [
    NgIf,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgClass,
    NgFor,
    MatSnackBarModule,
    
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent {
  public displayedColumns: string[] = ['name', 'description', 'type', 'ageGroup', 'targetGroup', 'productionDate', 'price', 'status', 'actions'];
  public activeUser: UserModel | null = null
  public cart: ReservationModel[] | null = null
  public totalPrice : number = 0

  constructor(private router: Router, public utils: UtilsService, public snackBar: MatSnackBar) {
    if (!UserService.getActiveUser()) {
      router.navigate(['/home'])
      return
    }

    this.loadCart()
  }

  public doPay(reservation: ReservationModel) {
    const arr = UserService.retrieveUsers()
    for (let toy of this.activeUser!.reservations.filter(reservation => reservation.status === "pristiglo")) {
      if(reservation.name == toy.name){
        if(reservation.id != toy.id){
          for (let user of arr) {
          if (user.email == this.activeUser!.email) {
            user.reservations = this.activeUser?.reservations.filter(currentReservation => currentReservation.id !== reservation.id) || []
            localStorage.setItem('users', JSON.stringify(arr))
            this.loadCart()
          }
          }
          return
        }
      }
    }

    if (UserService.changeReservationStatus(reservation.id, 'pristiglo')) {
      this.loadCart()
      this.utils.showSnackBar('Igracka je uspešno kupljena', 'success', this.snackBar);
    }
  }

  public doRating(reservation: ReservationModel, rating: number) {
    if (UserService.changeRating(rating, reservation.id)) {
      this.loadCart();
      this.utils.showSnackBar('Ocena je uspešno dodata', 'success', this.snackBar);
    } else {
      this.utils.showSnackBar('Greška pri dodavanju ocene', 'error', this.snackBar);
    }
  }

  public doCancel(reservation: ReservationModel) {
    if (UserService.changeReservationStatus(reservation.id, 'otkazano')) {
      this.loadCart()
      this.utils.showSnackBar('Rezervacija je uspešno otkazana', 'success', this.snackBar);
    }
  }

  public doRemove(reservation: ReservationModel) {
    const arr = UserService.retrieveUsers()
    for (let toy of this.activeUser!.reservations) {
      if(reservation.id == toy.id){
          for (let user of arr) {
          if (user.email == this.activeUser!.email) {
            user.reservations = this.activeUser?.reservations.filter(currentReservation => currentReservation.id !== reservation.id) || []
            localStorage.setItem('users', JSON.stringify(arr))
            this.loadCart()
          }
          }
          return
      }
    }
  }

  public loadCart(){
    this.activeUser = UserService.getActiveUser()
    this.cart = this.activeUser?.reservations || [];
    this.totalPrice = 0
    for(let ticket of this.cart!){
      this.totalPrice += ticket.price
    }
  }
}
