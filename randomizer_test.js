let performance = require('perf_hooks').performance
let SR = require('./seeded_randomizers.js')
let aSeed = Date.now()

let RANGE = 1000
let COUNT = 150000

console.log('Seed:' + aSeed)
for (g of SR.RNGS) {
	console.log('__________________')
	console.log('Testing '+g.name)
	
	let RNGenerator = g()
	RNGenerator.seed(aSeed)
	let generated = []
	
	let t0 = performance.now()
	for (let z=0; z<COUNT; z++) {
		generated.push(SR.randomInt(RNGenerator.random, 0, RANGE))
	}
	let t1 = performance.now()
	
	let repeated = []
	for (let z=0; z<RANGE;z++) {
		repeated.push(generated.filter(x=>x == z).length)
	}
	console.log('Max repetitions:', Math.max(...repeated))
	console.log('Min repetitions:', Math.min(...repeated))
	console.log('AVG repetitions:', repeated.reduce((a, b) => a + b, 0)/RANGE)
	console.log('Time: ', t1-t0)
}
