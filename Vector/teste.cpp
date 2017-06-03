#include "Vector.h"
#include <stdexcept>
#include <iostream>
using namespace std;
int main(){
	Vector v1 = Vector(9.0f,3.0f);
	// Vector v1 = Vector(3.0f,0.0f);
	Vector v2 = Vector(-3.0f,9.0f);

	cout << "v1: " <<v1 <<"\n";
	cout << "v2: " << v2<<"\n";
	Vector v3 = v1 * 2;
	cout << "mul 2: " << v3<<"\n";
	v3 = v1 / 2;
	cout << "div 2: " << v3<<"\n";
	v3 = v1 + v2;
	cout << "soma: " << v3<<"\n";
	v3 = v1 - v2;
	cout << "sub: " << v3<<"\n";

	cout << "magnitude: " << !v1<<endl;
	cout <<"distancia de " << v2 << " para " << v1 << " = " << v2.distance(v1)<<endl;
	cout << v1<< " normalizado = " << v1.normalize().toString() << endl;

	
	cout << "escalar <v1*v2>: " << v1*v2 <<"\n";
	cout << "interno v1Xv2: " << v1.cross2(v2)<<"\n";

	v3 = v1.projection(v2);
	cout << "projeção v1 sobre v2: " << v3<<"\n";
	cout << "angulo entre v1 e v2 "<<v1.angle(v2) << endl;
	cout << "angulo entre v2 e v1 "<<v2.angle(v1) << endl;
	cout << "angulo graus entre v1 e v2 "<<v1.angleDegrees(v2) << endl;








	cout << "----------------------------------------R³---------------------------------------\n";

	Vector v4 = Vector(9.0f,3.0f,1.0f);
	// Vector v4 = Vector(3.0f,0.0f);
	Vector v5 = Vector(-3.0f,9.0f,-1.0f);

	cout << "v4: " << v4 <<"\n";
	cout << "v5: " << v5<<"\n";
	Vector v6 = v4 * 2;
	cout << "mul 2: " << v6<<"\n";
	v6 = v4 / 2;
	cout << "div 2: " << v6<<"\n";
	v6 = v4 + v5;
	cout << "soma: " << v6<<"\n";
	v6 = v4 - v5;
	cout << "sub: " << v6<<"\n";

	cout << "magnitude: " << !v4<<endl;
	cout <<"distancia de " << v5 << " para " << v4 << " = " << v5.distance(v4)<<endl;
	cout << v4<< " normalizado = " << v4.normalize().toString() << endl;

	
	cout << "escalar <v4*v5>: " << (v4*v5) <<"\n";
	v6 = v4.cross3(v5);
	cout << "interno v4Xv5: " << v6<<"\n";

	v6 = v4.projection(v5);
	cout << "projeção v4 sobre v5: " << v6<<"\n";
	cout << "angulo entre v4 e v5 "<<v4.angle(v5) << endl;
	cout << "angulo entre v5 e v4 "<<v5.angle(v4) << endl;
	cout << "angulo graus entre v4 e v5 "<<v4.angleDegrees(v5) << endl;





	cout << "----------------------------------------R⁴---------------------------------------\n";

	Vector v7 = Vector(9.0f,3.0f,1.0f,1.0f);
	// Vector v7 = Vector(3.0f,0.0f);
	Vector v8 = Vector(-3.0f,9.0f,-1.0f,-1.0f);

	cout << "v7: " << v7 <<"\n";
	cout << "v8: " << v8<<"\n";
	Vector v9 = v7 * 2;
	cout << "mul 2: " << v9<<"\n";
	v9 = v7 / 2;
	cout << "div 2: " << v9<<"\n";
	v9 = v7 + v8;
	cout << "soma: " << v9<<"\n";
	v9 = v7 - v8;
	cout << "sub: " << v9<<"\n";

	cout << "magnitude: " << !v7<<endl;
	cout <<"distancia de " << v8 << " para " << v7 << " = " << v8.distance(v7)<<endl;
	cout << v7<< " normalizado = " << v7.normalize().toString() << endl;

	
	cout << "escalar <v7*v8>: " << v7*v8 <<"\n";
	// v9 = v7.cross3(v8);
	// cout << "interno v7Xv8: " << v9<<"\n";

	v9 = v7.projection(v8);
	cout << "projeção v7 sobre v8: " << v9<<"\n";
	cout << "angulo entre v7 e v8 "<<v7.angle(v8) << endl;
	cout << "angulo entre v8 e v7 "<<v8.angle(v7) << endl;
	cout << "angulo graus entre v7 e v8 "<<v7.angleDegrees(v8) << endl;




	cout << "----------------------------------------Pseudo-Angulo---------------------------------------\n";

	Vector p[4];
	p[0] = Vector(1.0f,1.0f);
	p[1] = Vector(-1.0f,1.0f);
	p[2] = Vector(-1.0f,-1.0f);
	p[3] = Vector(1.0f,-1.0f);
	

	string l[4];
	l[0] = "+X";
	l[1] = "+Y";
	l[2] = "-X";
	l[3] = "-Y";

	Vector p2[4];
	p2[0] = Vector(1.0f,0.0f);//+X
	p2[1] = Vector(0.0f,1.0f);//+Y
	p2[2] = Vector(-1.0f,0.0f);//-X
	p2[3] = Vector(0.0f,-1.0f);//-Y
	
	for(int i = 0 ; i < 4 ; i++)
		cout << "P" << i << " : " << p[i] << endl;
	for(int i = 0 ; i < 4 ; i++)
		cout  << l[i] << " : " << p2[i] << endl;


	for(int i = 0 ; i < 4 ; i++)
		cout << "P" << i << " : " << p[i].pseudAngle() << endl;
	
	cout << endl;

	for(int i = 0 ; i < 4 ; i++)
		cout  << l[i] << " : " << p2[i].pseudAngle() << endl;

	for(int i = 0 ; i < 4 ; i++)
		cout  << "P"<< i << " - " << l[3-i] << " : " << p[i].pseudAngle(p2[3-i]) << endl;



	Vector c1 = Vector(0.005f, 0.01f);
	Vector c2 = Vector(1.0f,2.0f);
	cout << "C1 : " << c1 << endl;
	cout << "C2 : " << c2 << endl;
	cout  << "C2 - C1 : " << c2.pseudAngle(c1) << endl;	
	cout  << "C1 - C2 : " << c1.pseudAngle(c2) << endl;	

	Vector n = Vector();
	cout << "n: " << n << endl;
	try{
		cout  << "n: " << n.pseudAngle() << endl;	
		
	}catch(const std::invalid_argument& e){
		cout << "deu erro: " << e.what();
	}
	return 0;
}