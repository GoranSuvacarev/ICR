import { Component } from '@angular/core';
import { formatDate, NgFor, NgIf } from '@angular/common';
import { AxiosError } from 'axios';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatOption, MatSelect } from '@angular/material/select';
import { ToyModel } from '../../models/toy.model';
import { TypeModel } from '../../models/type.model';
import { ToyService } from '../../services/toy.service';
import { AgeGroupModel } from '../../models/ageGroup.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, MatButtonModule, MatCardModule, LoadingComponent, FormsModule, MatFormFieldModule, MatInputModule, MatSelect, MatOption, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public error: string | null = null;

  public toys: ToyModel[] | null = null;
  public filteredToys : ToyModel [] | null = null
  
  public types: TypeModel[] = []
  public typeNames : string[] = []

  public ageGroups: AgeGroupModel[] = []
  public ageGroupNames: string[] = []

  public targetGroupNames: string[] = ["svi", "dečak", "devojčica"]

  public ratings: number[] = [1, 2, 3, 4, 5]
  
  public userInput: string = ''
  public descInput: string = ''
  public selectedType = ''
  public selectedAgeGroup: string = ''
  public selectedTargetGroup: string = ''
  public dateFrom: Date | null = null
  public dateTo: Date | null = null
  public priceInput: string = ''
  public selectedRating: number = 0

  constructor(public utils: UtilsService, private router: Router) {
    ToyService.getToys()
      .then(rsp => {
        this.toys = rsp.data
        for (let toy of this.toys!) {
          toy.rating = utils.calculateRating(toy)
        }
        this.filteredToys = this.toys
      })
      .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);

    ToyService.getTypes()
      .then(rsp => {
        this.types = rsp.data;

        for (let type of this.types) {
          let name = type.name;
          this.typeNames.push(name);
        }
      })

      ToyService.getAgeGroups()
      .then(rsp => {
        this.ageGroups = rsp.data;

        for (let ageGroup of this.ageGroups) {
          let name = ageGroup.name;
          this.ageGroupNames.push(name);
        }

      })
  }

  goToDetails(permalink: string) {
    this.router.navigate(['/details', permalink]);
  }

  public doFilter() {
    if (this.toys == null) return

    this.filteredToys = this.toys!
      .filter(obj => {
        if (this.userInput == '') return true
        return obj.name.toLowerCase().includes(this.userInput.toLowerCase())
      })
      .filter(obj => {
        if (this.descInput == '') return true
        return obj.description.toLowerCase().includes(this.descInput.toLowerCase())
      })
      .filter(obj => {
        if(this.selectedType == '') return true
          if (obj.type.name == this.selectedType){
            return true
          }
        return false
      })
      .filter(obj => {
        if(this.selectedAgeGroup == '') return true
        if (obj.ageGroup.name == this.selectedAgeGroup){
          return true
        }
        return false
      })
      .filter(obj => {
        if(this.selectedTargetGroup == '') return true
        if (obj.targetGroup == this.selectedTargetGroup){
          return true
        }
        return false
      })
      .filter(obj => {
        const date = new Date(obj.productionDate)
        if (this.dateFrom && date < this.dateFrom) return false;
        if (this.dateTo && date > this.dateTo) return false;

        return true;
      })
      .filter(obj => {
        if(this.priceInput === '') return true
        if (obj.price <= Number(this.priceInput)){
          return true
        }
        return false
      })
      .filter(obj => {
        if(this.selectedRating == 0) return true
        if (obj.rating == this.selectedRating){
          return true
        }
        return false
      })
      
  }

  resetFilter(){
    this.userInput = ''
    this.descInput = ''
    this.selectedType = ''
    this.selectedAgeGroup = ''
    this.selectedTargetGroup = ''
    this.dateFrom = null
    this.dateTo = null
    this.priceInput = ''
    this.selectedRating = 0;
    this.filteredToys = this.toys
  }
}

