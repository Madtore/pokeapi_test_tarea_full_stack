import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PokemonDetailService } from '../../services/pokemon-details.service';
import { PokemonEvolution } from '../../models/pokemon.model';


@Component({
  selector: 'app-evolution-chain',
  standalone: true,
  imports: [CommonModule, CarouselModule, CardModule, ButtonModule],
  templateUrl: './evolution-chain.component.html',
  styleUrl: './evolution-chain.component.scss'
})
export class EvolutionChainComponent implements OnChanges {
  @Input() evolutionChainId: number | null = null;
  @Input() currentPokemonId: number | null = null;
  
  evolutions: PokemonEvolution[] = [];
  currentIndex = 0;
  
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  
  constructor(
    private pokemonDetailService: PokemonDetailService,
  ) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['evolutionChainId'] || changes['currentPokemonId']) && 
         this.evolutionChainId) {
      this.loadEvolutions();
    }
  }
  
  loadEvolutions() {
    if (this.evolutionChainId) {
      this.pokemonDetailService.getEvolutionChain(this.evolutionChainId)
        .subscribe({
          next: (data) => {
            this.evolutions = data;
            this.setCurrentIndex();

          },
          error: () => {
          }
        });
    }
  }
  
  setCurrentIndex() {
    if (this.currentPokemonId && this.evolutions.length > 0) {
      const index = this.evolutions.findIndex(e => e.id === this.currentPokemonId);
      if (index !== -1) {
        this.currentIndex = index;
      }
    }
  }
  
  getEvolutionStatus(index: number): string {
    if (this.currentPokemonId === this.evolutions[index].id) {
      return 'current';
    } else if (index < this.currentIndex) {
      return 'pre';
    } else {
      return 'post';
    }
  }
}