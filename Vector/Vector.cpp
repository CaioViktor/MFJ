#include "Vector.h"
#include <stdlib.h>
#include <stdexcept>
#include <cmath>
#include <iostream>
using namespace std;

float arcsin(float arc){
	if(arc == 0)
		return M_PI;
	else if(arc >= 1)
		return M_PI/2;
	else if(arc <= -1)
		return -M_PI/2;
	return asin(arc);
}
float arccos(float arc){
	// cout <<"arc: " << arc << endl;
	if(arc == 0)
		return M_PI/2;
	if(arc >= 1)
		return M_PI;
	else if(arc <= -1)
		return -M_PI;
	return acos(arc);
}
Vector::Vector(int dimension, float* values){
	this->dimension = (int)dimension;
	this->values = new float[dimension];
	for(int i = 0; i < this->dimension; i++){
		this->setValue(i,values[i]);
	}
}
Vector::Vector(float x,float y,float z,float w){
	this->dimension = (int)4;
	this->values = new float[4];
	this->values[0] = x;
	this->values[1] = y;
	this->values[2] = z;
	this->values[3] = w;
}
Vector::Vector(float x,float y,float z){
	this->dimension = (int)3;
	this->values = new float[3];
	this->values[0] = x;
	this->values[1] = y;
	this->values[2] = z;
	
}
Vector::Vector(float x,float y){
	this->dimension = (int)2;
	this->values = new float[2];
	this->values[0] = x;
	this->values[1] = y;
}
Vector::Vector(){// Por padrão será criado o vetor nulo de R²
	this->dimension = 2;
	this->values = new float[2];
	this->values[0] = 0;
	this->values[1] = 0;
}
Vector::~Vector(){
	// if(values != NULL)
	// 	delete values;
}

bool Vector::isValidPosition(int position){
	return position >= 0 && position < this->dimension;
}

float Vector::getValue(int position){
	if(!this->isValidPosition(position))
		throw std::invalid_argument( "indice invalido" );
	return this->values[position];
}
int Vector::getDimension(){
	return this->dimension;
}
void Vector::setValue(int position,float value){
	if(!this->isValidPosition(position))
		throw std::invalid_argument( "indice invalido" );
	this->values[position] = value;
}
Vector Vector::operator*(float scalar){
	float newValues[this->dimension];
	for(int i = 0 ; i < this->dimension; i++){
		newValues[i] = this->getValue(i) * scalar;
	}
	Vector r = Vector(this->dimension,newValues);

	return r;
}
Vector Vector::operator/(float scalar){
	return *this * (1/scalar);
}


Vector Vector::operator=(Vector vector){
	if(this != &vector){
		this->dimension = vector.dimension;
		for(int i = 0;i<this->dimension;i++)
			this->values[i] = vector.getValue(i);
	}
	return *this;
}

Vector Vector::operator+(Vector vector){
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );

	float newValues[this->dimension];
	for(int i = 0 ; i < this->dimension; i++)
		newValues[i] = this->getValue(i) + vector.getValue(i);
	return Vector(this->dimension,newValues);
}
Vector Vector::operator-(Vector vector){
	return *this + (vector * -1.0f);//Programador preguiçoso
}

float Vector::operator*(Vector vector){//Produto escala
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );
	float acumulator = 0;
	for(int i = 0 ; i < this->dimension; i++)
		acumulator += this->getValue(i) * vector.getValue(i);
	return acumulator;
}
float Vector::operator!(){//Norma,Módulo,Grandeza
	return sqrt(*this * *this);
}

float Vector::cross2(Vector vector){
	if(this->dimension != vector.dimension || this->dimension != 2 || vector.dimension != 2)
		throw std::invalid_argument( "operacao invalida" );
	return this->getValue(0)*vector.getValue(1) - this->getValue(1)*vector.getValue(0);
}
Vector Vector::cross3(Vector vector){
	if(this->dimension != vector.dimension || this->dimension != 3 || vector.dimension != 3)
		throw std::invalid_argument( "operacao invalida" );
	return Vector( (this->getValue(1) * vector.getValue(2)) - (this->getValue(2) * vector.getValue(1)) , (this->getValue(2) * vector.getValue(0)) - (this->getValue(0) * vector.getValue(2)) , (this->getValue(0) * vector.getValue(1) - this->getValue(1) * vector.getValue(0) ) );
}

Vector Vector::cross4(Vector vector){
	if(this->dimension != vector.dimension || this->dimension != 4 || vector.dimension != 4)
		throw std::invalid_argument( "operacao invalida" );
	throw std::invalid_argument( "operacao nao implementada" );
}

Vector Vector::normalize(){
	return *this / (!(*this));//Etah magia negra.
}
float Vector::distance(Vector vector){
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );
	return !(*this - vector);
}

Vector Vector::projection(Vector vector){//Projeta o próprio vetor sobre vector
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );
	return  vector * ((*this * vector)/(vector * vector)) ;
}

float Vector::angle(Vector vector){ // em radianos
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );
	if(this->dimension > 4 || this->dimension < 2)
		throw std::invalid_argument( "esta operacao nao foi implementada para esta dimensao" );
	Vector v1 = this->normalize();
	Vector v2 = vector.normalize();
	float angle;
	if (v1.dimension == 4){//não usei o switch porque já tive problemas em que bugava com ele.
		angle = arccos((v1 * v2)/!v1 * !v2);
	}else if(v1.dimension == 3){
		angle = arccos((v1 * v2)/!v1 * !v2);
	}else{
		Vector cross  = Vector(v1.getValue(0),v1.getValue(1),0).cross3(Vector(v2.getValue(0),v2.getValue(1),0));
		float z = cross.getValue(2);
		angle = arcsin(z/(!v1 * !v2));
	}
	return angle;
}
float Vector::angleDegrees(Vector vector){ // em graus
	return 180 * this->angle(vector)/M_PI;
}



float Vector::pseudAngle(){
	if(this->dimension != 2)
		throw std::invalid_argument( "esta operacao nao foi implementada para esta dimensao" );
	
	float x , y;
	x = this->getValue(0);
	y = this->getValue(1);
	if(x == y && x == 0)
		throw std::invalid_argument( "PseudoAngulo de um vetor nulo...Isso é embaraçoso, mas nao me programaram para isso\n" );

	float result = 0;

	if(x >= 0 && y >= 0 && x>=y){//1ºoctante
		result = y/x;
	}else if(x >= 0 && y >= 0 && x<y){//2ºoctante
		result = 2 - x/y;
	}else if(x < 0 && y >= 0 && (-1*x)<=y){//3ºoctante
		result = 2 + (-1*x)/y;
	}else if(x < 0 && y >= 0 && (-1*x)>y){//4ºoctante
		result = 4 - y/(-1*x);
	}else if(x < 0 && y < 0 && x<=y){//5ºoctante
		result = 4 + (-1*y)/(-1*x);
	}else if(x < 0 && y < 0 && x>y){//6ºoctante
		result = 6 - (-1*x)/(-1*y);
	}else if(x >= 0 && y < 0 && x <= (-1*y)){//7ºoctante
		result = 6 + x/(-1*y);
	}else if(x>= 0 && y < 0 && x>(-1*y)){//8ºoctante
		result = 8 - (-1*y)/x;
	}

	if(result < 0 || result>=8)
		result = 0;
	return result;
}


float Vector::pseudAngle(Vector vector){
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );
	if(this->dimension > 2 || this->dimension < 2)
		throw std::invalid_argument( "esta operacao nao foi implementada para esta dimensao" );
	try{
		float result = this->pseudAngle() - vector.pseudAngle();
		if(result < 0 || result>=8)
			result = 0;
		return result;
		
	}catch( ... ){};
}


std::string Vector::toString(){
	std::string text = "(" + std::to_string(getValue(0));
	for(int i= 1 ; i<dimension ; i++)
		text += "," + std::to_string(getValue(i));
	return text+")";
}

const Vector Vector::ONES2(){
	return Vector(1.0f,1.0f);
}
const Vector Vector::ONES3(){
	return Vector(1.0f,1.0f,1.0f);
}
const Vector Vector::ONES4(){
	return Vector(1.0f,1.0f,1.0f,1.0f);
}

const Vector Vector::CANONICAL(int dimension,int axis){
	if(!(dimension >= 1 && axis < dimension && axis >= 0))
		throw std::invalid_argument( "operacao invalida" );
	float values[dimension];
	for(int i = 0; i < dimension ; i++)
		if(i == axis)
			values[i] = 1;
		else
			values[i] = 0;
	return Vector(dimension,values);
}

std::ostream& operator<<(std::ostream &strm, Vector &a){
	return strm << a.toString();
}