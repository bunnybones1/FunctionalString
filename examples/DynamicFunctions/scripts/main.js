var total = 100000;
var timesToRun = 1000;

//hypothetical setting
var _config = {
	hypothetical: {
		amount: 10
	}
}


/*
This is the Function to optimize.
DEF_1, DEF_2 and DEF_3 are treated kindof like c++'s #ifdef
 */
var DEF_1 = true;
var DEF_2 = false;
var DEF_3 = false;

var work1 = function(){
	var mat = Math.random();
	for (var i = 0; i < total; i++) {
		if(DEF_1) {
			mat *= _config.hypothetical.amount * Math.random() * .01;
		}
		if(DEF_2) {
			mat /= _config.hypothetical.amount * Math.random() * .02;
		}
		if(DEF_3) {
			mat *= Math.pow(_config.hypothetical.amount * Math.random() * .03, 3);
		}
		if(DEF_1) {
			mat *= _config.hypothetical.amount * Math.random() * .04;
		}
	};
};



/*
Original Function
 */
var timeBefore = new Date;
for (var i = timesToRun; i >= 0; i--) {
	work1();
}
var timeAfter = new Date;
console.log("Original function: " + (timeAfter - timeBefore) + "ms");

var workBody = work1.toString();
var workBody = workBody.substring(workBody.indexOf("{")+1, workBody.lastIndexOf("}"));



/*
Dynamic Function (unmodified)
 */
var work2 = new Function(workBody);

var timeBefore = new Date;
for (var i = timesToRun; i >= 0; i--) {
	work2();
}
var timeAfter = new Date;
console.log("Dynamic function: " + (timeAfter - timeBefore) + "ms");



/*
Dynamic Function (swap static values);
 */
workBody = FUNCTIONALSTRING.StringUtils.replaceAll(workBody, "_config.hypothetical.amount", _config.hypothetical.amount);

//preview the modified work function
//console.log(workBody);
var work3 = new Function(workBody);

var timeBefore = new Date;
for (var i = timesToRun; i >= 0; i--) {
	work3();
}
var timeAfter = new Date;
console.log("Dynamic modified function: " + (timeAfter - timeBefore) + "ms");



/*
Dynamic Function (#ifdef style optimization)
 */
workBody = FUNCTIONALSTRING.CodeUtils.flattenFlags(workBody, 
	{
		DEF_1: DEF_1,
		DEF_2: DEF_2,
		DEF_3: DEF_3
	}
);

//preview the modified work function
//console.log(workBody);
var work4 = new Function(workBody);

var timeBefore = new Date;

for (var i = timesToRun; i >= 0; i--) {
	work4();
}
var timeAfter = new Date;
console.log("Dynamic super modified function: " + (timeAfter - timeBefore) + "ms");