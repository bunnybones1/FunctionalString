/**
 * ShortSword is a research tool for:
 * Taking a function and stringifying it, and functionifying it again.
 * processing the string:
 * 		- swap variables for literal values
 * 		- remove if(DEF_SOMEFLAG) conditionals, to streamline the function if they're tru and completely erasing their content if they are false.
 * 		- whatever else you want to do to the function as a string
 * reinterpreting the string as a function and replacing its original
 * the goal is to:
 * 		- see what kind of runtime optimizations you can come up with
 * 		- see how well dynamic functions are optimized by different browsers
 */

FUNCTIONALSTRING = {
	StringUtils : require('./utils/String'),
	CodeUtils : require('./utils/Code')
}