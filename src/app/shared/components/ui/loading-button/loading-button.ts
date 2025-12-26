import { Component, input, output, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'tots-loading-button',
  imports: [ProgressSpinnerModule],
  templateUrl: './loading-button.html',
  styleUrl: './loading-button.scss',
})
export class LoadingButton {
  label = input('Submit');
  loadingLabel = input('Loading...');
  isLoading = input(false);
  disabled = input(false);
  type = input<'button' | 'submit'>('submit');

  btnClick = output<void>();
}
