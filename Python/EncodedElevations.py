from bisect import bisect_left
from PositiveNumbers import PositiveNumbers


def fixed(data, precision=5):
	return round(data, precision)


'''
accuracy:		0.1m (3.93in)
upscale:		multiple all values by 10 to upscale to ints from x.1 floats
clamps:			max = Mount Everest's peak, 29,029 feet [8,848 meters] above mean sea level
				min = Dead Sea, Jordan/Israel, 1,414 feet (431 meters) below sea level
range:			9279m
re-zero: 		add 4310 to each value to account for min-clamp (431*10)
'''
class EncodedElevations(object):

	def __init__(self, codex=None):
		elevationCodex = codex or '0123456789abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$()*+,-./;<=>[]^_`{|}~'
		self.ElevationEncoder = PositiveNumbers(3, elevationCodex, reserved_pad='x')
		self.ElevationCodex = elevationCodex


	def encode(self, input):

		elevationEncoder = self.ElevationEncoder

		elevations = map(
			lambda p: fixed(p,1),
			input
		)
# 		print 'encode.elevations:', elevations

# 		print 'encode.elevations[0]:', elevations[0]
		firstPoint = elevationEncoder.encode(int(elevations[0] * 10) + 4310)
# 		print 'encode.firstPoint:', firstPoint
	
		lastElevation = None
		deltas = []
		for elevation in elevations:
			newElevation = int(elevation * 10)
			delta = (newElevation - (lastElevation if lastElevation is not None else newElevation))
			deltas.append(delta)
			lastElevation = newElevation
	
# 		print 'encode.deltas:', deltas
# 		print 'encode.sorted(deltas):', sorted(deltas)
# 		print 'encode.sorted+mapped(deltas):', sorted(map(abs, deltas))

		biggestSingleStepDelta = sorted(map(abs, deltas))[-1]
# 		print 'encode.biggestSingleStepDelta:', biggestSingleStepDelta

		resolutions = [
			int(elevationEncoder.WkgSize**encodedLength)-1
			for encodedLength in range(0,4)
		]
# 		print 'resolutions:', resolutions

		biggestNegativeDelta = sorted(deltas)[0]
# 		print 'encode.biggestNegativeDelta:', biggestNegativeDelta

		elevationPad = abs(biggestNegativeDelta)
# 		print 'encode.elevationPad:', elevationPad
	
		resolution = bisect_left(resolutions, biggestSingleStepDelta+elevationPad)
# 		print 'encode.resolution:', resolution

		deltaPoint = elevationEncoder.encode(biggestNegativeDelta + 4310)

		paddedDeltas = map(
			lambda delta: delta+elevationPad,
			deltas
		)
	# 	print 'paddedDeltas:', paddedDeltas

		domainEncoder = PositiveNumbers(resolution, self.ElevationCodex, reserved_pad='x')

		encodedDeltas = map(
			lambda delta: domainEncoder.encode(delta+elevationPad) if delta != 0 else '@',
			deltas
		)

# 		print 'encode.firstPoint:', firstPoint
# 		print 'encode.deltaPoint:', deltaPoint
# 		print 'encode.encodedDeltas:', encodedDeltas	
	
		return ''.join(
			[
				firstPoint,
				deltaPoint,
				str(resolution)
			]+encodedDeltas
		)


	def decode(self, polyline):
		elevationEncoder = self.ElevationEncoder

		firstPoint = polyline[:3]
	# 	print 'decode.firstPoint:', firstPoint
	
		decodedFirstPoint = float(elevationEncoder.decode(firstPoint)-4310)/10
# 		print 'decode.decodedFirstPoint:', decodedFirstPoint
	
		deltaPoint = polyline[3:6]
	# 	print 'decode.deltaPoint:', deltaPoint

		decodedDeltaPoint = elevationEncoder.decode(deltaPoint)-4310
# 		print 'decode.decodedDeltaPoint:', decodedDeltaPoint

		resolution = int(polyline[6:7])
# 		print 'decode.resolution:', resolution

		domainDecoder = PositiveNumbers(resolution, self.ElevationCodex, reserved_pad='x')
	
		decodedDeltas = []
		i=7
		while i < len(polyline):
	# 		print 'i:', i
			pointLeadingChar = polyline[i]
			if pointLeadingChar == '@':
				decodedDeltas.append(pointLeadingChar)
				i += 1
	# 			print '@ found...'
			else:
				decodedDeltas.append(polyline[i:i+resolution])
				i += resolution
	
# 		print 'decode.decodedDeltas:', decodedDeltas

		deltas = map(
			lambda delta: domainDecoder.decode(delta)+decodedDeltaPoint if delta != '@' else 0,
			decodedDeltas
		)
# 		print 'decode.deltas:', deltas
	
		elevations = [decodedFirstPoint]
	
		lastElevation = decodedFirstPoint
		for delta in deltas[1:]:
			newElevation = fixed(lastElevation + (float(delta) / 10), 1)
			elevations.append(newElevation)
			lastElevation = newElevation

# 		print 'decode.elevations:', elevations
		return elevations
