/**
 * node-bisection.io-node
 * Copyright(c) 2011 Jason Wiener, JasonWiener, LLC <hiya@jasonwiener.com>
 * MIT Licensed
 * 
 * Calculates the index of the Array where item X should be placed, assuming the Array is sorted.
 *
 * @param {Array} a The array containing the items.
 * @param {Number} x The item that needs to be added to the array.
 * @param {Number} lo Inital Index that is used to start searching, optional.
 * @param {Number} hi The maximum Index that is used to stop searching, optional.

 * ONLY FOR bisect_right & bisect_left
 * @returns {Number} the index where item X should be placed
 * 
 * ONLY FOR insort_right & insort_left
 * modifies a passed into the function
 */
 
var bisection = function()
{
	this.version = '0.0.3';
	var _this = this;
	this.bisect_right = this.bisect = function(a, x, lo, hi)
	{
		lo || (lo = 0);
		hi || (hi = a.length);
	
		var mid;
		while(lo < hi)
		{
			mid = (lo+hi) >> 1;
			if(x < a[mid]) hi = mid;
			else lo = mid+1;
		}
		return lo;
	};

	this.bisect_left = function(a, x, lo, hi)
	{
		lo || (lo = 0);
		hi || (hi = a.length);
	
		var mid;
		while(lo < hi)
		{
			mid = (lo+hi) >> 1;
			if(a[mid] < x) lo = mid+1;
			else hi = mid;
		}
		return lo;
	};

	this.insort_right = this.insort = function(a, x, lo, hi)
	{
		a.splice(_this.bisect_right(a, x, lo, hi), 0, x);
	};

	this.insort_left = function(a, x, lo, hi)
	{
		a.splice(_this.bisect_left(a, x, lo, hi), 0, x);
	};
}
try{ module.exports = new bisection() }catch(e){}