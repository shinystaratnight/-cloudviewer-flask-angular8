import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, FormControl } from '@angular/forms';

@Directive({
  selector:  '[appPhoneValidator]',
  providers: [{provide: NG_VALIDATORS, useValue: PhoneValidatorDirective, multi: true}]
})
export class PhoneValidatorDirective implements Validator{
  
  constructor() { }

  validate(c: FormControl): ValidationErrors | null {
    // Here we call our static validator function 
    return PhoneValidatorDirective.validatePhone(c);
  }

  static validatePhone(control: FormControl): ValidationErrors {
    // Here goes the validation code mentioned earlier
    
    
    return null;
  }

}
