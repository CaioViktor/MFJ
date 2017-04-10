def bitsToLimite(bits):
	valorMaximo = 2**bits
	string = str(valorMaximo)
	maisSignificativo = int(string[0])
	grandeza = 1
	if len(string) > 1:
		grandeza = 10 ** len(string[1:])
	return maisSignificativo * grandeza

def stringToDecimal(string,comprimento):
	if len(string) >= comprimento:
		return int(string[:comprimento])
	else:
		ret = string[:len(string)] + '0'* (comprimento - len(string))
		return int(ret)