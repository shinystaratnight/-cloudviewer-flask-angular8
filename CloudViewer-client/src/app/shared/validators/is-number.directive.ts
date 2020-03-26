import { Component, Directive, Input, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, Validators, ValidatorFn } from '@angular/forms';

@Directive({
  selector: 'IsNumber',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IsNumberDirective),
      multi: true
    }
  ]
})
export class IsNumberDirective implements Validator {
  private _validator: ValidatorFn;
  @Input() public set min(value: string) {
    this._validator = Validators.pattern('[0-9]+');
  }

  public validate(control: AbstractControl): { [key: string]: any } {
    return this._validator(control);
  }
}