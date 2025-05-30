import { Component, inject, OnInit, signal } from '@angular/core';
import { PaymentMethodesInterface } from './payment-methodes/payment-methodes.interface';
import { PricingService } from './pricing.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { environment } from '../../../env/env.dev';

@Component({
  selector: 'app-pricing',
  imports: [ModalComponent],
  standalone: true,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
})
export class PricingComponent implements OnInit {
  private pricingService = inject(PricingService);
  public readonly paymentMethods_S = signal<PaymentMethodesInterface[]>([]);
  private env = new environment();

  ngOnInit() {
    this.getPaymentMethods();
  }

  visible = false;
  isPaymentMethode = false;
  whichPrice = '';
  showDialog(whichPrice: string) {
    this.visible = true;
    this.isPaymentMethode = true;
    this.whichPrice = whichPrice;
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this.paymentMethods_S.set(this.pricingService.getPaymentMethods());
  }

  montantA = 10;
  montantB = 20;
  paymentType = '';
  items: { price: string; quantity: number }[] = [];

  validatePayment(montant: number, keyword: string): void {
    if (keyword) {
      console.log('Payment a démarré', montant, keyword);

      // Créer d'abord le payment intent
      this.pricingService
        .createPaymentIntent(montant, keyword)
        .subscribe(paymentIntent => {
          console.log('Payment Intent created:', paymentIntent);

          // Prix de la deuxieme formule
          if (this.whichPrice === 'starter') {
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('crowsPaid', '100');
              } catch (error) {
                console.error('Erreur de stockage:', error);
              }
            }
            this.items = [
              {
                price: this.env.priceStarterId, // Utiliser l'ID du payment intent comme price ID
                quantity: 1,
              },
            ];
          }
          // Prix de la deuxieme formule
          if (this.whichPrice === 'advanced') {
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('crowsPaid', '250');
              } catch (error) {
                console.error('Erreur de stockage:', error);
              }
            }
            this.items = [
              {
                price: this.env.priceAdvancedId, // Utiliser l'ID du payment intent comme price ID
                quantity: 1,
              },
            ];
          }

          // Puis créer la session de checkout
          this.pricingService
            .createCheckoutSession(this.items, keyword)
            .subscribe(session => {
              console.log('Checkout Session:', session);
              // Rediriger vers l'URL de checkout si disponible
              if (session.url) {
                window.location.href = session.url;
              }
            });
        });
    } else {
      alert('Payment failed' + keyword);
    }
  }
}
