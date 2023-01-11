import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss']
})
export class JogoComponent implements OnInit {


  width:number = 0;
  tamanho: number = 0;
  minas: number = 0;
  numeroBandeiras: number = 0;

  tempo: any;
  minutos: number = 0;
  segundos: number = 0;

  carinha:boolean = true;
  ganhou:boolean = false;

  arrayPosicaoZeros:number[][] = [];

  botoes: string[][] = [];
  minasPosicao: any = [];

  dificuldades = [
    { nome: 'Fácil', mina: 0.5 },
    { nome: 'Médio', mina: 1 },
    { nome: 'Difícil', mina: 1.5 }
  ];

  dimensoes = [
    { nome: 'Pequeno', tamanho: 7 },
    { nome: 'Normal', tamanho: 10 },
    { nome: 'Grande', tamanho: 15 }
  ]

  // os select ja vao estar pre-selecionados
  form = new FormGroup({
    dificuldade: new FormControl(this.dificuldades[1]),
    dimensao: new FormControl(this.dimensoes[1])
  });

  AROUND_CELL_OPERATORS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  

  constructor() { }

  ngOnInit(): void {

    this.width = this.form.value.dimensao.tamanho*30;

    //ao reiniciar o jogo colocar todo a zero
    this.botoes = [];
    this.minasPosicao = [];

    // botao de reset coloca o smile feliz
    this.carinha = true;
    this.ganhou = false;

    //vai parar o tempo e colocar o tempo a 0
    clearTimeout(this.tempo);
    this.segundos = 0;
    this.minutos = 0;

    //gerar o campo, minas e os números a volta das minas
    this.gerarCampo();
    this.gerarPosicaoMinas();
    this.inserirMinas();
    this.inserirNumeros();

   
  }

  gerarCampo() {
    // recebe o tamanho do campo
    this.tamanho = this.form.value.dimensao.tamanho;

    for (let i = 0; i < this.tamanho; i++) {
      this.botoes.push([]);
      for (let j = 0; j < this.tamanho; j++) {

        this.botoes[i][j] = "0";

      }

    }
  }

  gerarPosicaoMinas() {
    //vai calculcar o nº de minas conforme o tamnho do campo e a dificuldade
    this.minas = Math.round(this.form.value.dimensao.tamanho * this.form.value.dificuldade.mina);
    this.numeroBandeiras = this.minas;

    while (this.minasPosicao.length < this.minas) {
      let y = this.getRandomInt(0, this.tamanho);
      let x = this.getRandomInt(0, this.tamanho);

      if (!this.testaMina([y, x])) {
        this.minasPosicao.push([y, x]);
      }
    }
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  testaMina(umaMinaPosicao: any) {
    return this.minasPosicao.join(" ").includes(umaMinaPosicao.toString());
  }

  inserirMinas() {
    for (let i = 0; i < this.minasPosicao.length; i++) {
      let y = this.minasPosicao[i][0];
      let x = this.minasPosicao[i][1];
      this.botoes[y][x] = " ";      
    }
  }

  inserirNumeros() {
    for (let i = 0; i < this.minasPosicao.length; i++) {
      for (let j = 0; j < this.AROUND_CELL_OPERATORS.length; j++) {
        let umaMinaPosicao = this.minasPosicao[i];
        let around = this.AROUND_CELL_OPERATORS[j];
        let campoY = umaMinaPosicao[0] + around[0];
        let campoX = umaMinaPosicao[1] + around[1];

        if (campoY >= 0 && campoY < this.tamanho &&
          campoX >= 0 && campoX < this.tamanho &&
          this.botoes[campoY][campoX] != " ") {

          this.botoes[campoY][campoX] = String(Number(this.botoes[campoY][campoX]) + 1);

        }

      }
    }
  }

  tap(x: number, y: number) {
    //o tempo so começa quando começar o jogo
    if (this.minutos == 0 && this.segundos == 0) {
      this.timer();
      this.segundos = 1;
    }

    //console.log("coluna(x): "+x);
    //console.log("linha(y): "+y);

    let elementAlterar = y * this.form.value.dimensao.tamanho + x;

    let element = document.getElementsByClassName("botao")[elementAlterar];

    if (element.classList.contains("bandeira") == true) {
      return;
    } else if (this.botoes[y][x] == " ") {
      //console.log("mina");

      element.classList.add("noAfter");
      this.perder(x, y);
      //element.classList.add("mina");
    } else {
      //console.log("numero");

      element.classList.add("noAfter");

      if (this.botoes[y][x] == "0") {
        //this.limparZeros(x, y, this.voltaTestarSeZero);
        this.limparZeros(x, y);
      }
      

      this.ganhar();
    }
  }

  colocaBandeira(x: number, y: number) {

    let elementAlterar = y * this.form.value.dimensao.tamanho + x;

    let element = document.getElementsByClassName("botao")[elementAlterar];

    //vai testar se tem bandeira
    //se tiver bandeira vai a remover
    //se nao tiver bandeira coloca bandeira
    if (element.classList.contains("noAfter") == true) {
      return false;
    } else if (element.classList.contains("bandeira") == true) {
      element.classList.remove("bandeira");
      this.numeroBandeiras += 1;
    }
    else {
      element.classList.add("bandeira");
      this.numeroBandeiras -= 1;
    }

    //nao abre o menu de opçoes ao clicar no mouse2
    return false;
  }

  perder(x: number, y: number) {
    // com este if so permite entrar aqui uma vez
    if (this.carinha == true) {
      let array = document.getElementsByClassName("botao");
      for (let i = 0; i < array.length; i++) {
        
        let element = document.getElementsByClassName("botao")[i];
        element.classList.add("noAfter");
        
      }

      let elementAlterar = y * this.form.value.dimensao.tamanho + x;
      document.getElementsByClassName("botao")[elementAlterar].setAttribute('style', 'background-color:red');

      clearTimeout(this.tempo);

      this.carinha = false;
    }
    

  }

  ganhar() {
    const teste:number = this.form.value.dimensao.tamanho ** 2 - this.minas;     

    if (teste == document.getElementsByClassName("noAfter").length) {
      //console.log("ganhou");
      clearTimeout(this.tempo);
      
      this.ganhou = true;
    }
  }

  timer() {
    this.tempo = setTimeout(() => {
      this.timer();
      this.segundos += 1;

      if (this.segundos == 60) {
        this.segundos = 0;
        this.minutos += 1;
      }
    }, 1000);
  }

  limparZeros(x:number, y:number) {

    this.arrayPosicaoZeros.push([x, y]);

    while (this.arrayPosicaoZeros.length >= 1) {
      
      for (let j = 0; j < this.AROUND_CELL_OPERATORS.length; j++) {
        let around = this.AROUND_CELL_OPERATORS[j];
        let campoY = this.arrayPosicaoZeros[0][1] + around[0];
        let campoX = this.arrayPosicaoZeros[0][0] + around[1];
  
        let elementAlterar = campoY * this.form.value.dimensao.tamanho + campoX;
  
        let element = document.getElementsByClassName("botao")[elementAlterar];

        if (campoY >= 0 && campoY < this.tamanho &&
          campoX >= 0 && campoX < this.tamanho &&
          typeof (this.botoes[campoY][campoX] == 'number')) {

            element.classList.add("noAfter");         

            if (this.botoes[campoY][campoX] == '0') {

              //element.classList.add("noAfter");
              
              //nao percebo o porque dele nao aplicar a classe 'noAfter' nos zeros
              //ele escreve-me os valores que devem ficar com a classe mas quando é zero nao o faz
              //ele limpa corretamente os zeros no ts, mas visual não 
              //console.log(elementAlterar);
              
              this.arrayPosicaoZeros.push([campoX, campoY]);
              this.botoes[campoY][campoX] = '00';

            }
            
        }        
  
      }

      this.arrayPosicaoZeros.shift();

    }

  }

}

