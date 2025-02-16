import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PokeapiService } from '../../core/services/pokeapi.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon, PokemonOption } from '../../models/pokemon.model';
import { PokemonDetailService } from '../../services/pokemon-details.service';


@Component({
  selector: 'app-pokemon-filter',
  templateUrl: './pokemon-filter.component.html',
  styleUrls: ['./pokemon-filter.component.scss'],
  imports: [AutoCompleteModule, CommonModule, FormsModule],
  standalone: true,
  providers: [PokeapiService]
})
export class PokemonFilterComponent implements OnInit {
  @Output() pokemonSelected = new EventEmitter<PokemonOption>();
  
  allPokemon: PokemonOption[] = [];
  filteredPokemon: PokemonOption[] = [];
  selectedPokemon: PokemonOption | null = null;
  
  constructor(private pokemonapiService: PokemonDetailService) { }

  ngOnInit(): void {
    this.pokemonapiService.getAllPokemons()
    .subscribe((pokemons: PokemonOption[]) => {
      console.log(pokemons);
      this.allPokemon = pokemons
      this.filteredPokemon = [...pokemons];
    });
  }

  filterPokemon(event: any) {
    const query = event.query.toLowerCase();
    this.filteredPokemon = this.allPokemon.filter(
      pokemon => pokemon.name.toLowerCase().includes(query)
    );
  }

  onSelect(event: any) {
    const pokemon :PokemonOption = event.value;
    console.log(pokemon);
    this.pokemonSelected.emit(pokemon);
  }

  onClear() {
    this.selectedPokemon = null;
  }
}
