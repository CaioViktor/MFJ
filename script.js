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
	toVector(){//Matriz coluna
		var m = new Matrix(2,1);
		m.setValue(0,0,this.x);
		m.setValue(1,0,this.y);
		return m;
	}
	toVector2(){//Matriz coluna
		var m = new Matrix(3,1);
		m.setValue(0,0,this.x);
		m.setValue(1,0,this.y);
		m.setValue(2,0,1);
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
	sqrLen(){
		return this.x * this.x + this.y + this.y;
	}
	normalizesqr(){
		var len = this.sqrLen();
		if(len == 0)
			len = 0.0001;
		this.x /= len;
		this.y /= len;
	}
	diff(p2){
		return new Point(p2.x - this.x ,p2.y - this.y ,this.canvas);
	}
	diff2(p2){
		return new Point(this.x - p2.x ,this.y - p2.y ,this.canvas);
	}
	orthogonal(){
		return new Point(this.y,-this.x,this.canvas);
	}
	clone(){
		return new Point(this.x,this.y,this.canvas);
	}
	negate(){
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	equals(p2){
		return this.x==p2.x && this.y==p2.y;
	}
	project(m){
		var m1 = m.multMatrix(this.toVector2());	
		return new Point(m1.getValue(0,0),m1.getValue(1,0),this.canvas);

	}
}

//-------------------------------------------------
//Bounding Volume- Não usei a estratégia de herança, pois vi que não trazia nenhuma vantagem
function newAABB(min,max){
		var aabb = new AABB(null,true);
		aabb.Xmin = min.x; 
		aabb.Ymin = min.y;
		aabb.Xmax = max.x;
		aabb.Ymax = max.y;
		aabb.valid = false;
		return aabb;
	}
class AABB{
	constructor(points,dummy){

		this.points = points;
		
		this.Xmin = Number.MAX_VALUE;
		this.Ymin = Number.MAX_VALUE;
		this.Xmax = Number.MIN_VALUE;
		this.Ymax = Number.MIN_VALUE;

		if(!dummy){

			for(var i in this.points){
				this.Xmin = Math.min(this.Xmin,points[i].x);
				this.Ymin = Math.min(this.Ymin,points[i].y);
				this.Xmax = Math.max(this.Xmax,points[i].x);
				this.Ymax = Math.max(this.Ymax,points[i].y);
			}
			this.pointBottomLeft = new Point(this.Xmin,this.Ymin);
			this.pointTopLeft = new Point(this.Xmin,this.Ymax);
			this.pointTopRight = new Point(this.Xmax,this.Ymax);
			this.pointBottomRight = new Point(this.Xmax,this.Ymin);
			this.distanceW = this.pointBottomLeft.distance(this.pointBottomRight);
			this.distanceH = this.pointBottomLeft.distance(this.pointTopLeft);
			this.corner1 = [this.pointBottomLeft,this.pointTopLeft,this.pointTopRight,this.pointBottomRight];//direita-cima

			this.corner2 = [this.pointBottomRight,this.pointTopRight,this.pointTopLeft,this.pointBottomLeft];//esquerda-cima



			this.axis1 = computeAxes(this.corner1);
			this.origin1 = [this.corner1[0].dot(this.axis1[0]),this.corner1[0].dot(this.axis1[1])];
			this.axis2 = computeAxes(this.corner2);
			this.origin2 = [this.corner2[0].dot(this.axis2[0]),this.corner2[0].dot(this.axis2[1])];
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
		if(volume instanceof Sphere || volume instanceof OBB)
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
		this.bestArea = Number.MAX_VALUE;

		this.pointBottomLeft = null;
		this.pointBottomRight = null;
		this.pointTopLeft = null;
		this.pointTopRight = null;

		var edgesDir = [];
		for(var i in hull){
			edgesDir.push(hull[(i+1)%hull.length].diff(hull[i]));
			edgesDir[i].normalize();
		}
	
		this.Xmin = Number.MAX_VALUE;
		this.Ymin = Number.MAX_VALUE;
		this.Xmax = Number.MIN_VALUE;
		this.Ymax = Number.MIN_VALUE;
		var leftInd = 0;
		var topInd = 0;
		var rightInd = 0;
		var bottomInd = 0;

		for(var i in hull){
			if(this.Xmin > hull[i].x){
				this.Xmin = hull[i].x;
				leftInd = i;
			}
			if(this.Ymin > hull[i].y){
				this.Ymin = hull[i].y;
				topInd = i;
			}
			if(this.Xmax < hull[i].x){
				this.Xmax = hull[i].x;
				rightInd = i;
			}
			if(this.Ymax < hull[i].y){
				this.Ymax = hull[i].y;
				bottomInd = i;
			}
		}

		var leftTopDown = new Point(0,1,null);
		var rightBottomUp = new Point(0,-1,null);
		var topLeftRight = new Point(-1,0,null);
		var bottomLeftRight = new Point(1,0,null);
		// var p = 1;
		// console.log(hull);
		for(var i in hull){
			var angles = [
				Math.acos(leftTopDown.dot(edgesDir[leftInd])),
				Math.acos(rightBottomUp.dot(edgesDir[rightInd])),
				Math.acos(topLeftRight.dot(edgesDir[topInd])),
				Math.acos(bottomLeftRight.dot(edgesDir[bottomInd]))
			];
			// console.log(angles);
			var edgeAngleMin = angles.indexOf(Math.min.apply(Math,angles));
			// console.log(edgeAngleMin);
			// console.log(edgesDir[leftInd]);
			// console.log(edgesDir[rightInd]);
			// console.log(edgesDir[bottomInd]);
			// console.log(edgesDir[topInd]);
			// console.log("dir:");
			// console.log(leftTopDown);
			// console.log(rightBottomUp);
			// console.log(bottomLeftRight);
			// console.log(topLeftRight);
			switch(edgeAngleMin){
				case 0://left
					// console.log("left");
					leftTopDown = edgesDir[leftInd].clone();
					rightBottomUp = leftTopDown.clone().negate();
					bottomLeftRight = leftTopDown.orthogonal();
					topLeftRight = bottomLeftRight.clone().negate();

						leftInd = (leftInd+1)%hull.length;


				break;
				case 1://right
				// console.log("right");
					rightBottomUp = edgesDir[rightInd].clone();
					leftTopDown = rightBottomUp.clone().negate();
					// console.log(leftTopDown);
					bottomLeftRight = leftTopDown.orthogonal();
					topLeftRight = bottomLeftRight.clone().negate();

						rightInd = (rightInd+1)%hull.length;

				break;
				case 2://top
					// console.log("top");
					topLeftRight = edgesDir[topInd].clone();
					bottomLeftRight = topLeftRight.clone().negate();
					leftTopDown = topLeftRight.orthogonal();
					rightBottomUp = leftTopDown.clone().negate();
						topInd = (topInd+1)%hull.length;
				break;
				case 3://bottom
					// console.log("bottom");
					bottomLeftRight = edgesDir[bottomInd].clone();
					topLeftRight = bottomLeftRight.clone().negate();
					rightBottomUp = bottomLeftRight.orthogonal();
					leftTopDown = rightBottomUp.clone().negate();
						bottomInd = (bottomInd+1)%hull.length;
				break;
			}
			// console.log(hull[leftInd]);
			// console.log(hull[topInd]);
			// console.log(hull[rightInd]);
			// console.log(hull[bottomInd]);
			// console.log("saiu");
			// console.log(leftTopDown);
			// console.log(rightBottomUp);
			// console.log(bottomLeftRight);
			// console.log(topLeftRight);

			// console.log("vai atualizar");
			this.updateOBB(hull[leftInd],leftTopDown,hull[rightInd],rightBottomUp,hull[topInd],topLeftRight,hull[bottomInd],bottomLeftRight);
			// // if(p==4){
			// drawPolygon([this.pointBottomLeft,this.pointTopLeft,this.pointTopRight,this.pointBottomRight],"#000000");
			// 	break;
			// }
			// p+=1;
		}
		// console.log(this);
		var centerX = (this.pointBottomLeft.x + this.pointBottomRight.x + this.pointTopLeft.x + this.pointTopRight.x)/4;
		var centerY = (this.pointBottomLeft.y + this.pointBottomRight.y + this.pointTopLeft.y + this.pointTopRight.y)/4;
		this.center = new Point(centerX,centerY,getCanvas());
		this.matrixTransformation = new Matrix(3,3);
		this.matrixTransformation.setValue(0,0,bottomLeftRight.x);
		this.matrixTransformation.setValue(0,1,bottomLeftRight.y);
		this.matrixTransformation.setValue(0,2,-centerX);
		this.matrixTransformation.setValue(1,0,rightBottomUp.x);
		this.matrixTransformation.setValue(1,1,rightBottomUp.y);
		this.matrixTransformation.setValue(1,2,-centerY);
		this.matrixTransformation.setValue(2,2,1);

		var min = new Point(this.pointBottomLeft.x,this.pointBottomLeft.y);
		var max = new Point(this.pointTopRight.x,this.pointTopRight.y);
		this.aabb = newAABB(min.project(this.matrixTransformation),max.project(this.matrixTransformation));
		// console.log(this.aabb);

		// console.log(topLeftRight);
		// console.log(leftTopDown);
		this.corner1 = [this.pointBottomLeft,this.pointTopLeft,this.pointTopRight,this.pointBottomRight];//direita-cima

		this.corner2 = [this.pointBottomRight,this.pointTopRight,this.pointTopLeft,this.pointBottomLeft];//esquerda-cima


		

		this.distanceW = this.pointBottomLeft.distance(this.pointBottomRight);
		this.distanceH = this.pointBottomLeft.distance(this.pointTopLeft);
		this.axis1 = computeAxes(this.corner1);
		this.origin1 = [this.corner1[0].dot(this.axis1[0]),this.corner1[0].dot(this.axis1[1])];
		this.axis2 = computeAxes(this.corner2);
		this.origin2 = [this.corner2[0].dot(this.axis2[0]),this.corner2[0].dot(this.axis2[1])];

	}
	updateOBB(leftStart,leftDir,rightStart,rightDir,topStart,topDir,bottomStart,bottomDir){
		// console.log("arestas:")
		// console.log(leftStart);
		// console.log(leftDir);
		// console.log(rightStart);
		// console.log(rightDir);
		// console.log(topStart);
		// console.log(topDir);
		// console.log(bottomStart);
		// console.log(bottomDir);
		var obbUpperLeft = IntersectionLines(leftStart,leftDir,topStart,topDir);
		var obbUpperRight = IntersectionLines(rightStart,rightDir,topStart,topDir);
		var obbBottomLeft = IntersectionLines(bottomStart,bottomDir,leftStart,leftDir);
		var obbBottomRight = IntersectionLines(bottomStart,bottomDir,rightStart,rightDir);

		// console.log("obbs");
		// console.log(obbUpperLeft);
		// console.log(obbUpperRight);
		// console.log(obbBottomLeft);
		// console.log(obbBottomRight);

		var distLR = obbUpperLeft.distance(obbUpperRight);
		var distTB = obbUpperLeft.distance(obbBottomLeft);


		var area = distLR * distTB;
		// console.log("area: "+area);
		if(area > 0 && area < this.bestArea){
			this.bestArea = area;
			this.pointBottomLeft = obbBottomLeft;
			this.pointBottomRight = obbBottomRight;
			this.pointTopLeft = obbUpperLeft;
			this.pointTopRight = obbUpperRight;
		}
	}

	draw(){
		drawPolygon([this.pointBottomLeft,this.pointTopLeft,this.pointTopRight,this.pointBottomRight],"#000000");
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
		console.log("chamou");
		if(volume instanceof AABB || volume instanceof OBB){
			return overlapping(this,volume,1) && overlapping(volume,this,1) && overlapping(this,volume,2) && overlapping(volume,this,2);
		}
		if(volume instanceof Sphere){
			var pointSphera = [];
			for(var i in volume.points){
				var po = volume.points[i].project(this.matrixTransformation);
				pointSphera.push(po);
			}
			var ns = new Sphere(pointSphera);
			console.log(ns);
			console.log(this.aabb);
			return ns.detectCollision(this.aabb);
		}
		return false;
	}
}
function computeAxes(corner){
	// console.log(p);
	var p1 = corner[0].diff(corner[1]);
	var p2 = corner[0].diff(corner[3]);
	var axis = [];
	axis.push(p1);
	axis.push(p2);
	for(var a = 0 ; a < 2 ; ++a){
		axis[a].normalizesqr();
	}
	return axis;
}

function overlapping(p,volume,eixo){
	var axis = p.axis1;
	var corner = volume.corner1;
	var origin = p.origin1;
	if(eixo == 2){
		axis = p.axis2;
		corner = volume.corner2;
		origin = p.origin2;
	}
	for(var a = 0 ;  a < 2;++a){
		var t = corner[0].dot(axis[a]);
		var tMin = t;
		var tMax = t;
		// console.log(t);
		// console.log(p.origin[a]);
		for(var c = 1; c < 4; ++c){
			// console.log(c);
			t = corner[c].dot(axis[a]);
			if(t < tMin)
				tMin = t;
			else if(t > tMax)
				tMax = t;
		}

			var distance = Math.max(p.distanceW,p.distanceH);
			
			// console.log("p origem");
			// console.log(p.origin[a]);
			// console.log("tmin");
			// console.log(tMin);
			// console.log(distance + p.origin[a]);
			// console.log(tMax);
			// console.log(distance);
		if((tMin > distance + origin[a]) || ( tMax < origin[a]))
			return false;
		// console.log("fim iiteracao");	
	}
	// console.log("fim overlapping");
	return true;
}

class Sphere{
	constructor(points){
		this.points = points;
		

		this.Xmin = points[0].x;
		this.Ymin = points[0].y;
		this.Xmax = points[0].x;
		this.Ymax = points[0].y;
		var distance = 0;

		for(var i in this.points){
			// console.log("xmax:"+this.Xmax);
			// console.log("x: "+points[i].x);
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
		// console.log(this.Xmax);
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
		if(volume instanceof OBB)
			return volume.detectCollision(this);
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
	var aabb = new AABB(tempPoints,false);
	for(var i in objects)
		if(aabb.detectCollision(objects[i]))
			alert("colisão com "+i);
	objects.push(aabb);
	drawCanvas();
	setTemps();
}

function createOBB(){
	if(tempPoints.length < 3){
		setTemps();
		drawCanvas();
		alert("Para criar uma obb são necessário no mínimo 3 pontos");
		return;
	}
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
	for(var i in hulls)
		drawPolygon(hulls[i],"#ff22aa");
	for(var i in objects)
		objects[i].draw();
	for(var i in tempPoints)
		tempPoints[i].draw();
	
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
	hulls = [];
	limparTela();
}


function convexHull(points){
	// console.log(points);
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
	// console.log(points);
	var contexto = getContext();
	contexto.beginPath();
	contexto.moveTo(points[0].x,points[0].y);
	for(var i = 1; i < points.length;i++)
		contexto.lineTo(points[i].x,points[i].y);
	contexto.lineTo(points[0].x,points[0].y);
	contexto.strokeStyle=color;
	contexto.stroke();
	contexto.strokeStyle="#000000";
}

function IntersectionLines(s0,d0,s1,d1){
	var dd =  d0.x *d1.y - d0.y * d1.x;
	var dx = s1.x - s0.x;
	var dy = s1.y - s0.y;
	var t = (dx *d1.y - dy*d1.x)/dd;
	var p1 = new Point(s0.x+d0.x,s0.y+d0.y);
	var p2 = new Point(s1.x+d1.x,s1.y+d1.y);
	// console.log("dot:");
	// console.log(p1.dot(p2));
	return new Point(s0.x + t * d0.x,s0.y + t * d0.y,null);
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


// function testar(){

// 	// var teste = [new Point(179,137,getCanvas()),new Point(205,137,getCanvas()),new Point(188,157,getCanvas()),new Point(207,159,getCanvas())];
// var teste = [new Point(151,122,getCanvas()),new Point(275,76,getCanvas()),new Point(268,170,getCanvas())];
// 	var obb = new OBB(teste);
// 	objects.push(obb);

// 	// console.log(obb.matrixTransformation);
// 	// //Pontos para espaço de objeto
// 	// var p1 = new Point(0,0,getCanvas());
// 	// var p2 = new Point(10,0,getCanvas());
// 	// var p3 = new Point(-10,0,getCanvas());
// 	// var m1 = obb.matrixTransformation.multMatrix(p1.toVector2());
// 	// var m2 = obb.matrixTransformation.multMatrix(p2.toVector2());
// 	// var m3 = obb.matrixTransformation.multMatrix(p3.toVector2());
// 	// var po = new Point(m1.getValue(0,0),m1.getValue(1,0),getCanvas());
// 	// tempPoints.push(po);
// 	// var po2 = new Point(m2.getValue(0,0),m2.getValue(1,0),getCanvas());
// 	// tempPoints.push(po2);
// 	// var po3 = new Point(m3.getValue(0,0),m3.getValue(1,0),getCanvas());
// 	// tempPoints.push(po3);
// 	// console.log(po);
// 	// console.log(p1.project(obb.matrixTransformation));
// 	// console.log(orientation(po,po2,po3));


// 	drawCanvas();
// }
