import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";
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
import { FormsModule } from '@angular/forms'; // or ReactiveFormsModule
// ... add these to your @NgModule imports ...

@Component({
  selector: 'app-details',
  imports: [NgIf, LoadingComponent, MatCardModule, MatListModule, MatButtonModule, RouterLink, MatSnackBarModule,MatFormFieldModule,
    MatInputModule,FormsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  public toy: ToyModel | null = null
  public error: string | null = null
  isDescriptionExpanded: boolean = false;
  maxDescriptionLength: number = 800;
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

  const result = UserService.createReservation({
    id: new Date().getTime(),
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
    this.utils.showSnackBar(`Igračka uspešno dodata u korpu (${qty}x)`, 'success', this.snackBar);
  } else {
    this.utils.showSnackBar('Morate biti ulogovani kako biste rezervisali igračku', 'error', this.snackBar);
  }
}

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  getTruncatedDescription(): string {
    if (!this.toy || !this.toy.description) {
      return '';
    }

    if (this.isDescriptionExpanded || this.toy.description.length <= this.maxDescriptionLength) {
      return this.toy.description;
    } else {
      return this.toy.description.substring(0, this.maxDescriptionLength) + '...';
    }
  }

  shouldShowMoreButton(): boolean {
    return Boolean(this.toy?.description &&
      this.toy.description.length > this.maxDescriptionLength);
  }

  
}
