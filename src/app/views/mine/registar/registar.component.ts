import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-registar',
  templateUrl: './registar.component.html',
  styleUrls: ['./registar.component.scss']
})
export class RegistarComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private fireAuth: AngularFirestore,
  ) { }

  signUpForm!: FormGroup;
  isSubmitted = false;
  register: any;

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      pNome: [null, Validators.required],
      uNome: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      senha: [null, Validators.required],
      senhaConfirmar: [null, Validators.required],
      username: [null, Validators.required],
    });
  }
  
  get errorControl() {
    return this.signUpForm.controls;
  };

  submitForm(): any {
    this.isSubmitted = true;
    if (!this.signUpForm) {
      return false;
    } else {
      this.registar();
    }
  }

  registar() {
    const inputs = document.querySelectorAll("input");
    
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const pNome = (document.getElementById("pNome") as HTMLInputElement).value;
    const uNome = (document.getElementById("uNome") as HTMLInputElement).value;
    const senha = (document.getElementById("senha") as HTMLInputElement).value;
    const senhaConfirmar = (document.getElementById("senhaConfirmar") as HTMLInputElement).value;
    const username = (document.getElementById("username") as HTMLInputElement).value;
    
    inputs.forEach(element => {
      if ((element as HTMLInputElement).value != '') {
        this.register = {
          email: email,
          pNome: pNome,
          uNome: uNome,
          senha: senha,
          senhaConfirmar: senhaConfirmar,
          username: username,
        }
      }
    });

    return this.fireAuth.collection('/Registo').add(this.register);
  }

}
