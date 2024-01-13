import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CustomGroupListComponent } from './custom-group-list/custom-group-list.component';
import { CustomGroupEditComponent } from './custom-group-edit/custom-group-edit.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { DiscountEditComponent } from './discount-edit/discount-edit.component';
import { DiscountListComponent } from './discount-list/discount-list.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { ShopEditComponent } from './shop-edit/shop-edit.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';
import { SalesItemEditComponent } from './sales-item-edit/sales-item-edit.component';
import { SalesItemDetailComponent } from './sales-item-detail/sales-item-detail.component';
import { SalesItemListComponent } from './sales-item-list/sales-item-list.component';
import { SalesItemCompositionEditComponent } from './sales-item-composition-edit/sales-item-composition-edit.component';
import { SalesItemCompositionDetailComponent } from './sales-item-composition-detail/sales-item-composition-detail.component';
import { SalesItemCompositionListComponent } from './sales-item-composition-list/sales-item-composition-list.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { EnumToStringPipe } from './pipes/enum-to-string.pipe';
import { JwtInterceptor } from './jwt.interceptor';
import { BasketComponent } from './basket/basket.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CustomGroupListComponent,
    CustomGroupEditComponent,
    AdminLoginComponent,
    AdminComponent,
    DiscountEditComponent,
    DiscountListComponent,
    IngredientEditComponent,
    IngredientListComponent,
    ShopDetailComponent,
    ShopListComponent,
    ShopEditComponent,
    OrderDetailComponent,
    OrderListComponent,
    SalesItemEditComponent,
    SalesItemDetailComponent,
    SalesItemListComponent,
    SalesItemCompositionEditComponent,
    SalesItemCompositionDetailComponent,
    SalesItemCompositionListComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    LoadingIndicatorComponent,
    EnumToStringPipe,
    BasketComponent,
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    FormsModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
  

 
})
export class AppModule { }
