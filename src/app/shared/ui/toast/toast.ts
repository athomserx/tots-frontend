import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

interface ToastProperties {
  title: string;
  text: string;
}

type ToastType = 'info' | 'warn' | 'danger' | 'success';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  private messageService = inject(MessageService);

  showInfo(title: string, text: string) {
    this.showToast({ title, text }, 'info');
  }

  showWarn(title: string, text: string) {
    this.showToast({ title, text }, 'warn');
  }

  showSuccess(title: string, text: string) {
    this.showToast({ title, text }, 'success');
  }

  showError(title: string, text: string) {
    this.showToast({ title, text }, 'danger');
  }

  private showToast(properties: ToastProperties, type: ToastType) {
    this.messageService.add({
      summary: properties.title,
      detail: properties.text,
      severity: type,
      key: 'br',
    });
  }
}
