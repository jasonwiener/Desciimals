from bisect import bisect_left

class PositiveNumbers:

	Code = None
	MaxValue = None
	WkgSize = None
	EncodedLength = None
	
	def __init__(self, size=7, code=None, reserved_pad='0'):

		if reserved_pad in code:
			code = code.replace(reserved_pad, '')
			
		self.ReservedPad = reserved_pad
		self.Code = sorted([c for c in code or '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'])
		self.EncodedLength = size
		self.WkgSize = len(self.Code)
		self.MaxValue = int(self.WkgSize**self.EncodedLength)

# 		print 'EncodedLength:', self.EncodedLength
# 		print 'WkgSize:', self.WkgSize
# 		print 'MaxValue:', self.MaxValue
	
	
	def encode(self, n):
		if n < 0 or n > self.MaxValue: 
			raise Exception('n < 0 or n > self.MaxValue(%s) -> n = %s' % (self.MaxValue, n))

		reservedPad = self.ReservedPad
		codex = self.Code
		wkgSize = self.WkgSize
		encodedLength = self.EncodedLength

		if n < self.WkgSize: 
			return str(codex[int(n-wkgSize)]).rjust(encodedLength, reservedPad)
		else:
			def getchar(n, i):
				tmpn = n - wkgSize
				if i != encodedLength: 
					tmpn = (tmpn/wkgSize ** i);
				return codex[int(tmpn % wkgSize)]
			return ''.join([getchar(n,i) for i in range(1, encodedLength+1)])


	def decode(self, c):
		if len(c) == 1:
			return bisect_left(self.Code, c)

		reservedPad = self.ReservedPad
		codex = self.Code
		wkgSize = self.WkgSize
		encodedLength = self.EncodedLength
				
		itemAlt = 0
		if c[0] != reservedPad: 
			itemAlt = self.WkgSize

		for i in range(1, self.EncodedLength+1):
			wkgChar = c[i-1:i]
			if wkgChar == reservedPad: 
				continue
			char = bisect_left(codex, wkgChar)
			
			if i != encodedLength: 
				itemAlt += char*(wkgSize**i)
			else:
				itemAlt += char
		return itemAlt


	def e(self, n): return self.encode(n);
	def d(self, n): return self.decode(n);


# g = PositiveNumbers()
# 
# def test(v):
# # 	print
# 	e = g.e(v)
# 	print '%s.encode: %s' % (v,e)
# 	d = g.d(e) if e else None
# # 	print '%s.decode: %s' % (v,d)
# 	print '%s == %s: %s' % (v, d, (v == d))
# 	return (v == d)
# 
# test(1)
# test(15)
# test(60)
# test(61)
# test(62)
# test(63)
# test(1000)
# test(12123)
# test(12124)
# test(12125)
# test(25000)
# test(88471)
# test(5045902)
# test(25760187211)
# test(3142712836021)
# test(3142712836021)
# milli = timestampMilliseconds()
# print 'milli:', milli
# test(milli)
