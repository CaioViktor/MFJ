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
				self.fracao = fracao
		except Exception as e:
			raise e

	def setInteira(self,inteira):
		self.inteira = inteira#apenas para guardar o valor, mesmo que nao seja valido
		if(inteira >= self.maxInt):
			self.overflow = True
			raise Exception("Erro valor atribuido "+str(self)+" e maior que o valor maximo permitido "+self.maxInt+"."+maxFra)
		else:
			if(inteira < 0):
				self.underflow = True
				raise Exception("Erro valor atribuido "+str(self)+" e menor que o valor minimo permitido 0")

	def __str__(self):
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
			raise e;

	def __add__(self,b):
		return self.add(self,b)
	@staticmethod
	def sub(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			return PontoFixo(a.inteira-b.inteira,a.fracao-b.fracao,precisaoInteria,precisaoFracao)
		except Exception as e:
			raise e;


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


def teste():
	# ent = str(raw_input('Entre com o valor:\n'))


	ponto1 = PontoFixo.strToPontoFixo('1.02')
	ponto2 = PontoFixo.strToPontoFixo('3.08')

	ponto3=ponto1+ponto2
	print(str(ponto3)+"\n")

if __name__=="__main__":
	teste()