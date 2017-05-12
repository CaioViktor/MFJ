#include "Vector.h"
#include <stdlib.h>
#include <stdexcept>
#include <cmath>

Vector::Vector(int dimension, float* values){
	this->dimension = dimension;
	this->values = values;
}
Vector::Vector(float x,float y,float z,float w){
	float values[4];
	values[0] = x;
	values[1] = y;
	values[2] = z;
	values[3] = w;
	Vector(4,values);
}
Vector::Vector(float x,float y,float z){
	float values[3];
	values[0] = x;
	values[1] = y;
	values[2] = z;
	Vector(3,values);
}
Vector::Vector(float x,float y){
	float values[2];
	values[0] = x;
	values[1] = y;
	Vector(2,values);
}
Vector::~Vector(){
	this->dimension = 0;
	free(this->values);
}

bool Vector::isValidPosition(int position){
	return position >= 0 && position < this->dimension;
}

float Vector::getValue(int position){
	if(!this->isValidPosition(position))
		throw std::invalid_argument( "indice invalido" );
	return values[position];
}
void Vector::setValue(int position,float value){
	if(!this->isValidPosition(position))
		throw std::invalid_argument( "indice invalido" );
	values[position] = value;
}
Vector Vector::operator*(float scalar){
	float newValues[this->dimension];
	for(int i = 0 ; i < this->dimension; i++)
		newValues[i] = this->getValue(i) * scalar;
	return Vector(this->dimension,newValues);
}
Vector Vector::operator/(float scalar){
	return *this * (1/scalar);
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
	return *this + (vector * -1);//Programador preguiçoso
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
	return  vector * ((*this * vector)/(vector * *this)) ;
}

float Vector::angle(Vector vector){ // em radianos
	if(this->dimension != vector.dimension)
		throw std::invalid_argument( "nao foi passdo vetor de mesma dimensao" );
	if(this->dimension > 4 || this->dimension < 2)
		throw std::invalid_argument( "esta operacao nao foi implementada para esta dimensao" );

	float angle;
	if (this->dimension == 4){//não usei o switch porque já tive problemas em que bugava com ele.
		//TODO:
	}else if(this->dimension == 3){
		angle = acos((*this * vector)/!(*this) * !vector);
	}else{
		Vector cross  = Vector(this->getValue(0),this->getValue(1),0).cross3(Vector(vector.getValue(0),vector.getValue(1),0));
		float z = cross.getValue(2);
		angle = asin(z/(!(*this) * !vector));
	}
	return angle;
}
float Vector::angleDegrees(Vector vector){ // em graus
	return 180 * this->angle(vector)/M_PI;
}