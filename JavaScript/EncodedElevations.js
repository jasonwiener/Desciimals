//
//  EncodedElevations.js
//  EncodedElevations
//
//  Created by Jason Wiener on 06/11/22.
//  Copyright © 2022 Jason Wiener. All rights reserved.
//

try
{
	var bisection = require('./bisection');
	var PositiveNumbers = require('./PositiveNumbers');
}catch(xe){}

/*
accuracy:		0.1m (3.93in)
upscale:		multiple all values by 10 to upscale to ints from x.1 floats
clamps:			max = Mount Everest's peak, 29,029 feet [8,848 meters] above mean sea level
				min = Dead Sea, Jordan/Israel, 1,414 feet (431 meters) below sea level
range:			9279m
re-zero: 		add 4310 to each value to account for min-clamp (431*10)
*/

var EncodedElevations = function(codex)
{
	var _this = this;

	this.init = function(codex)
	{
		const elevationCodex = codex || '0123456789abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$()*+,-./;<=>[]^_`{|}~';

		this.ElevationEncoder = new PositiveNumbers({
			'size' : 3, 
			'code' : elevationCodex, 
			'reserved_pad' : 'x'
		});

		this.ElevationCodex = elevationCodex;
	}

	this.encode = function(input)
	{
		const elevationEncoder = this.ElevationEncoder;

		let elevations = input.map(p => parseFloat(p.toFixed(1)));
// 		console.log('encode.elevations:', elevations);

// 		console.log('encode.elevations[0]:', elevations[0]);
		const firstPoint = elevationEncoder.encode(Math.floor(elevations[0] * 10) + 4310)
// 		console.log('encode.firstPoint:', firstPoint);
	
		let lastElevation;
		let deltas = [];
		
		for(var i in elevations)
		{
			const elevation = elevations[i];
			let newElevation = Math.floor(elevation * 10);
			const delta = (newElevation - ((lastElevation != null) ? lastElevation : newElevation));
			deltas.push(delta);
			lastElevation = newElevation;
		}
// 		console.log('encode.deltas:', deltas);

// 		console.log('encode.sorted(deltas):', sorted(deltas):
// 		console.log('encode.sorted+mapped(deltas):', sorted(map(abs, deltas)));

		let absDeltas = deltas.map(delta => Math.abs(delta))
		absDeltas.sort(function(a, b){return a - b});
//  		console.log('encode.sorted+mapped(deltas):', absDeltas);

		const biggestSingleStepDelta = absDeltas.slice(-1)[0];
// 		console.log('encode.biggestSingleStepDelta:', biggestSingleStepDelta);

		let resolutions = [];
		for(var encodedLength=0; encodedLength<4; encodedLength++)
		{
			var res = Math.floor(elevationEncoder.WkgSize**encodedLength)-1;
			resolutions.push(res)
		}
// 		console.log('resolutions:', resolutions);
		
		let sortedDeltas = JSON.parse(JSON.stringify(deltas));
		sortedDeltas.sort(function(a, b){return a - b});
// 		console.log('encode.sortedDeltas:', sortedDeltas);
		const biggestNegativeDelta = sortedDeltas[0];
// 		console.log('encode.biggestNegativeDelta:', biggestNegativeDelta);

		const elevationPad = Math.abs(biggestNegativeDelta);
//		print 'encode.elevationPad:', elevationPad
	
		const resolution = bisection.bisect_left(resolutions, biggestSingleStepDelta+elevationPad);
//		print 'encode.resolution:', resolution

		const deltaPoint = elevationEncoder.encode(biggestNegativeDelta + 4310);

		const paddedDeltas = deltas.map(delta => delta+elevationPad);
//	 	print 'paddedDeltas:', paddedDeltas

		const domainEncoder = new PositiveNumbers({
			'size' : resolution, 
			'code' : this.ElevationCodex, 
			'reserved_pad' : 'x'
		});
		
		encodedDeltas = deltas.map(delta => (delta != 0) ? domainEncoder.encode(delta+elevationPad) : '@');

//		print 'encode.firstPoint:', firstPoint
//		print 'encode.deltaPoint:', deltaPoint
//		print 'encode.encodedDeltas:', encodedDeltas	
	
		return ([
			firstPoint,
			deltaPoint,
			resolution.toString()
		].concat(encodedDeltas)).join('')
	}

	this.decode = function(input)
	{
		const elevationEncoder = this.ElevationEncoder;

		const firstPoint = input.substring(0,3);
//	 	print 'decode.firstPoint:', firstPoint
	
		const decodedFirstPoint = (elevationEncoder.decode(firstPoint)-4310)/10;
// 		print 'decode.decodedFirstPoint:', decodedFirstPoint
	
		const deltaPoint = input.substring(3,6);
//	 	print 'decode.deltaPoint:', deltaPoint

		const decodedDeltaPoint = elevationEncoder.decode(deltaPoint)-4310;
// 		print 'decode.decodedDeltaPoint:', decodedDeltaPoint

		const resolution = parseInt(input.substring(6,7));
// 		print 'decode.resolution:', resolution

		const domainDecoder = new PositiveNumbers({
			'size' : resolution, 
			'code' : this.ElevationCodex, 
			'reserved_pad' : 'x'
		});
	
		let decodedDeltas = [];
		const polyline = input.split('');
		var i=7;
		while(i<polyline.length)
		{
//	 		print 'i:', i
			const pointLeadingChar = polyline[i];
			if(pointLeadingChar == '@')
			{
				decodedDeltas.push(pointLeadingChar);
				i += 1
//	 			print '@ found...'
			}
			else
			{
				decodedDeltas.push(polyline.slice(i,i+resolution).join(''));
				i += resolution;
			}
		}
		
// 	 	console.log('decode.decodedDeltas:', JSON.stringify(decodedDeltas));
		const deltas = decodedDeltas.map(
			delta => (delta != '@') ? domainDecoder.decode(delta)+decodedDeltaPoint : 0
		);
// 		console.log('decode.deltas:', JSON.stringify(deltas));
	
		let elevations = [decodedFirstPoint];
	
		let lastElevation = decodedFirstPoint;
		for(var i=1; i<deltas.length; i++)
		{
			let delta = deltas[i];
			let newElevation = parseFloat((lastElevation + (delta / 10)).toFixed(1));
			elevations.push(newElevation);
			lastElevation = newElevation;
		}
//  		console.log('decode.elevations:', JSON.stringify(elevations));
		return elevations
	}
	
	this.init(codex)
}
try{ module.exports = EncodedElevations }catch(e){}