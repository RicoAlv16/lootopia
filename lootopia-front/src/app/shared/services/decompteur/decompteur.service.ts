import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DecompteurService {
  private countdownSubject = new BehaviorSubject<string>('00:00');
  public countdown$ = this.countdownSubject.asObservable();

  startCountdown(minutes: number) {
    let seconds = minutes * 60;

    interval(1000)
      .pipe(takeWhile(() => seconds >= 0))
      .subscribe(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        this.countdownSubject.next(
          `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );

        seconds--;
      });
  }

  resetCountdown() {
    this.countdownSubject.next('00:00');
  }
}
