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

  // Get count of reserved items
  public getReservedCount(): number {
    return this.cart?.filter(item => item.status === 'rezervisano').length || 0;
  }

  // Get total price of reserved items only
  public getReservedPrice(): number {
    return this.cart
      ?.filter(item => item.status === 'rezervisano')
      .reduce((sum, item) => sum + item.price, 0) || 0;
  }

  // Checkout all reserved items at once
  public checkoutAll() {
    const reservedItems = this.cart?.filter(item => item.status === 'rezervisano') || [];

    if (reservedItems.length === 0) {
      this.utils.showSnackBar('Nema stavki za plaćanje', 'error', this.snackBar);
      return;
    }

    // Check for duplicates with already purchased items
    const arr = UserService.retrieveUsers();
    const arrivedItems = this.activeUser!.reservations.filter(r => r.status === "pristiglo");

    for (let reservedItem of reservedItems) {
      for (let arrivedItem of arrivedItems) {
        if (reservedItem.name === arrivedItem.name && reservedItem.id !== arrivedItem.id) {
          // Remove duplicate and skip checkout
          for (let user of arr) {
            if (user.email === this.activeUser!.email) {
              user.reservations = this.activeUser?.reservations.filter(r => r.id !== reservedItem.id) || [];
              localStorage.setItem('users', JSON.stringify(arr));
              this.loadCart();
            }
          }
          this.utils.showSnackBar('Duplikat stavke uklonjen iz korpe', 'error', this.snackBar);
          return;
        }
      }
    }

    // Process all reserved items
    let successCount = 0;
    for (let item of reservedItems) {
      if (UserService.changeReservationStatus(item.id, 'pristiglo')) {
        successCount++;
      }
    }

    if (successCount > 0) {
      this.loadCart();
      this.utils.showSnackBar(`Uspešno kupljeno ${successCount} stavki!`, 'success', this.snackBar);
    } else {
      this.utils.showSnackBar('Greška pri kupovini', 'error', this.snackBar);
    }
  }

  public doCancel(reservation: ReservationModel) {
    if (UserService.changeReservationStatus(reservation.id, 'otkazano')) {
      this.loadCart()
      this.utils.showSnackBar('Rezervacija je otkazana', 'success', this.snackBar);
    }
  }

  public doRemove(reservation: ReservationModel){
    const arr = UserService.retrieveUsers()

    for (let user of arr) {
      if (user.email == this.activeUser!.email) {
        user.reservations = this.activeUser?.reservations.filter(currentReservation => currentReservation.id !== reservation.id) || []
        localStorage.setItem('users', JSON.stringify(arr))
        this.loadCart()
        this.utils.showSnackBar('Stavka je uspešno obrisana', 'success', this.snackBar);
      }
    }
  }

  public doRating(reservation: ReservationModel, rating: number) {
    if (UserService.changeRating(rating, reservation.id)) {
      this.loadCart()
      this.utils.showSnackBar('Ocena je uspešno dodata', 'success', this.snackBar);
    }
  }

  private loadCart() {
    this.activeUser = UserService.getActiveUser()
    this.cart = this.activeUser?.reservations || []
    this.calculateTotal()
  }

  private calculateTotal() {
    // Only count items that are NOT cancelled
    this.totalPrice = this.cart
      ?.filter(item => item.status !== 'otkazano')
      .reduce((sum, item) => sum + item.price, 0) || 0;
  }
}
