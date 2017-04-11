class PontoFixo:
	def __init__(self,inteira,fracao,precisaoInteria=16,precisaoFracao=10):
		try:
			self.setPrecisao(precisaoInteria,precisaoFracao)
			self.setInteira(inteira)
			self.setFracao(fracao)
		except Exception as e:
			raise e

	def setFracao(self,fracao):
		try:
			if(fracao >= self.maxFra):
				self.setInteira(self.inteira + 1)
				self.setFracao(fracao - self.maxFra)
			else:
				if(fracao < 0):
					self.setInteira(self.inteira - 1)
					self.setFracao(self.maxFra + fracao)#fracao ja e negativa
				else:
					self.fracao = fracao
		except Exception as e:
			raise e

	def setInteira(self,inteira):
		self.inteira = inteira#apenas para guardar o valor, mesmo que nao seja valido
		if(inteira >= self.maxInt):
			self.overflow = True
			raise Exception("Erro valor atribuido "+str(self)+" e maior que o valor maximo permitido "+str(self.maxInt)+"."+str(self.maxFra-1))
		else:
			if(inteira < 0):
				self.underflow = True
				raise Exception("Erro valor atribuido "+str(self)+" e menor que o valor minimo permitido 0")

	def __str__(self):
		if(self.underflow or self.overflow):
			return "Este ponto fixo nao e valido, pois sofre de Overflow: "+ str(self.overflow) +" ou  Underflow: "+str(self.underflow)
		fracao = str(self.fracao)
		if len(fracao) < self.comprimentoFracao:
			fracao = '0'*(self.comprimentoFracao - len(fracao)) + fracao
		return str(self.inteira)+"." + fracao

	def setPrecisao(self, inteira,fracao):
		#ao mudar a precisao da variavel ela sera zerada
		self.maxInt = 2**inteira
		self.maxFra = bitsToLimite(fracao)
		self.comprimentoFracao = len(str(self.maxFra)) - 1
		self.zerar()

	def zerar(self):
		self.inteira = 0
		self.fracao = 0
		self.overflow = False
		self.underflow = False

	def arredondar(self):
		try:
			if self.fracao >= (self.maxFra/2):
				return PontoFixo(self.inteira,self.maxFra)
			else :
				return PontoFixo(self.inteira,0)
		except Exception as e:
			raise e

	@staticmethod
	def zero():
		return PontoFixo(0,0)

	@staticmethod
	def strToPontoFixo(string,precisaoInteria=16,precisaoFracao=10):
		partes = string.replace(',','.').split('.')
		inteira = int(partes[0])
		fracao = 0
		if len(partes) > 1:
			fracao = stringToDecimal(partes[1],len(str(bitsToLimite(precisaoFracao)))-1)
		return PontoFixo(inteira,fracao,precisaoInteria,precisaoFracao)

	@staticmethod
	def add(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			return PontoFixo(a.inteira+b.inteira,a.fracao+b.fracao,precisaoInteria,precisaoFracao)
		except Exception as e:
			raise e

	def __add__(self,b):
		return self.add(self,b)


	@staticmethod
	def sub(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			return PontoFixo(a.inteira-b.inteira,a.fracao-b.fracao,precisaoInteria,precisaoFracao)
		except Exception as e:
			raise e

	def __sub__(self,b):
		return self.sub(self,b)

	@staticmethod
	def mul(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			acumulador = PontoFixo(0,0,precisaoInteria,precisaoFracao)
			for i in range(0,b.inteira):
				acumulador = PontoFixo.add(acumulador,a,precisaoInteria,precisaoFracao)
			fracoes = ((b.fracao * a.fracao)/bitsToLimite(precisaoFracao)) + b.fracao * a.inteira
			fracao =PontoFixo(0,fracoes,precisaoInteria,precisaoFracao)

			return acumulador + fracao
		except Exception as e:
			raise e

	def __mul__(self,b):
		return self.mul(self,b)

	@staticmethod
	def div(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			cont = 0
			while True:
				pontoAux = PontoFixo(cont+1,0)
				ponto = pontoAux * b
				if PontoFixo.maior(ponto,a):
					break
				cont+=1
			parteInteira = PontoFixo(cont,0)
			multi = parteInteira * b
			resto = a - multi
			cont = 0
			while True:
				pontoAux = PontoFixo(0,cont+1)
				ponto = pontoAux * b
				if PontoFixo.maior(ponto,resto):
					break
				cont+=1
			fracao = PontoFixo(0,cont)
			return parteInteira+fracao
		except Exception as e:
			raise e

	def __div__(self,b):
		return self.div(self,b)

	@staticmethod
	def mod(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			cont = 0
			while True:
				pontoAux = PontoFixo(cont+1,0)
				ponto = pontoAux * b
				if PontoFixo.maior(ponto,a):
					break
				cont+=1
			parteInteira = PontoFixo(cont,0)
			multi = parteInteira * b
			resto = a - multi
			return resto
		except Exception as e:
			raise e

	def __mod__(self,b):
		return self.mod(self,b)

	@staticmethod
	def mulArredondada(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			return (a*b).arredondar()
		except Exception as e:
			raise e

	@staticmethod
	def igual(a,b):
		if a.inteira == b.inteira and a.fracao == b.fracao:
			return True
		return False
	@staticmethod
	def maior(a,b):
		if (a.inteira > b.inteira) or (a.inteira == b.inteira and a.fracao > b.fracao):
			return True
		return False

	@staticmethod
	def menor(a,b):
		if not PontoFixo.igual(a,b) and not PontoFixo.maior(a,b):
			return True
		return False
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

def comprimento(numero):
	return len(str(numero))

def teste():
	op = 5
	while op != 0:
		print("1)Soma\n2)Subtracao\n3)Multiplicacao\n4)Multiplicacao arredondada\n5)Divisao\n6)Resto da divisao(mod ou %)\n0)Sair")
		op = int(raw_input("Entre com a operacao desejada:\n"))
		if op <= 6:
			if op > 0:
				ponto1 = PontoFixo.strToPontoFixo(str(raw_input("Entro com o primeiro ponto fixo:\n")))
				ponto2 = PontoFixo.strToPontoFixo(str(raw_input("Entro com o segundo ponto fixo:\n")))
				ponto3 = PontoFixo(0,0)
				if op == 1:
					ponto3 = ponto1 + ponto2
				else:
					if op == 2:
						ponto3 = ponto1 - ponto2
					else:
						if op == 3:
							ponto3 = ponto1 * ponto2
						else:
							if op == 4:
								ponto3  = PontoFixo.mulArredondada( ponto1, ponto2)
							else:
								if op == 5:
									ponto3  = ponto1/ponto2
								else:
									if op == 6:
										ponto3  = ponto1%ponto2
				print("resultado: "+str(ponto3)+"\n-----------------------------------------------------\n")
		else:
			print("Operacao invalida\n")



if __name__=="__main__":
	teste()