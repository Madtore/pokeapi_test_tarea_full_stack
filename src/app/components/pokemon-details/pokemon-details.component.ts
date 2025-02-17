import { Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { EvolutionChainComponent } from '../evolution-chain/evolution-chain.component';
import { Pokemon } from '../../models/pokemon.model';




@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    TagModule,
    EvolutionChainComponent,
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})
export class PokemonDetailsComponent implements OnInit{
  @Input() pokemon: Pokemon | null = null;
  
  
  
  constructor() {}
  ngOnInit(): void {
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon']) {
      console.log('Pokemon changed:', changes['pokemon'].currentValue);  
    }
  }
  

  
  getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dark: '#705848',
      dragon: '#7038F8',
      steel: '#B8B8D0',
      fairy: '#F0B6BC',
      normal: '#A8A878'
    };
    
    return typeColors[type] || '#A8A878';
  }
  
  getStatName(statName: string): string {
    const statNames: Record<string, string> = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Esp.',
      'special-defense': 'Defensa Esp.',
      'speed': 'Velocidad'
    };
    
    return statNames[statName] || statName;
  }
}