import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class ShopSelectionService {
  private _selectedShopId: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  setSelectedShopId(shopId: number) {
    this._selectedShopId.next(shopId);
  }

  getSelectedShopId(): Observable<number | null> {
    return this._selectedShopId.asObservable();
  }
}
