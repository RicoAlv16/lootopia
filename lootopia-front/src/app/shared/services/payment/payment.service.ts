import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private stripePromise = loadStripe('votre_clé_publique_stripe');

  constructor(private http: HttpClient) {}

  async processPayment(amount: number) {
    try {
      // Obtenir le client secret du backend
      const { clientSecret } = await this.http
        .post<{
          clientSecret: string;
        }>('/api/stripe/create-payment-intent', { amount })
        .toPromise();

      const stripe = await this.stripePromise;
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: 'Nom du client',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (err) {
      console.error('Erreur de paiement:', err);
      throw err;
    }
  }

  async redirectToCheckout(items: Array<{ price: string; quantity: number }>) {
    try {
      const { url } = await this.http
        .post<{ url: string }>('/api/stripe/create-checkout-session', { items })
        .toPromise();

      window.location.href = url;
    } catch (err) {
      console.error('Erreur lors de la redirection vers Checkout:', err);
      throw err;
    }
  }
}
