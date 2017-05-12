#include "Vector.h"
#include <iostream>
using namespace std;
int main(){
	Vector v1 = Vector(9.0f,3.0f);
	// Vector v1 = Vector(3.0f,0.0f);
	Vector v2 = Vector(-3.0f,9.0f);

	cout << "v1: " <<v1.toString() <<"\n";
	cout << "v2: " << v2.toString()<<"\n";
	Vector v3 = v1 * 2;
	cout << "mul 2: " << v3.toString()<<"\n";
	v3 = v1 / 2;
	cout << "div 2: " << v3.toString()<<"\n";
	v3 = v1 + v2;
	cout << "soma: " << v3.toString()<<"\n";
	v3 = v1 - v2;
	cout << "sub: " << v3.toString()<<"\n";

	cout << "magnitude: " << !v1<<endl;
	cout <<"distancia de " << v2.toString() << " para " << v1.toString() << " = " << v2.distance(v1)<<endl;
	cout << v1.toString()<< " normalizado = " << v1.normalize().toString() << endl;

	
	cout << "escalar <v1*v2>: " << v1*v2 <<"\n";
	cout << "interno v1Xv2: " << v1.cross2(v2)<<"\n";

	v3 = v1.projection(v2);
	cout << "projeção v1 sobre v2: " << v3.toString()<<"\n";
	cout << "angulo entre v1 e v2 "<<v1.angle(v2) << endl;
	cout << "angulo entre v2 e v1 "<<v2.angle(v1) << endl;
	cout << "angulo graus entre v1 e v2 "<<v1.angleDegrees(v2) << endl;








	cout << "----------------------------------------R³---------------------------------------\n";

	Vector v4 = Vector(9.0f,3.0f,1.0f);
	// Vector v4 = Vector(3.0f,0.0f);
	Vector v5 = Vector(-3.0f,9.0f,-1.0f);

	cout << "v4: " << v4.toString() <<"\n";
	cout << "v5: " << v5.toString()<<"\n";
	Vector v6 = v4 * 2;
	cout << "mul 2: " << v6.toString()<<"\n";
	v6 = v4 / 2;
	cout << "div 2: " << v6.toString()<<"\n";
	v6 = v4 + v5;
	cout << "soma: " << v6.toString()<<"\n";
	v6 = v4 - v5;
	cout << "sub: " << v6.toString()<<"\n";

	cout << "magnitude: " << !v4<<endl;
	cout <<"distancia de " << v5.toString() << " para " << v4.toString() << " = " << v5.distance(v4)<<endl;
	cout << v4.toString()<< " normalizado = " << v4.normalize().toString() << endl;

	
	cout << "escalar <v4*v5>: " << v4*v5 <<"\n";
	v6 = v4.cross3(v5);
	cout << "interno v4Xv5: " << v6.toString()<<"\n";

	v6 = v4.projection(v5);
	cout << "projeção v4 sobre v5: " << v6.toString()<<"\n";
	cout << "angulo entre v4 e v5 "<<v4.angle(v5) << endl;
	cout << "angulo entre v5 e v4 "<<v5.angle(v4) << endl;
	cout << "angulo graus entre v4 e v5 "<<v4.angleDegrees(v5) << endl;
	return 0;
}