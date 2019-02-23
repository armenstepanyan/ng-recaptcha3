import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

import {NgRecaptcha3Service} from 'ng-recaptcha3';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  myForm: FormGroup;
  formData: any;
  private siteKey = '6LedAJEUAAAAAPttxeFNp6ZtAvKGI8D9gESE-hl3';

  constructor(private fb: FormBuilder,
              private recaptcha3: NgRecaptcha3Service) {

  }

  ngOnInit() {

    this.myForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });

    this.recaptcha3.init(this.siteKey);
  }

  isFieldInvalid(field: string) {
    return !this.myForm.get(field).valid && this.myForm.get(field).touched;
  }

  isFieldValid(field: string) {
    return this.myForm.get(field).valid && this.myForm.get(field).touched;
  }

  onSubmit() {
    this.validateAllFormFields(this.myForm);
    if (this.myForm.valid) {

      this.recaptcha3.getToken().then(token => {
        this.formData = this.myForm.value;
        this.formData.recaptchaToken = token;
        // Handle saving form data
        // this.myHttpService.login(this.formData).subscribe(response => {
        //
        // });
      });


    }

  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
