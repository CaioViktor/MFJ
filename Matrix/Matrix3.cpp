#include "Matrix3.h"
#include <stdexcept>
#include <cmath>
#include <iostream>
#define R 4
using namespace std;
//Construtores
Matrix3::Matrix3(){
	values = new float*[R];
	for(int i = 0 ; i < R ; i++){
		values[i] = new float[R];
		for(int j = 0 ; j < R ; j++)
			if(i==j)
				values[i][j] = 1;
			else
				values[i][j] = 0;
	}
}

Matrix3::~Matrix3(){
	// for(int i = 0 ; i < R ; i++)
	// 	delete [] values[i];
	// delete [] values;
	//Também dando problema
}

//Getters Setters
bool Matrix3::isValidPosition(int row,int collumn){
	return row >= 0 && row < R && collumn >= 0 && collumn < R;
}

void Matrix3::setValue(int row, int collumn,float value){
	if(!isValidPosition(row,collumn))
		throw std::invalid_argument( "Posicao passada invalida set r: "+std::to_string(row) +"\tc:"+std::to_string(collumn)+"\n");
	this->values[row][collumn] = value;
}

float Matrix3::getValue(int row, int collumn){
	if(!isValidPosition(row,collumn))
		throw std::invalid_argument( "Posicao passada invalida get r: "+std::to_string(row) +"\tc:"+std::to_string(collumn)+"\n");
	return this->values[row][collumn];
}
std::string Matrix3::toString(){
	std:string str = "\n";
	for(int i = 0 ; i < R ; i++){
		str+= "|";
		for(int j = 0 ; j < R ; j++)
			str+=std::to_string(this->getValue(i,j)) + "\t";
		str+= "|\n";
	}
	return str;
}

std::ostream& operator<<(std::ostream &strm,Matrix3 &a) {
  return strm << a.toString();
}



//Operadores
bool Matrix3::operator==(Matrix3 matrix){
	if(this == &matrix)
		return true;
	for(int i = 0; i < R ; i++)
		for(int j = 0 ; j < R; j++)
			if(this->getValue(i,j) != matrix.getValue(i,j))
				return false;
	return true;
}

Matrix3 Matrix3::operator=(Matrix3 matrix){
	if(this == &matrix)
		return *this;
	for(int i = 0; i < R ; i++)
		for(int j = 0 ; j < R; j++)
			this->setValue(i,j,matrix.getValue(i,j));
}



Matrix3 Matrix3::operator+(Matrix3 matrix){
	Matrix3 r = Matrix3();
	for(int i = 0; i < R ; i++)
		for(int j = 0 ; j < R; j++)
			r.setValue(i,j,this->getValue(i,j) + matrix.getValue(i,j));
	return r;
}

Matrix3 Matrix3::operator-(Matrix3 matrix){
	return (*this)+(matrix*-1);
}

Matrix3 Matrix3::operator*(float scalar){
	Matrix3 r = Matrix3();
	for(int i = 0; i < R ; i++)
		for(int j = 0 ; j < R; j++)
			r.setValue(i,j,this->getValue(i,j) * scalar);
	return r;
}	

Matrix3 Matrix3::operator*(Matrix3 matrix){
	Matrix3 r = Matrix3();

	for(int i = 0; i < R ; i++){
		for(int c = 0 ; c < R ; c++){
			float acumulator = 0;
			for(int j = 0 ; j < R; j++){
				acumulator+= this->getValue(i,j) * matrix.getValue(j,c);
			}
			r.setValue(i,c,acumulator);
		}
		
	}
	return r;
}

Vector Matrix3::operator*(Vector vector){
	if(vector.getDimension() != R)
		throw std::invalid_argument( "O vetor deve ser em R³\n" );
	float values[R];
	for(int i = 0 ; i < R ; i++){
		values[i] = 0;
		for(int j = 0 ; j < R ; j++)
			values[i] += this->getValue(i,j) * vector.getValue(j);
	}

	return Vector(R,values)*1/values[R-1];//Divisão por w correta?
}

Vector operator*(Vector vector,Matrix3 matrix){
	return matrix * vector;
}



//Matrizes de transformação
Matrix3 Matrix3::transpose(){
	Matrix3 t = Matrix3();
	for(int i=0 ; i < R ; i++)
		for(int j=0 ; j < R ; j++)
			t.setValue(i,j,this->getValue(j,i));
	return t;
}
	//statics
Matrix3 Matrix3::translationMatrix(float x,float y,float z){
	Matrix3 m = Matrix3();
	m.setTranslationMatrix(x,y,z);
	return m;
}

Matrix3 Matrix3::scaleMatrix(float x,float y,float z){
	Matrix3 m = Matrix3();
	m.setScaleMatrix(x,y,z);
	return m;
}

Matrix3 Matrix3::rotationX(float angle){
	Matrix3 m = Matrix3();
	m.setRotationX(angle);
	return m;
}

Matrix3 Matrix3::rotationY(float angle){
	Matrix3 m = Matrix3();
	m.setRotationY(angle);
	return m;
}

Matrix3 Matrix3::rotationZ(float angle){
	Matrix3 m = Matrix3();
	m.setRotationZ(angle);
	return m;
}

Matrix3 Matrix3::rotationMatrix(Vector axis,float angle){
	Matrix3 m = Matrix3();
	m.setRotationMatrix(axis,angle);
	return m;
}

Matrix3 Matrix3::TRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ){
	Matrix3 m = Matrix3();
	try{
		m.setTRS( x, y, z, rX, rY, rZ, sX, sY, sZ);
	}catch(invalid_argument e){
		throw e;
	}
	return m;	
}

Matrix3 Matrix3::InverseTRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ){
	Matrix3 m = Matrix3();
	try{
		m.setInverseTRS( x, y, z, rX, rY, rZ, sX, sY, sZ);
	}catch(invalid_argument e){
		throw e;
	}catch(...){
		cout << "erro na inversa\n";
	}
	return m;	
}

Matrix3 Matrix3::rotationScalaAtPoint(float px,float py,float pz,float angleRx,float angleRy,float angleRZ, float Sx,float Sy,float Sz){
	Matrix3 m = Matrix3();
	m.setRotationScalaAtPoint( px,py,pz, angleRx, angleRy, angleRZ,  Sx,Sy,Sz);
	return m;
}

	//set ups
void Matrix3::setIdentity(){
	for(int i = 0 ; i < R ; i++){
		for(int j = 0 ; j < R ; j++)
			if(i==j)
				setValue(i,j,1);
			else
				setValue(i,j,0);
	}
}

void Matrix3::setTranslationMatrix(float x,float y,float z){
	setIdentity();
	setValue(0,3,x);
	setValue(1,3,y);
	setValue(2,3,z);
}

void Matrix3::setScaleMatrix(float x,float y,float z){
	setIdentity();
	setValue(0,0,x);
	setValue(1,1,y);
	setValue(2,2,z);
}

void Matrix3::setRotationX(float angle){
	setIdentity();
	setValue(1,1,cos(angle));
    setValue(1,2,-sin(angle));
    setValue(2,1,sin(angle));
    setValue(2,2,cos(angle));
}

void Matrix3::setRotationY(float angle){
	setIdentity();
	setValue(0,0,cos(angle));
    setValue(0,2,sin(angle));
    setValue(2,0,-sin(angle));
    setValue(2,2,cos(angle));
}

void Matrix3::setRotationZ(float angle){
	setIdentity();
	setValue(0,0,cos(angle));
    setValue(0,1,-sin(angle));
    setValue(1,0,sin(angle));
    setValue(1,1,cos(angle));
}

void Matrix3::setRotationMatrix(Vector axis,float angle){
	setIdentity();
	
	float x = axis.getValue(0);
	float y = axis.getValue(1);
	float z = axis.getValue(2);
	float coss = cos(angle);
	float sen = sin(angle);

	setValue(0,0,x*x*(1-coss) + coss);
	setValue(0,1,x*y*(1-coss) - z * sen);
	setValue(0,2,x*z*(1-coss) + y * sen);

	setValue(1,0,x*y*(1-coss) + z * sen);
	setValue(1,1,y*y*(1-coss) + coss);
	setValue(1,2,y*z*(1-coss) - x * sen);

	setValue(2,0,x*z*(1-coss) - y * sen);
	setValue(2,1,z*y*(1-coss) + x * sen);
	setValue(2,2,z*z*(1-coss) + coss);
}

void Matrix3::setTRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ){
	if(rX.getDimension() != 3 || rY.getDimension() != 3 || rZ.getDimension() != 3)
		throw std::invalid_argument( "Todos os vetores passados devem ser de dimensão 3\n" );
	//Não verificarei se os vetores são ortonormais, pois pode reduzir o desempenho
	setIdentity();
	Vector SxRx = rX * sX;
	Vector SyRy = rY * sY;
	Vector SzRz = rZ * sZ;
	Vector t = Vector(x,y,z);
	for(int i = 0; i < 3 ; i++){
		this->setValue(i,0,SxRx.getValue(i));
		this->setValue(i,1,SyRy.getValue(i));
		this->setValue(i,2,SzRz.getValue(i));
		this->setValue(i,3,t.getValue(i));
	}
}

void Matrix3::setInverseTRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ){
	if(rX.getDimension() != 3 || rY.getDimension() != 3 || rZ.getDimension() != 3)
		throw std::invalid_argument( "Todos os vetores passados devem ser de dimensão 3\n" );
	//Não verificarei se os vetores são ortonormais, pois pode reduzir o desempenho
	Matrix3 sI = scaleMatrix(1/sX,1/sY,1/sZ);
	Matrix3 r = Matrix3();
	for(int i = 0; i < 3 ; i++){
		r.setValue(i,0,rX.getValue(i));
		r.setValue(i,1,rY.getValue(i));
		r.setValue(i,2,rZ.getValue(i));
	}
	Matrix3 rI = r.transpose();
	Matrix3 tI = translationMatrix(-x,-y,-z);

	Matrix3 trsI = sI * (rI * tI);
	(*this) = trsI;
}

void Matrix3::setRotationScalaAtPoint(float px,float py,float pz,float angleRx,float angleRy,float angleRz, float Sx,float Sy,float Sz){
	Matrix3 T = translationMatrix(-px,-py,-pz);
	Matrix3 Ti = translationMatrix(px,py,pz);
	Matrix3 Rx = rotationX(angleRx);
	Matrix3 Ry = rotationY(angleRy);
	Matrix3 Rz = rotationZ(angleRz);
	Matrix3 S = scaleMatrix(Sx,Sy,Sz);
	(*this) = Ti * (S * (Rz * (Ry*(Rx*T))));
	
}





