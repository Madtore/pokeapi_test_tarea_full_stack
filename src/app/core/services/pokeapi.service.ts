import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllPokemons(limit: string): Observable<any>{
    return this.httpClient.get(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`)
  }
  getEvolutionChain(id: string): Observable<any>{
    return this.httpClient.get(`https://pokeapi.co/api/v2/evolution-chain/${id}/`)
  }
  getHability(id: string): Observable<any>{
    return this.httpClient.get(`https://pokeapi.co/api/v2/ability/${id}`)
  }
}
