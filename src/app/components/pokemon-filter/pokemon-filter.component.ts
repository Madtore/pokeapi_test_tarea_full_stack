import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PokeapiService } from '../../core/services/pokeapi.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonOption } from '../../models/pokemon.model';
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


  constructor(private pokemonapiService: PokemonDetailService, private cdRef: ChangeDetectorRef) { }

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
    if (query) {
      this.filteredPokemon = this.allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredPokemon = [...this.allPokemon];
    }

  }

  onSelect(event: any) {
    const pokemon: PokemonOption = event.value;
    this.pokemonSelected.emit(pokemon);
  }

  onClear() {
    this.filteredPokemon = [...this.allPokemon];
    this.selectedPokemon = null;
  }
}
