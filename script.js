var objects = [];
var tempPoints = [];
var hulls = [];


SIZE_POINT = 1;
//Point
class Point{
	constructor(x,y,canvas){
		this.x = x;
		this.y = y;
		this.canvas = canvas
	}
	draw(){
		var contexto = this.canvas.getContext("2d");
		contexto.beginPath();
		contexto.moveTo(this.x,this.y);
		contexto.fillRect(this.x,this.y,SIZE_POINT,SIZE_POINT);
		contexto.stroke();
	}
	translate(x,y){
		this.x+= x;
		this.y+= y;
	}
	toVector(){
		var m = new Matrix(2,1);
		m.setValue(0,0,this.x);
		m.setValue(1,0,this.y);
		return m;
	}
	distance(p2){
		var w = p2.x - this.x;
		var h = p2.y - this.y;
		return Math.sqrt((w*w) + (h * h));
	}
	dot(p2){
		return this.x * p2.x + this.y * p2.y;
	}
	norma(){
		return Math.sqrt(this.dot(this));
	}
	normalize(){
		var norma = this.norma();
		this.x /= norma;
		this.y /= norma;
	}
	diff(p2){
		return new Point(p2.x - this.x,p2.y - this.y);
	}
	orthogonal(){
		return new Point(this.y,-this.x);
	}
}

//-------------------------------------------------
//Bounding Volume- Não usei a estratégia de herança, pois vi que não trazia nenhuma vantagem

class AABB{
	constructor(points){
		this.points = points;
		

		this.Xmin = Number.MAX_VALUE;
		this.Ymin = Number.MAX_VALUE;
		this.Xmax = Number.MIN_VALUE;
		this.Ymax = Number.MIN_VALUE;


		for(var i in this.points){
			this.Xmin = Math.min(this.Xmin,points[i].x);
			this.Ymin = Math.min(this.Ymin,points[i].y);
			this.Xmax = Math.max(this.Xmax,points[i].x);
			this.Ymax = Math.max(this.Ymax,points[i].y);
		}
	}

	draw(){
		var contexto = getContext();
		contexto.beginPath();
		contexto.moveTo(this.Xmin,this.Ymin);
		contexto.lineTo(this.Xmin,this.Ymax+SIZE_POINT);//esquerda:baixo para cima, SIZE_POINT do tamanho do ponto
		contexto.lineTo(this.Xmax+SIZE_POINT,this.Ymax+SIZE_POINT);//baixo:esquerda para direita, SIZE_POINT do tamanho do ponto
		contexto.lineTo(this.Xmax+SIZE_POINT,this.Ymin);//direita:cima para baixo, SIZE_POINT do tamanho do ponto
		contexto.lineTo(this.Xmin,this.Ymin);
		contexto.stroke();
		for(var i in this.points)
			this.points[i].draw();
	}

	translate(x,y){
		this.Xmin += x;
		this.Ymin += y;
		this.Xmax += x;
		this.Ymax += y;

		for(var i in this.points){
			points[i].translate(x,y);
		}

		this.translate();
	}

	detectCollision(volume){
		if(volume instanceof AABB){
			return volume != this && !(this.Xmax < volume.Xmin || this.Ymax < volume.Ymin || this.Xmin > volume.Xmax || this.Ymin > volume.Ymax);
		}
		if(volume instanceof Sphere)
			return volume.detectCollision(this);
		return false;
	}
}



class OBB{
	constructor(points){
		this.points = points;
		// var cx = 0;
		// var cy = 0;

		// this.Xmin = Number.MAX_VALUE;
		// this.Ymin = Number.MAX_VALUE;
		// this.Xmax = Number.MIN_VALUE;
		// this.Ymax = Number.MIN_VALUE;

		// for(var i in points){
		// 	cx+=points[i].x;
		// 	cy+=points[i].y;
		// 	this.Xmin = Math.min(this.Xmin,points[i].x);
		// 	this.Ymin = Math.min(this.Ymin,points[i].y);
		// 	this.Xmax = Math.max(this.Xmax,points[i].x);
		// 	this.Ymax = Math.max(this.Ymax,points[i].y);
		// }
		// cx/=points.length;
		// cy/=points.length;
		// this.center = new Point(cx,cy,null);
		// var c = new Matrix(2,1);
		// c.setValue(0,0,cx);
		// c.setValue(1,0,cy);
		// this.covariance = new Matrix(2,2);
		// for(var i in points){
		// 	var m1 = points[i].toVector().sumMatrix(c.mul(-1));
		// 	var m2 = m1.transpose();
		// 	this.covariance = this.covariance.sumMatrix(m1.multMatrix(m2));
		// }

		// var ava = this.covariance.eigenvalues();
		// // console.log(ava);
		// var axisX = this.covariance.eigenvector(ava[0]);
		// var axisY = this.covariance.eigenvector(ava[1]);

		// this.axis = new Matrix(2,2);
		// this.axis.setValue(0,0,axisX.getValue(0,0));
		// this.axis.setValue(0,1,axisY.getValue(0,0));
		// this.axis.setValue(1,0,axisX.getValue(1,0));
		// this.axis.setValue(1,1,axisY.getValue(1,0));

		// var axisTrans = this.axis.transpose();
		// for(var i in points){
		// 	console.log("foi");
		// 	var p = axisTrans.multMatrix(points[i].toVector());
		// 	var np = new Point(p.getValue(0,0),p.getValue(1,0),points[i].canvas);
		// 	test.push(np);
		// }
		// var aabb = new AABB(test);
		// objects.push(aabb);
		// var ps = [];
		// ps.push(new Point(0, 3));
		// ps.push(new Point(2, 2));
		// ps.push(new Point(1, 1));
		// ps.push(new Point(2, 1));
		// ps.push(new Point(3, 0));
		// ps.push(new Point(0, 0));
		// ps.push(new Point(3, 3));

		// alert(orientation(points[0],points[1],points[2]));
		var hull = convexHull(this.points);
		hulls.push(hull);
		var bestArea = Number.MAX_VALUE;

		this.pointBottomLeft = null;
		this.pointBottomRight = null;
		this.pointTopLeft = null;
		this.pointTopRight = null;

		

	}

	draw(){
		// drawPolygon([this.pointBottomLeft,this.pointTopLeft,this.pointTopRight,this.pointBottomRight],"#000000");
		for(var i in this.points)
			this.points[i].draw();
	}

	translate(x,y){
		this.Xmin += x;
		this.Ymin += y;
		this.Xmax += x;
		this.Ymax += y;

		for(var i in this.points){
			points[i].translate(x,y);
		}

		this.translate();
	}

	detectCollision(volume){
		if(volume instanceof AABB){
			return volume != this && !(this.Xmax < volume.Xmin || this.Ymax < volume.Ymin || this.Xmin > volume.Xmax || this.Ymin > volume.Ymax);
		}
		return false;
	}
}



class Sphere{
	constructor(points){
		this.points = points;
		

		this.Xmin = Number.MAX_VALUE;
		this.Ymin = Number.MAX_VALUE;
		this.Xmax = Number.MIN_VALUE;
		this.Ymax = Number.MIN_VALUE;
		var distance = 0;

		for(var i in this.points){
			this.Xmin = Math.min(this.Xmin,points[i].x);
			this.Ymin = Math.min(this.Ymin,points[i].y);
			this.Xmax = Math.max(this.Xmax,points[i].x);
			this.Ymax = Math.max(this.Ymax,points[i].y);
			for(var j in this.points)
				distance = Math.max(distance,this.points[i].distance(this.points[j]));
		}

		this.centerX = this.Xmin + ((this.Xmax - this.Xmin) / 2);
		this.centerY = this.Ymin + ((this.Ymax - this.Ymin) / 2);
		this.radius = distance/2;
	}

	draw(){
		var contexto = getContext();
		contexto.beginPath();
		contexto.arc(this.centerX,this.centerY,this.radius+SIZE_POINT,0,2 * Math.PI);// Soma de SIZE_POINT pelo tamanho dos pontos
		contexto.stroke();
		for(var i in this.points)
			this.points[i].draw();
	}

	translate(x,y){
		this.Xmin += x;
		this.Ymin += y;
		this.Xmax += x;
		this.Ymax += y;

		for(var i in this.points){
			points[i].translate(x,y);
		}

		this.translate();
	}

	detectCollision(volume){
		if(volume instanceof AABB){

		    var dist = this.radius * this.radius;
		    if(this.centerX < volume.Xmin)
		    	dist -= Math.pow(this.centerX - volume.Xmin,2);
		    else if(this.centerX > volume.Xmax)
		    	dist -= Math.pow(this.centerX - volume.Xmax,2);

		    if(this.centerY < volume.Ymin)
		    	dist -= Math.pow(this.centerY - volume.Ymin,2);
		    else if(this.centerY > volume.Ymax)
		    	dist -= Math.pow(this.centerY - volume.Ymax,2);
		 
		    return dist > 0;


		}
		if(volume instanceof Sphere){
			var c1 = new Point(this.centerX,this.centerY,null);
			var c2 = new Point(volume.centerX,volume.centerY,null);
			var distance = c1.distance(c2);
			var maxRadius = this.radius+volume.radius;
			return volume != this && distance <= maxRadius;
		}
		return false;
	}
}



function getCanvas(){
	return document.getElementById("tela");
}
function getContext(){
	return getCanvas().getContext("2d");
}
function init(){
	var canvas = getCanvas();
	setTemps();
	canvas.addEventListener("mousedown",click,false);
}


function click(event){
	event.preventDefault();
	var canvas = getCanvas();
	var rect = canvas.getBoundingClientRect();
	var x = event.pageX - rect.left;
	var y = event.pageY - rect.top;
	var point = new Point(x,y,canvas);
	tempPoints.push(point);
	enableButtons();
	drawCanvas();
}

function limparTela(){
	var tela = getCanvas();
	var contexto = tela.getContext("2d");
	contexto.clearRect(0, 0, tela.width, tela.height);
}

function createAABB(){
	var aabb = new AABB(tempPoints);
	for(var i in objects)
		if(aabb.detectCollision(objects[i]))
			alert("colisão com "+i);
	objects.push(aabb);
	drawCanvas();
	setTemps();
}

function createOBB(){
	var obb = new OBB(tempPoints);
	for(var i in objects)
		if(obb.detectCollision(objects[i]))
			alert("colisão com "+i);
	objects.push(obb);
	drawCanvas();
	setTemps();
}
function createSphere(){
	var sphere = new Sphere(tempPoints);
	for(var i in objects)
		if(sphere.detectCollision(objects[i]))
			alert("colisão com "+i);
	objects.push(sphere);
	drawCanvas();
	setTemps();
}

function drawCanvas(){
	limparTela();
	for(var i in objects)
		objects[i].draw();
	for(var i in tempPoints)
		tempPoints[i].draw();
	for(var i in hulls)
		drawPolygon(hulls[i],"#ff22aa");
	
}

function setTemps(){
	tempPoints = [];
	var aabb = document.getElementById("aabb");
	var obb = document.getElementById("obb");
	var sphere = document.getElementById("sphere");

	aabb.disabled = true;
	obb.disabled = true;
	sphere.disabled = true;

}

function enableButtons(){
	var aabb = document.getElementById("aabb");
	var obb = document.getElementById("obb");
	var sphere = document.getElementById("sphere");

	aabb.disabled = false;
	obb.disabled = false;
	sphere.disabled = false;

}
function reset(){
	objects = [];
	tempPoints = [];	
	limparTela();
}


function convexHull(points){
	console.log(points);
	var leftmost = leftmostPoint(points);		
	var current = leftmost;
	var hull = [];

	do{
		hull.push(current);
		var candidate = points[0];
		for(var i in points)
			if(candidate == current || (orientation(current,candidate,points[i]) == 2)){
				candidate = points[i];
			}
		current = candidate;
	}while(current != leftmost);

	return hull;
}

function leftmostPoint(points){
	var leftmost = null;
	var xmin = Number.MAX_VALUE;
	for( var i in points)
		if(points[i].x < xmin){
			xmin = points[i].x;
			leftmost = points[i];
		}
	return leftmost;
}

function orientation(p1,p2,p3){
	var slope = (p1.y - p2.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p2.y - p3.y);
 	if(slope == 0)
 		return 0;//colinear
 	else if(slope > 0)//horario
 		return 1;
 	else 
 		return 2;//anti
}

function drawPolygon(points,color){
	console.log(points);
	var contexto = getContext();
	contexto.beginPath();
	contexto.moveTo(points[0].x,points[0].y);
	for(var i = 1; i < points.length;i++)
		contexto.lineTo(points[i].x,points[i].y);
	contexto.lineTo(points[0].x,points[0].y);
	contexto.strokeStyle=color;
	contexto.stroke();
}

function diff(p1,p2){
	return new Point(p2.x-p1.x,p2.y-p2.y);
}












//Classe descontinuada
class Matrix{// Tentei implementar a OBB pelos auto vetores, mas deu errado, então dessisti de usar essa matriz
	constructor(rows,collumns){
		this.rows = rows;
		this.collumns = collumns;
		this.values = new Array(rows);
		for(var i = 0; i < rows;i++)
			this.values[i] = new Float32Array(collumns);
	}
	setValue(row,collumn,value){
		this.values[row][collumn] = value;
	}
	getValue(row,collumn){
		return this.values[row][collumn];
	}
	sumMatrix(m2){
		if(this.rows == m2.rows && this.collumns == m2.collumns){
			var m3 = new Matrix(this.rows,this.collumns);
			for(var i = 0 ; i < this.rows;i++){
				for(var j = 0 ; j < m3.collumns;j++)
					m3.setValue(i,j,this.getValue(i,j) +m2.getValue(i,j));
			}
			return m3;
		}
		return null;
	}
	multMatrix(m2){
		if( this.collumns == m2.rows){
			var m3 = new Matrix(this.rows,m2.collumns);
			for(var i = 0 ; i < m3.rows;i++){
				for(var j = 0 ; j < m3.collumns; j++)
					for(var k = 0 ; k < this.collumns; k++)
						m3.setValue(i,j,m3.getValue(i,j) + (this.getValue(i,k) * m2.getValue(k,j)));
			}
			return m3;
		}
		return null;
	}
	transpose(){
		var m3 = new Matrix(this.collumns,this.rows);
		for(var i = 0 ; i < this.rows ; i++)
			for(var j = 0 ; j < this.collumns ; j++)
				m3.setValue(j,i,this.getValue(i,j));
		return m3;
	}
	mul(scalar){
		var m3 = new Matrix(this.rows,this.collumns);
		for(var i = 0 ; i < this.rows ; i++)
			for(var j = 0 ; j < this.collumns ; j++)
				m3.setValue(i,j,this.getValue(i,j) * scalar);
		return m3;
	}

	eigenvalues(){//auto-valor
		var a = 1;
		var b = -1 * (this.getValue(0,0)+this.getValue(1,1));
		var c = (this.getValue(0,0)*this.getValue(1,1)) - (this.getValue(0,1)*this.getValue(1,0));

		var delta = (b*b) - 4 * a * c;
		if(delta < 0) 
			return null;
		var sqrtD = Math.sqrt(delta);
		var l1 = ((-1 * b ) + sqrtD) / (2*a);
		var l2 = ((-1 * b ) - sqrtD) / (2*a);
		if (l1 == l2)
			return [l1];
		return [l1,l2];
	}
	eigenvector(l){//auto-vetor,não sei se o modo que fiz é o apropriado, fiz ele da maneira mais ingênua, só codifiquei os passos que faço manuelmente ao calcular.
		var a = this.getValue(0,0) - l;
		var b = this.getValue(0,1);
		var c = this.getValue(1,0);
		var d = this.getValue(1,1) - l;
		var det = (a*d) - (b*c);
		// if(det == 0)
		// 	return new Matrix(2,1);

		var x = 1;
		var y = (-1*(c*x))/d;

		var v = new Matrix(2,1);
		v.setValue(0,0,x);
		v.setValue(1,0,y);
		return v;
	}
}
