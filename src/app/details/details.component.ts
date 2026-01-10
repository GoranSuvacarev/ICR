import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { AxiosError } from 'axios';
import {UtilsService} from '../../services/utils.service';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [NgIf, MatCardModule, MatListModule, MatButtonModule, MatSnackBarModule,MatFormFieldModule,
    MatInputModule,FormsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  public toy: ToyModel | null = null
  public error: string | null = null
  selectedQuantity: number = 1;

  public constructor(private route: ActivatedRoute, public utils: UtilsService, private snackBar: MatSnackBar) {
    route.params.subscribe(params => {
      ToyService.getToyByPermalink(params['permalink'])
        .then(rsp => {
          this.toy = rsp.data
        })
        .catch((e: AxiosError) =>  { console.log(e); this.error = `${e.code}: ${e.message}`} )
    })
  }

  public reserveToy(quantity?: number) {
    const qty = quantity || this.selectedQuantity || 1;

    // Validate quantity
    if (qty < 1 || qty > 100) {
      this.utils.showSnackBar('Količina mora biti između 1 i 100', 'error', this.snackBar);
      return;
    }

    // Create multiple reservations based on quantity
    let successCount = 0;
    for (let i = 0; i < qty; i++) {
      const result = UserService.createReservation({
        id: new Date().getTime() + i,
        name: this.toy!.name,
        description: this.toy!.description,
        type: this.toy!.type.name,
        ageGroup: this.toy!.ageGroup.name,
        targetGroup: this.toy!.targetGroup,
        productionDate: this.toy!.productionDate,
        price: this.toy!.price,
        status: 'rezervisano',
        rating: 0
      });

      if (result) {
        successCount++;
      }
    }

    if (successCount > 0) {
      if (successCount === qty) {
        this.utils.showSnackBar(`${qty}x "${this.toy!.name}" uspešno dodato u korpu`, 'success', this.snackBar);
      } else {
        this.utils.showSnackBar(`${successCount} od ${qty} uspešno dodato u korpu`, 'success', this.snackBar);
      }
      // Reset quantity to 1 after successful add
      this.selectedQuantity = 1;
    } else {
      this.utils.showSnackBar('Morate biti ulogovani kako biste rezervisali igračku', 'error', this.snackBar);
    }
  }
}
