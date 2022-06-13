var PositiveNumbers = function(params)
{
	var _this = this;
	
	this.init = function(params)
	{
		params = params || {};
		
		const reservedPad = params.reserved_pad || '0';
		const size = params.size || 7;
		let code = params.code || "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

		if(code.indexOf(reservedPad) != -1)
			code = code.replace(reservedPad, '');

		this.ReservedPad = reservedPad;
		
		code = code.split('');
		code.sort();
		this.Code = code;

		this.EncodedLength = size;
		this.WkgSize = code.length;
		this.MaxValue = Math.floor(this.WkgSize**this.EncodedLength);

// 		console.log('EncodedLength', this.EncodedLength);
// 		console.log('WkgSize', this.WkgSize);
// 		console.log('MaxValue', this.MaxValue);		
	}

    this.encode = function(n)
    {
        if(n < 0 || n > this.MaxValue)
			throw('n < 0 or n > self.MaxValue('+ this.MaxValue.toString() +') -> n = ' + n.toString());

		const reservedPad = this.ReservedPad;
		const codex = this.Code;
		const wkgSize = this.WkgSize;
		const encodedLength = this.EncodedLength;
		
		function getchar(n, i)
		{
			var tmpn = n-wkgSize;

			if(i != encodedLength)
				tmpn = Math.floor(tmpn/wkgSize**i);

			return codex[(tmpn%wkgSize)]
		}
        
        if(n < wkgSize)
        {
            const idx = (wkgSize + (n-wkgSize));
            const returnString = codex[idx];
            return returnString.padStart(encodedLength, reservedPad);
        }
        else
        {
            var returnArray = [];
            for(var i=1; i<encodedLength+1; i++)
            {
                let c = getchar(n, i);
                returnArray.push(c);
            }
            
            return returnArray.join("")
        }
    }
    
    this.decode = function(c)
    {
        if(c.length == 1)
           return this.Code.indexOf(c);
        
		const reservedPad = this.ReservedPad;
		const codex = this.Code;
		const wkgSize = this.WkgSize;
		const encodedLength = this.EncodedLength;

        let itemAlt = 0
        if(c.substring(0, 1) != reservedPad)
            itemAlt = wkgSize;
		
		for(var i=1; i<encodedLength+1; i++)
        {
            let wkgChar = c.substring(i-1, i);
            if(wkgChar == reservedPad)
                continue;
            
            let character = codex.indexOf(wkgChar);
            if(i != encodedLength)
                itemAlt += character*(wkgSize**i);
            else
                itemAlt += character;
        }
        
        return itemAlt
    }
    
	this.init(params);
}

// g = new PositiveNumbers()
// 
// function test(v)
// {
// 	let e = g.encode(v);
// 	console.log('encode:', v, e);
// 	let d = (e) ? g.decode(e) : null;
// // 	console.log('decode:', v, d);
// 	console.log(v, '==', d, ':', (v == d));
// 	return (v == d)
// }
// 
// test(1)
// test(15)
// test(60)
// test(61)
// test(62)
// test(63)
// test(1000)
// test(12123)
// test(12124)
// test(12125)
// test(25000)
// test(88471)
// test(5045902)
// test(25760187211)
// test(3142712836021)
try{ module.exports = PositiveNumbers }catch(e){}