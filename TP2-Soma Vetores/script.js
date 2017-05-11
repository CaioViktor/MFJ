var vetores = [];
var tracando = false;
var ultimoX = -1;
var ultimoY = -1;

class Vector{
	constructor(xInicial,xFinal,yInicial,yFinal,nome){
		this.xInicial = xInicial;
		this.xFinal = xFinal;
		this.yInicial = yInicial;
		this.yFinal = yFinal;
		this.nome = nome;
		this.x = xFinal - xInicial;
		this.y = yFinal - yInicial;
	}

	draw(xInicial,yInicial,cor){
		console.log("chamou");
		var x = this.x + xInicial;
		var y = this.y + yInicial;
		var contexto = getContext();
		preparePoint(xInicial,yInicial);
		contexto.beginPath();
		contexto.moveTo(xInicial,yInicial);
		contexto.lineTo(x,y);

		//Ponto das flechas, não pensei em como fazer isso, pois achei frescura.
		//Esta parte me basei em http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
			var headlen = 10;   // length of head in pixels
			var angle = Math.atan2(this.y,this.x);
			contexto.moveTo(xInicial, yInicial);
		    contexto.lineTo(x, y);
		    contexto.lineTo(x-headlen*Math.cos(angle-Math.PI/6),y-headlen*Math.sin(angle-Math.PI/6));
		    contexto.moveTo(x, y);
		    contexto.lineTo(x-headlen*Math.cos(angle+Math.PI/6),y-headlen*Math.sin(angle+Math.PI/6));
		//FIM-Esta parte me basei em http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag



		contexto.font = "20px Arial";
		if(cor != "#ff0080")//Soma
			contexto.fillText(this.nome,x,y+10);
		else
			contexto.fillText(this.nome,x-10,y-10);
		contexto.strokeStyle = cor;
		contexto.stroke();
	}
	//javascript não overload,triste, eu não sabia
	drawFromInit(){
		this.draw(this.xInicial,this.yInicial,"#000000");
	}
	somar(vetor,nome){
		var x = this.x + vetor.x ;
		var y = this.y + vetor.y ;
		return new Vector(this.xInicial,this.xInicial+x,this.yInicial,this.yInicial+y,nome);
	}
}
//function markLine(contexto,)
function getContext(){
	var tela = document.getElementById("tela");
	var contexto = tela.getContext("2d");
	return contexto;
}
function preparePoint(x,y){
	var contexto = getContext();
	contexto.fillRect(x,y,4,4);
}

function drawPoint(x,y){	
	var contexto = getContext();
	contexto.beginPath();
	contexto.moveTo(x,y);
	contexto.fillRect(x,y,4,4);
	contexto.stroke();
}

function limparTela(){
	var tela = document.getElementById("tela");
	var contexto = tela.getContext("2d");
	contexto.clearRect(0, 0, tela.width, tela.height);
}

function somar(){
	if (vetores.length <= 0)
		return;
	limparTela();
	//console.log(vetores);
	var soma = null;
	for(var i in vetores){
		if(soma != null){
			soma = soma.somar(vetores[i],"soma");
		}else{
			soma = vetores[i];
		}
		//console.log(vetores[i]);
		vetores[i].drawFromInit();
	}
	soma.draw(soma.xInicial,soma.yInicial,"#ff0080");
}

function randomizar(){
	if (vetores.length <= 0)
		return;
	limparTela();

	var vetoresRandom = vetores.slice();
	var indiceMaximo = vetores.length - 1;
	for(indiceMaximo;indiceMaximo > 0 ; indiceMaximo--){
		var indice = Math.floor(Math.random()*indiceMaximo);
		var aux = vetoresRandom[indice];
		vetoresRandom[indice] = vetoresRandom[indiceMaximo];
		vetoresRandom[indiceMaximo] = aux;
	}
	var soma = null;
	var xInicial = vetores[0].xInicial;
	var yInicial = vetores[0].yInicial;
	for(var i in vetoresRandom){
		if(soma != null){
			soma = soma.somar(vetoresRandom[i],"soma");
		}else{
			soma = vetoresRandom[i];
		}
		vetoresRandom[i].draw(xInicial,yInicial,"#000000");
		xInicial += vetoresRandom[i].x;
		yInicial += vetoresRandom[i].y;
	}
	soma.draw(vetores[0].xInicial,vetores[0].yInicial,"#ff0080");
	
}

function initiate(){
	var tela = document.getElementById("tela");
	tela.addEventListener("mousedown",click,false);
}

function click(event){
	event.preventDefault();
	var tela = document.getElementById("tela");
	var rect = tela.getBoundingClientRect();
	var x = event.pageX - rect.left;
	var y = event.pageY - rect.top;
	if(tracando){
		var vector = new Vector(ultimoX,x,ultimoY,y,"vec"+vetores.length);
		vetores.push(vector);
		vector.drawFromInit();
	}else{
		drawPoint(x,y);
		tracando = true;
	}
	ultimoX = x;
	ultimoY = y;
		
}

function resetar(){
	vetores = [];
	tracando = false;
	ultimoX = -1;
	ultimoY = -1;
	limparTela();
}
