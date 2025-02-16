import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Ability, Pokemon } from '../models/pokemon.model';
import { PokeapiService } from '../core/services/pokeapi.service';
import { PokemonOption, PokemonEvolution } from '../models/pokemon.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private pokeapiService: PokeapiService
  ) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private extractIdFromUrl(url: string): string {
    return url.split('/').filter(Boolean).pop()!;
  }

  getAllPokemons(): Observable<PokemonOption[]> {
    if (isPlatformBrowser(this.platformId)) {
      const dataPokemonOption = localStorage.getItem('dataPokemonOption');
      if (dataPokemonOption) {
        return of(JSON.parse(dataPokemonOption));
      }
    }
    
    return this.pokeapiService.getAllPokemons('1000').pipe(
      map((response: any) => {
        const pokemonList: PokemonOption[] = response.results.map((pokemon: any) => ({
          name: pokemon.name,
          url: pokemon.url,
          id: this.extractIdFromUrl(pokemon.url)
        }));
        localStorage.setItem('dataPokemonOption', JSON.stringify(pokemonList));
        return pokemonList;
      }),
      catchError(this.handleError('getAllPokemons', []))
    );
  }

  getPokemonDetails(pokemonId: string): Observable<Pokemon> {
    return this.httpClient.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).pipe(
      switchMap((pokemonData: any) => {
        return this.httpClient.get(pokemonData.species.url).pipe(
          switchMap((speciesData: any) => {
            const evolutionChainId = this.extractIdFromUrl(speciesData.evolution_chain.url);
            const abilityRequests = pokemonData.abilities.map((ability: any) => {
              const abilityId = this.extractIdFromUrl(ability.ability.url);
              return this.pokeapiService.getHability(abilityId).pipe(
                map(abilityData => {
                  const spanishDescription = abilityData.flavor_text_entries
                    .find((entry: any) => entry.language.name === 'es')?.flavor_text ||
                    abilityData.flavor_text_entries[0]?.flavor_text || 'Sin descripción';
                  return {
                    name: ability.ability.name,
                    description: spanishDescription,
                    isHidden: ability.is_hidden
                  };
                })
              );
            });

            return forkJoin({
              evolutionChain: this.pokeapiService.getEvolutionChain(evolutionChainId),
              abilities: forkJoin<Ability[]>(abilityRequests)
            }).pipe(
              map(results => {
                const pokemon: Pokemon = {
                  id: pokemonData.id,
                  name: pokemonData.name,
                  image: pokemonData.sprites.other['official-artwork'].front_default ||
                         pokemonData.sprites.front_default,
                  types: pokemonData.types.map((type: any) => type.type.name),
                  abilities: results.abilities,
                  evolutionChainId: parseInt(evolutionChainId),
                  weight: pokemonData.weight / 10,
                  height: pokemonData.height / 10,
                  stats: pokemonData.stats.map((stat: any) => ({
                    name: stat.stat.name,
                    base: stat.base_stat
                  }))
                };
                return pokemon;
              }),
              catchError(this.handleError('getPokemonDetails', {} as Pokemon))
            );
          })
        );
      }),
      catchError(this.handleError('getPokemonDetails', {} as Pokemon))
    );
  }

  getEvolutionChain(chainId: number): Observable<PokemonEvolution[]> {
    return this.pokeapiService.getEvolutionChain(chainId.toString()).pipe(
      map(data => {
        const evolutions: PokemonEvolution[] = [];
        const extractEvolutions = (chain: any) => {
          const id = this.extractIdFromUrl(chain.species.url);
          evolutions.push({
            id: parseInt(id),
            name: chain.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          });
          if (chain.evolves_to?.length) {
            chain.evolves_to.forEach((evolution: any) => extractEvolutions(evolution));
          }
        };
        extractEvolutions(data.chain);
        return evolutions;
      }),
      catchError(this.handleError('getEvolutionChain', []))
    );
  }
}