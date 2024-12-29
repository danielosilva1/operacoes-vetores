var larguraCanvas = window.innerWidth * 0.7;
var alturaCanvas = window.innerHeight * 0.78;
/// Guardam a posição do mouse no plano cartesiano
var mouseXC, mouseYC = 0;
// Círculos das extremidades dos vetores
var circuloU, circuloV;
// Armazena objeto que está sendo movimentado
var objetoMovendo;
// Escalar que multiplica vetor
var escalar;

function setup() {
  createCanvas(larguraCanvas, alturaCanvas);
  escalar = 1.5;
  circuloU = new Circulo(new Ponto([25, 100]), 5);
  circuloV = new Circulo(new Ponto([100, 25]), 5);
  movendo = null;
}

class Ponto {
  constructor(coord) {
    this.setCoordenadas(coord);
  }

  // Seta a lista de coordenadas
  setCoordenadas(coord) {
    this.coord = coord;
  }

  // Seta a i-ésima coordenada
  setCoordenada(i, valor) {
    this.coord[i] = valor;
  }

  // Retorna lista de coordenadas
  getCoordenadas() {
    return this.coord;
  }

  // Retorna i-ésima coordenada
  getCoordenada(i) {
    return this.coord[i];
  }

  // Dados dois pontos A e B, retorna o vetor de deslocamento AB
  static vetorDeslocamento(A, B) {
    let ab = new Vetor(B.coord);
    for (let i = 0; i < ab.getDimensao(); i++) {
      ab.setElemento(i, B.getCoordenada(i) - A.getCoordenada(i));
    }
    return ab;
  }
}

class Circulo {
  constructor(centro, raio) {
    this.setCentro(centro);
    this.setRaio(raio);
  }

  setCentro(C) {
    this.centro = C;
  }

  setRaio(r) {
    this.raio = r;
  }

  getCentro() {
    return this.centro;
  }

  getRaio() {
    return this.raio;
  }

  // Retorna a i-ésima coordenada do ponto central do círculo
  getCoordenada(i) {
    return this.getCentro().getCoordenada(i);
  }

  // Dado um ponto A, retorna objeto se A intersecta o círculo ou false, caso contrário
  temIntersecao(A) {
    // Vetor ca (que vai do centro do círculo C até o ponto A)
    let ca = Ponto.vetorDeslocamento(this.getCentro(), A);
    let tamCa = ca.getTamanho();

    if (tamCa <= this.getRaio()) {
      return this;
    }
    return null;
  }

  desenhar() {
    circle(this.getCoordenada(0), this.getCoordenada(1), this.getRaio());
  }
}

class Vetor {
  constructor(coord = []) {
    this.coord = [];
    for (let i = 0; i < coord.length; i++) {
      this.coord.push(coord[i]);
    }
  }

  // Seta i-ésimo elemento
  setElemento(i, valor) {
    if (i >= 0 && i < this.getDimensao()) {
      this.coord[i] = valor;
    } else {
      console.log("Erro: índice inválido");
    }
  }

  // Retorna número de coordenadas do vetor
  getDimensao() {
    return this.coord.length;
  }

  // Retorna i-ésimo elemento
  getElemento(i) {
    if (i >= 0 && i < this.getDimensao()) {
      return this.coord[i];
    }
    console.log("Erro: índice inválido");
  }

  // Calcula e retorna o tamanho do vetor
  getTamanho() {
    let tam = 0;
    for (let i = 0; i < this.getDimensao(); i++) {
      tam += this.getElemento(i) * this.getElemento(i);
    }
    return Math.sqrt(tam);
  }

  // Soma o vetor v informado do vetor instanciado e retorna vetor resultante
  somar(v) {
    if (this.getDimensao() != v.getDimensao()) {
      console.log("Erro na soma: vetores têm dimensões diferentes");
      return;
    }
    let vetorResultado = new Vetor(this.coord);
    for (let i = 0; i < this.getDimensao(); i++) {
      vetorResultado.setElemento(i, this.getElemento(i) + v.getElemento(i));
    }
    return vetorResultado;
  }

  // Subtrai o vetor v informado do vetor instanciado e retorna vetor resultante
  subtrair(v) {
    if (this.getDimensao() != v.getDimensao()) {
      console.log("Erro na subtração: vetores têm dimensões diferentes");
      return;
    }
    let vetorResultado = new Vetor(this.coord);
    for (let i = 0; i < this.getDimensao(); i++) {
      vetorResultado.setElemento(i, this.getElemento(i) - v.getElemento(i));
    }
    return vetorResultado;
  }

  // Retorna vetor resultante da multiplicação do vetor instanciado por um escalar x informado
  multiplicarEscalar(x) {
    let vetorResultado = new Vetor(this.coord);
    for (let i = 0; i < this.getDimensao(); i++) {
      vetorResultado.setElemento(i, vetorResultado.getElemento(i) * x);
    }
    return vetorResultado;
  }

  // Calcula e retorna o vetor inverso ao vetor instanciado
  inverter() {
    return this.multiplicarEscalar(-1);
  }

  // Calcula e retorna o produto escalar entre o vetor instanciado e o vetor v informado
  produtoEscalar(v) {
    if (this.getDimensao() != v.getDimensao()) {
      console.log("Erro no produto escalar: vetores têm dimensões diferentes");
      return;
    }
    let resultado = 0;
    for (let i = 0; i < this.getDimensao(); i++) {
      resultado += this.getElemento(i) * v.getElemento(i);
    }
    return resultado;
  }

  // Calcula o produto vetorial no espaço 2d entre vetor instanciado e vetor v informado
  produtoVetorial2D(v) {
    if (this.getDimensao() != v.getDimensao() || this.getDimensao() != 2) {
      console.log(
        "Erro: vetores não têm 2 dimensões ou têm dimensões diferentes"
      );
      return;
    }
    let uxv = new Vetor([0, 0, 0]);
    // uxv[2] = u[0] * v[1] - u[1] * v[0];
    uxv.setElemento(
      2,
      this.getElemento(0) * v.getElemento(1) -
      this.getElemento(1) * v.getElemento(0)
    );
    return uxv;
  }

  // Calcula o produto vetorial no espaço 3d entre vetor instanciado e vetor v informado
  produtoVetorial3D(v) {
    if (this.getDimensao() != v.getDimensao() || this.getDimensao() != 3) {
      console.log(
        "Erro: vetores não têm 3 dimensões ou têm dimensões diferentes"
      );
      return;
    }
    let uxv = new Vetor([-1, -1, -1]);
    // uxv[0] = u[1] * v[2] - u[2] * v[1];
    uxv.setElemento(
      0,
      this.getElemento(1) * v.getElemento(2) -
      this.getElemento(2) * v.getElemento(1)
    );
    // uxv[1] = u[2] * v[0] - u[0] * v[2];
    uxv.setElemento(
      1,
      this.getElemento(2) * v.getElemento(0) -
      this.getElemento(0) * v.getElemento(2)
    );
    // uxv[2] = u[0] * v[1] - u[1] * v[0];
    uxv.setElemento(
      2,
      this.getElemento(0) * v.getElemento(1) -
      this.getElemento(1) * v.getElemento(0)
    );

    return uxv;
  }

  // Calcula e retorna o vetor unitário
  vetorUnitario() {
    let unitario = new Vetor(this.coord);
    let tam = this.getTamanho();

    for (let i = 0; i < this.getDimensao(); i++) {
      unitario.setElemento(i, unitario.getElemento(i) / tam);
    }
    return unitario;
  }

  // Mostra no console as coordenadas do vetor instanciado
  printar(nome = "") {
    let vetorStr = "[";
    for (let i = 0; i < this.getDimensao(); i++) {
      vetorStr += this.coord[i];
      if (i != this.getDimensao() - 1) {
        vetorStr += ", ";
      }
    }
    vetorStr += "]";
    console.log(`${nome == "" ? "" : nome + " "}${vetorStr}`);
  }

  // Desenha vetor instanciado a partir da origem
  desenharOrigem(rotulo = "", r = 0, g = 0, b = 0, a = 255) {
    if (r != 0 || g != 0 || b != 0) {
      colore(r, g, b, a);
    }
    seta(0, 0, this.getElemento(0), this.getElemento(1));
    texto(
      `${rotulo}\n(${this.getElemento(0).toFixed(1)}, ${this.getElemento(
        1
      ).toFixed(1)})`,
      this.getElemento(0) + 5,
      this.getElemento(1) + 5
    );
  }
}

function draw() {
  // desenha o fundo e configura o sistema cartesiano, simplificando o
  // processo de desenho das formas na tela
  goCartesian();

  let u = Ponto.vetorDeslocamento(new Ponto([0, 0]), circuloU.getCentro());
  let v = Ponto.vetorDeslocamento(new Ponto([0, 0]), circuloV.getCentro());

  // Desenha círculos nas extremidades dos vetores
  colore(0, 255, 0);
  circuloU.desenhar();
  colore(0, 0, 255);
  circuloV.desenhar();

  // Desenha vetores u e v
  u.desenharOrigem("u", 0, 255, 0);
  v.desenharOrigem("v", 0, 0, 255);

  if (mostrarSoma()) {
    // Desenha u + v
    u.somar(v).desenharOrigem("u + v", 255, 0, 0);
  }

  if (mostrarSubtracao()) {
    // Desenha u - v
    u.subtrair(v).desenharOrigem("u - v", 255, 222, 89);
  }

  if (mostrarInverso()) {
    // Desenha vetor inverso de u
    u.inverter().desenharOrigem("-u", 255, 0, 190);
  }

  if (mostrarMultiplicao()) {
    // Desenha multiplicação de v por escalar
    v.multiplicarEscalar(escalar).desenharOrigem(`${escalar} * v`, 0, 0, 255, 80);
  }
}

function mouseClicked() {
  if (objetoMovendo) {
    // Objeto já estava sendo movimentado: encerra movimentação
    objetoMovendo = null;
    return;
  }

  let pontoClique = new Ponto([mouseXC, mouseYC]);
  objetoMovendo = circuloU.temIntersecao(pontoClique);

  if (!objetoMovendo) {
    // Vetor u não está sendo movimentado, verifica vetor v
    objetoMovendo = circuloV.temIntersecao(pontoClique);
  }
}

function mouseMoved() {
  if (objetoMovendo) {
    // Algum círculo foi clicado: atualiza centro do círculo clicado para as coordenadas do mouse
    objetoMovendo.getCentro().setCoordenadas([mouseXC, mouseYC]);
  }
}

/* Desenha o plano de fundo da cena. Sobrescreva de acordo com suas necessidades.
 * Além disso, desenha um plano cartesiano centrado na origem, i.e., os 2 eixos.
 *
 * NOTA: A partir dessa chamada, toda a cena é desenhada de acordo com o sistema
 *       cartesiano, i.e., a origem está no centro da tela, o eixo Y cresce para
 *       cima e o eixo X para a direita. Isso foi projetado para simplificar os
 *       trabalhos.
 */
function goCartesian() {
  background(255);

  mouseXC = mouseX - width / 2;
  mouseYC = height / 2 - mouseY;

  colore(128, 0, 0);
  seta(0, height / 2, width, height / 2);
  colore(0, 128, 0);
  seta(width / 2, height, width / 2, 0);

  translate(width / 2, height / 2);
  scale(1, -1, 1);
}

/// Atualiza as variáveis globais com as coordenadas do mouse no plano cartesiano
function grabMouse() {
  mouseXC = mouseX - width / 2;
  mouseYC = height / 2 - mouseY;
}

/** Renderiza texto corretamente no plano cartesiano
 *  @param str Texto a ser escrito
 *  @param x Posição horizontal do canto inferior esquerdo texto
 *  @param y Posição vertical do canto inferior esquerdo texto
 */
function texto(str, x, y) {
  push();
  translate(x, y);
  scale(1, -1);
  translate(-x, -y);

  // desenha o texto normalmente
  text(str, x, y);
  pop();
}

/* Define as cores de preenchimento e de contorno com o mesmo valor.
 * Há várias opções de trabalho em RGB nesse caso:
 *  - caso c1,c2,c3 e c4 sejam passados, o efeito padrão é uma cor RGBA
 *  - caso c1,c2 e c3 sejam passados, tem-se uma cor RGB.
 *  - caso c1 e c2 sejam passados, c1 é um tom de cinza e c2 é opacidade.
 *  - caso apenas c1 seja passado, c1 é um tom de cinza.
 */
function colore(c1, c2, c3, c4) {
  if (c4 != null) {
    fill(c1, c2, c3, c4);
    stroke(c1, c2, c3, c4);
    return;
  }
  if (c3 != null) {
    fill(c1, c2, c3);
    stroke(c1, c2, c3);
    return;
  }

  if (c2 == null) {
    fill(c1);
    stroke(c1);
  } else {
    fill(c1, c1, c1, c2);
    stroke(c1, c1, c1, c2);
  }
}

/* Desenha um segmento de reta com seta do ponto (x1,y1) para (x2,y2)
 */
function seta(x1, y1, x2, y2) {
  // o segmento de reta
  line(x1, y1, x2, y2);
  var dx = x2 - x1,
    dy = y2 - y1;
  var le = sqrt(dx * dx + dy * dy); // comprimento do vetor
  // o vetor v é unitário paralelo ao segmento, com mesmo sentido
  var vx = dx / le,
    vy = dy / le;
  // o vetor u é unitário e perpendicular ao segmento
  var ux = -vy;
  var uy = vx;
  // a cabeça triangular
  triangle(
    x2,
    y2,
    x2 - 5 * vx + 2 * ux,
    y2 - 5 * vy + 2 * uy,
    x2 - 5 * vx - 2 * ux,
    y2 - 5 * vy - 2 * uy
  );
}

function mostrarSoma() {
  return document.getElementById("mostrarSoma").checked;
}

function mostrarSubtracao() {
  return document.getElementById("mostrarSubtracao").checked;
}

function mostrarMultiplicao() {
  return document.getElementById("mostrarMultiplicacao").checked;
}

function mostrarInverso() {
  return document.getElementById("mostrarInverso").checked;
}

function ajustarCanvas() {
  larguraCanvas = window.innerWidth * 0.7;
  alturaCanvas = window.innerHeight * 0.78;
  resizeCanvas(larguraCanvas, alturaCanvas);
}

// Ajusta dimensão do canvas ao redimensionar página
function windowResized() {
  ajustarCanvas();
}

// Valida o escalar recebido do usuário
function floatValido(valor) {
  let valorFloat = parseFloat(valor);
  return {conversaoValida: !isNaN(valorFloat) && isFinite(valorFloat), valorConvertido: valorFloat};
}

// Ajusta escalar que multiplica o vetor v se escalar informada for válida
function ajustarEscalar() {
  let escalar_ = document.getElementById("input-escalar").value;
  escalar_ = escalar_.replace(",", ".");

  let {conversaoValida, valorConvertido} = floatValido(escalar_);

  if (conversaoValida) {
    escalar = valorConvertido;
  }
}

// Adiciona evento que atualiza a escalar que multiplica vetor v ao alterar valor da caixa de texto
document.getElementById("input-escalar").addEventListener("input", ajustarEscalar);