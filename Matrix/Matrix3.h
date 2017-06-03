#include "../Vector/Vector.h"
class Matrix3{
	float** values;
	bool isValidPosition(int row,int collumn);
public:	
	Matrix3();
	~Matrix3();

	void setValue(int row, int collumn,float value);
	float getValue(int row, int collumn);
	std::string toString();
	friend std::ostream& operator<<(std::ostream &strm, Matrix3 &a);

	bool operator==(Matrix3 matrix);
	Matrix3 operator=(Matrix3 matrix);
	Matrix3 operator*(float scalar);
	Matrix3 operator+(Matrix3 matrix);
	Matrix3 operator-(Matrix3 matrix);
	Matrix3 operator*(Matrix3 matrix);
	friend Vector operator*(Vector vector,Matrix3 matrix);
	Vector operator*(Vector vector);
	Matrix3 transpose();




	void setIdentity();
	void setTranslationMatrix(float x,float y,float z);
	void setScaleMatrix(float x,float y,float z);
	void setRotationX(float angle);
	void setRotationY(float angle);
	void setRotationZ(float angle);
	void setRotationMatrix(Vector axis,float angle);
	void setTRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ);
	void setInverseTRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ);
	void setRotationScalaAtPoint(float px,float py,float pz,float angleRx,float angleRy,float angleRZ, float Sx,float Sy,float Sz);
	
	static Matrix3 translationMatrix(float x,float y,float z);
	static Matrix3 scaleMatrix(float x,float y,float z);
	static Matrix3 rotationX(float angle);
	static Matrix3 rotationY(float angle);
	static Matrix3 rotationZ(float angle);
	static Matrix3 rotationMatrix(Vector axis,float angle);
	static Matrix3 TRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ);
	static Matrix3 InverseTRS(float x,float y,float z,Vector rX,Vector rY,Vector rZ,float sX,float sY,float sZ);
	static Matrix3 rotationScalaAtPoint(float px,float py,float pz,float angleRx,float angleRy,float angleRZ, float Sx,float Sy,float Sz);
	
};