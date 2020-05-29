# name = input('pleace input you name：');

# 查询体重指数
# h = input('录入您的身高（米）：') 
# w = input('录入您的体重（kg）：') 
# hi = float(h) 
# wi = float(w) 
# bmi = wi / hi**2 
# if bmi == 0: 
# 	print('错误信息') 
# elif bmi < 18.5: 
# 	print('您的体脂率是：%.2f,体重过轻！增加营养'% bmi) 
# elif 18.5 <= bmi < 25: 
# 	print('您的体脂率是：%.2f,体重是正常的,请继续保持！'% bmi) 
# elif 25 <= bmi < 28: 
# 	print('您的体脂率是：%.2f,体重已经过重,需要多运动！'% bmi) 
# elif 28<= bmi < 32: 
# 	print('您的体脂率是：%.2f,已经肥胖,需要进行减脂！'% bmi) 
# else: 
# 	print('您的体脂率是：%.2f,已经严重肥胖,要少吃少喝多运动！'% bmi)

def my_abs(x):
	if not isinstance(x,(int,float)):
		raise TypeError('bad operand type')
	if x>0:
		return x
	else:
		return abs(-x)

def move(x,y,step,angle=0):
	nx = x + step * math.cos(angle)
	ny = y - step * math.sin(angle)
	return nx,ny
def power(x,n=2):
	sum = x
	while n>1:
		sum*=x
		n = n - 1
	return sum
def fect(n):
	if n==1:
		return 1
	return n*fect(n-1)
