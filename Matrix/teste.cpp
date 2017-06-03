#include "Matrix3.h"
#include <iostream>
#include <cmath>
using namespace std;
int main(){
	Matrix3 m = Matrix3();
	cout <<"identidade" <<m <<endl;
	Matrix3 t = Matrix3::translationMatrix(2.0f,3.0f,4.0f);
	cout <<"translação t(2,3,4)" << t << endl;
	Matrix3 s = m + t;
	Matrix3 sub = m - t;
	Matrix3 sca = m * 2;
	Matrix3 tr = t.transpose();
	cout << "i+t:" << s << "i-t" << sub <<"i*2" << sca << "t.transpose" << tr << endl;

	Matrix3 m2 = Matrix3();
	for(int i = 0 ; i < 4 ;i++)
		for(int j = 0 ; j < 4 ;j++)
			m2.setValue(i,j,i+j);
	Matrix3 p = m2 * t;
	cout << "M2:" << m2 << "m2*t" << p <<endl;

	Vector v = Vector(1.0f,2.0f,3.0f,4.0f);
	Vector vm = m2 * v;
	cout << "vetor v: \n" << v << "\nm2*v dividido por w:\n"<<vm<<endl;

	Matrix3 ms = Matrix3::scaleMatrix(2.0f,3.0f,4.0f);
	Matrix3 rx = Matrix3::rotationX(M_PI);
	Matrix3 ry = Matrix3::rotationY(M_PI);
	Matrix3 rz = Matrix3::rotationZ(M_PI);
	Matrix3 re = Matrix3::rotationMatrix(v,M_PI);

	cout << "matriz scala(2,3,4)" << ms <<"rotaçãoX(PI)" << rx<<"rotaçãoY(PI)" << ry<<"rotaçãoZ(PI)" << rz<<"rotação No vetor v(PI)" << re << endl;


	Vector cx = Vector::CANONICAL(3,0);
	Vector cy = Vector::CANONICAL(3,1);
	Vector cz = Vector::CANONICAL(3,2);
	Matrix3 trs = Matrix3::TRS(1.0f,2.0f,3.0f,cx,cy,cz,3.0f,2.0f,1.0f);
	cout << "canonicoX: " << cx <<"canonicoY: " << cy<<"canonicoZ: " << cz<<endl;
	Matrix3 trsi = Matrix3::InverseTRS(1.0f,2.0f,3.0f,cx,cy,cz,3.0f,2.0f,1.0f);

	Matrix3 trsXtrsi = trs*trsi;

	cout << "TRS; T = 1,2,3 ; R = canônicos ; S = 3,2,1 " << trs << "inversa: "<<trsi<<"TRS * TRS⁻¹"<<trsXtrsi<<endl;


	Matrix3 u = Matrix3::rotationScalaAtPoint(1.0f,2.0f,3.0f,M_PI,M_PI*2,M_PI/2,3.0f,2.0f,1.0f);
	cout << "rotação de Pi,2Pi,Pi/2 com escala 3,2,1 no ponto 1,2,3" << u<<endl;
	Matrix3 u2 = Matrix3::rotationScalaAtPoint(1.0f,2.0f,3.0f,M_PI,M_PI,M_PI,3.0f,2.0f,1.0f);
	cout << "rotação de Pi,Pi,Pi com escala 3,2,1 no ponto 1,2,3" << u2<<endl;
	return 0;
}