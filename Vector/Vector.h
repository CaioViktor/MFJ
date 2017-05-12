class Vector{
	float *values;
	int dimension;
public:
	Vector(int dimension, float* values);
	Vector(float x,float y,float z,float w);
	Vector(float x,float y,float z);
	Vector(float x,float y);
	~Vector();
	bool isValidPosition(int position);
	float getValue(int position);
	void setValue(int position,float value);
	Vector operator*(float scalar);
	Vector operator/(float scalar);

	Vector operator+(Vector vector);
	Vector operator-(Vector vector);
	float operator*(Vector vector);//Produto escalar
	float operator!();//Norma,Módulo,Grandeza

	float cross2(Vector vector);
	Vector cross3(Vector vector);
	Vector cross4(Vector vector);

	Vector normalize();
	float distance(Vector vector);

	Vector projection(Vector vector);//Projeta o próprio vetor sobre vector

	float angle(Vector vector); // em radianos
	float angleDegrees(Vector vector); // em graus
};