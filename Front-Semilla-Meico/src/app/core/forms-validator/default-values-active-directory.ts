import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isNotEqual(param: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value ? control.value.trim().toLowerCase() : '';
    return !valor || valor === param ? { isNotEqual: true } : null;
  };
}
