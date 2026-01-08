import { Component, inject, input, output, signal, effect, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

import { Space } from '../space-types';
import { SPACE_TYPES } from '@core/models/space-description-model';

@Component({
  selector: 'tots-space-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    Textarea,
    InputNumber,
    Select,
  ],
  templateUrl: './space-form-dialog.html',
  styleUrl: './space-form-dialog.scss',
})
export class SpaceFormDialog {
  private fb = inject(FormBuilder);

  visible = input<boolean>(false);
  space = input<Space | null>(null);
  mode = input<'add' | 'edit'>('add');

  onClose = output<void>();
  onSave = output<Partial<Space>>();

  isSubmitting = signal(false);
  spaceTypes = SPACE_TYPES;

  spaceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    pricePerHour: [null as number | null, [Validators.required, Validators.min(0)]],
    capacity: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    effect(() => {
      const currentSpace = this.space();
      const currentMode = this.mode();

      untracked(() => {
        if (currentSpace && currentMode === 'edit') {
          this.spaceForm.patchValue({
            name: currentSpace.name,
            type: currentSpace.type,
            description: currentSpace.description,
            pricePerHour: currentSpace.pricePerHour,
            capacity: currentSpace.capacity,
          });
        } else if (!currentSpace && currentMode === 'add') {
          this.spaceForm.reset();
        }
      });
    });
  }

  get dialogTitle(): string {
    return this.mode() === 'add' ? 'Add New Space' : 'Edit Space';
  }

  get submitButtonLabel(): string {
    return this.mode() === 'add' ? 'Create Space' : 'Update Space';
  }

  handleClose() {
    this.spaceForm.reset();
    this.onClose.emit();
  }

  handleSubmit() {
    if (this.spaceForm.invalid) {
      this.spaceForm.markAllAsTouched();
      return;
    }

    const formValue = this.spaceForm.getRawValue();
    const spaceData: Partial<Space> = {
      name: formValue.name!,
      type: formValue.type!,
      description: formValue.description!,
      pricePerHour: formValue.pricePerHour!,
      capacity: formValue.capacity!,
    };

    if (this.mode() === 'edit' && this.space()) {
      spaceData.id = this.space()!.id;
    }

    this.onSave.emit(spaceData);
  }

  getErrorMessage(fieldName: string): string | null {
    const control = this.spaceForm.get(fieldName);
    if (!control?.invalid || !control?.touched) return null;

    if (control.errors?.['required']) return `${fieldName} is required`;
    if (control.errors?.['minlength'])
      return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors?.['min'])
      return `${fieldName} must be at least ${control.errors['min'].min}`;

    return 'Invalid value';
  }
}
