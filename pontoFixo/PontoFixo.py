class PontoFixo:
	def __init__(self,inteira,fracao,precisaoInteria=16,precisaoFracao=10):
		try:
			self.maxInt = 2**precisaoInteria
			self.maxFra = 2**precisaoFracao
			self.zerar()
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
		return str(self.inteira)+"."+str(self.fracao)

	def setPrecisao(self, inteira,fracao):
		#ao mudar a precisao da variavel ela sera zerada
		self.maxInt = 2**precisaoInteria
		self.maxFra = 2**precisaoFracao
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
	def add(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			return PontoFixo(a.inteira+b.inteira,a.fracao+b.fracao,precisaoInteria,precisaoFracao)
		except Exception as e:
			raise e;

	@staticmethod
	def sub(a,b,precisaoInteria=16,precisaoFracao=10):
		try:
			return PontoFixo(a.inteira-b.inteira,a.fracao-b.fracao,precisaoInteria,precisaoFracao)
		except Exception as e:
			raise e;