import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importer dine komponenter her
import { HomeComponent } from './home/home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { SalesItemListComponent } from './sales-item-list/sales-item-list.component';
import {SalesItemDetailComponent } from './sales-item-detail/sales-item-detail.component';
import { SalesItemEditComponent } from './sales-item-edit/sales-item-edit.component';
import { SalesItemCompositionListComponent } from './sales-item-composition-list/sales-item-composition-list.component';
import { SalesItemCompositionDetailComponent } from './sales-item-composition-detail/sales-item-composition-detail.component';

import { SalesItemCompositionEditComponent } from './sales-item-composition-edit/sales-item-composition-edit.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { CustomGroupListComponent } from './custom-group-list/custom-group-list.component';
import { CustomGroupEditComponent } from '../app/custom-group-edit/custom-group-edit.component';
import { DiscountListComponent } from './discount-list/discount-list.component';
import { DiscountEditComponent } from './discount-edit/discount-edit.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { BasketComponent } from './basket/basket.component';
import { AuthGuard } from './../app/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'order-list', component: OrderListComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent },
  { path: 'sales-item-list', component: SalesItemListComponent },
  { path: 'sales-item-detail/:id', component: SalesItemDetailComponent},
  { path: 'sales-item-edit/:id', component: SalesItemEditComponent, }, // Kan også være for oprettelse uden ID
  { path: 'sales-item-create', component: SalesItemEditComponent, },
  { path: 'sales-item-composition-list', component: SalesItemCompositionListComponent },
  { path: 'sales-item-composition-detail/:parentItemId', component: SalesItemCompositionDetailComponent },
  { path: 'sales-item-composition-edit/:id', component: SalesItemCompositionEditComponent },
  { path: 'sales-item-composition-create', component: SalesItemCompositionEditComponent },
  { path: 'shop-list', component: ShopListComponent },
  { path: 'shop-detail/:id', component: ShopDetailComponent },
  { path: 'shop-create', component: ShopListComponent },
  { path: 'custom-group-list', component: CustomGroupListComponent },
  { path: 'custom-group-edit/:id', component: CustomGroupEditComponent,  }, // Kan også være for oprettelse uden ID
  { path: 'custom-group-create', component: CustomGroupEditComponent, },
  { path: 'discount-list', component: DiscountListComponent },
  { path: 'discount-edit/:id', component: DiscountEditComponent, }, // Kan også være for oprettelse uden ID
  { path: 'discount-create', component: DiscountEditComponent, },
  { path: 'ingredient-list', component: IngredientListComponent },
  { path: 'ingredient-edit/:id', component: IngredientEditComponent }, // Kan også være for oprettelse uden ID
  { path: 'ingredient-create', component: IngredientEditComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-failure', component: PaymentFailureComponent },
  { path: 'basket', component: BasketComponent },
  // Tilføj yderligere ruter her
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
