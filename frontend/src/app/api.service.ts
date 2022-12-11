import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAll(search_address = '') {
    return this.http.get(`http://localhost:8055/v1/transactions/list-transactions?search_address=${search_address}`);
  }
}
