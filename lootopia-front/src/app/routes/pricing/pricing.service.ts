import { inject, Injectable } from '@angular/core';
import { PaymentMethodesInterface } from './payment-methodes/payment-methodes.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { PayIntentRespInterface } from './pay-intent-resp.interface';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private http = inject(HttpClient);
  private backend = new environment();

  // constructor() {}

  private paymentMethods: PaymentMethodesInterface[] = [
    {
      logo: 'https://www.prestasoo.com/images/logo-cb.jpg',
      name: 'Carte Bancaire',
      flag: 'https://cdn.freebiesupply.com/logos/large/2x/united-states-of-america-logo-png-transparent.png',
      keyword: 'card',
    },
    {
      logo: 'https://companieslogo.com/img/orig/PYPL-3570673e.png?t=1720244493',
      name: 'PayPal',
      flag: 'https://cdn.freebiesupply.com/logos/large/2x/united-states-of-america-logo-png-transparent.png',
      keyword: 'paypal',
    },
    {
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwNflG1aiinrvf27uFevZrJqMEijybml_mOg&s',
      name: 'Klarna',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/1200px-Flag_of_Sweden.svg.png',
      keyword: 'klarna',
    },
    {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bancontact_logo.svg/2560px-Bancontact_logo.svg.png',
      name: 'Bancontact',
      flag: 'https://img.freepik.com/vecteurs-libre/illustration-du-drapeau-belge_53876-27112.jpg?semt=ais_hybrid&w=740',
      keyword: 'bancontact',
    },
    {
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDk7dwd0KjNUq5hMPwbzxd5eQf-zMcPJnE8A&s',
      name: 'Giropay',
      flag: 'https://img.freepik.com/vecteurs-libre/illustration-du-drapeau-allemand_53876-27101.jpg?semt=ais_hybrid&w=740',
      keyword: 'giropay',
    },
    {
      logo: 'https://pngate.com/wp-content/uploads/2025/05/Ideal-logo-symbol-payment-method-1.png',
      name: 'iDEAL',
      flag: 'https://www.drapeauxdespays.fr/data/flags/w1600/nl.png',
      keyword: 'ideal',
    },
    {
      logo: 'https://logowik.com/content/uploads/images/sepa1593.jpg',
      name: 'SEPA Debit',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/2560px-Flag_of_Europe.svg.png',
      keyword: 'sepa_debit',
    },
  ];

  getPaymentMethods(): PaymentMethodesInterface[] {
    return this.paymentMethods;
  }

  createPaymentIntent(
    amount: number,
    paymentMethod?: string
  ): Observable<PayIntentRespInterface> {
    return this.http.post<PayIntentRespInterface>(
      this.backend.apiUrl + '/stripe/create-payment-intent',
      {
        amount,
        paymentMethod,
      }
    );
  }

  createCheckoutSession(
    items: { price: string; quantity: number }[],
    paymentMethod?: string
  ): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      this.backend.apiUrl + '/stripe/create-checkout-session',
      {
        items,
        paymentMethod,
      }
    );
  }
}
