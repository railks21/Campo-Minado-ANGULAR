import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private fireAuth: AngularFirestore,
    private router: Router,
  ) { }

  signInForm!: FormGroup;
  isSubmitted = false;

  ngOnInit(): void {
    this.login();
    this.signInForm = this.formBuilder.group({
      username: [null, Validators.required],
      senha: [null, Validators.required],
    });
  }
  
  get errorControl() {
    return this.signInForm.controls;
  };

  submitForm(): any {
    this.isSubmitted = true;
    if (!this.signInForm) {
      return false;
    } else {
      this.login();
    }
  }

  login() {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const senha = (document.getElementById("senha") as HTMLInputElement).value;
  
    // Obter todos os usuários na coleção 'Registo'
    this.fireAuth.collection('/Registo').snapshotChanges().subscribe((res: any) => {
      const users = res.map((user: any) => {
        return { id: user.payload.doc.id, ...user.payload.doc.data() };
      });
  
      // Verifica se o username e senha inseridos correspondem aos dados no Firestore
      const userFound = users.find((user: any) => user.username === username && user.senha === senha);
  
      if (userFound) {
        console.log('Login bem-sucedido:', userFound);
        this.router.navigate(['mine/jogo'])
      } else {
        console.log('Credenciais incorretas');
        // Exibir mensagem de erro ou realizar outra ação
      }
    });
  }

}
