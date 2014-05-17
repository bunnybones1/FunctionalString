var CodeUtils = {
	flattenFlags: function() {
		var OP_REMOVE_WHOLE = 0;
		var OP_UNROLL_CONDITION = 1;
		var BOUND_SEPERATE = 2;
		var BOUND_CONTAINS = 3;
		var BOUND_CONTAINED = 4;
		var BOUND_OVERLAP_ERROR = 5;

		function determineBoundRelationship(a, b){
			if(a[1] < b[0]) return BOUND_SEPERATE;
			if(a[0] < b[0] && b[1] < a[1]) return BOUND_CONTAINS;
			if(b[0] < a[0] && a[1] < b[1]) return BOUND_CONTAINED;
			return BOUND_OVERLAP_ERROR;
		};

		function recursiveBoundHeirachy(instructions) {
			//recursion not implemented yet
			return;	
			for (var i1 = instructions.length - 1; i1 >= 0; i1--) {
				for (var i2 = instructions.length - 1; i2 >= 0; i2--) {
					switch(determineBoundRelationship(
							instructions[i1].bounds, 
							instructions[i2].bounds)
						) {
						case BOUND_CONTAINS:
							break;
						case BOUND_CONTAINED:
							break;
					}
				}
			};
		};
		return function(code, flags) {
			var instructions = [];
			//console.log(flags);
			for(var key in flags) {
				//console.log(key);
				var bounds = this.findBoundsOfIfBlock(code, key);
				for (var i = 0; i < bounds.length; i++) {
					var operation = flags[key] ? OP_UNROLL_CONDITION : OP_REMOVE_WHOLE;
					instructions.push({
						flag:key,
						operation:operation,
						bounds:bounds[i]
					});
				}
				/*
				for (var i = 0; i < bounds.length; i++) {
					console.log(code.substring(bounds[i][0], bounds[i][1]+1));
				};
				*/
			};
			//heirarchy
			instructions.sort(function(a, b) { return a.bounds[1] - b.bounds[1]});
			//console.log(instructions);

			for (var i = instructions.length - 1; i >= 0; i--) {
				var instruction = instructions[i];
				var bounds = instruction.bounds;
				var ifDefString = "if("+instruction.flag+") {";
				switch(instruction.operation) {
					case OP_UNROLL_CONDITION:
						code = code.substring(0, bounds[0])
							+ code.substring(bounds[0] + ifDefString.length, bounds[1])
							+ code.substring(bounds[1] + 1, code.length);
						break;
					case OP_REMOVE_WHOLE:
						code = code.substring(0, bounds[0])
							+ code.substring(bounds[1] + 1, code.length);
						break;
				}
			};
			return code;
		}
	}(),
	findBoundsOfIfBlock: function(code, defString) {
		buffer = code;
		var ifDefString = "if("+defString+") {";
		var bounds = [];
//		console.log(ifDefString);
		var offset = 0;
		while(buffer.indexOf(ifDefString) != -1) {
			var indexOfStart = buffer.indexOf(ifDefString);
			buffer = buffer.substring(indexOfStart, buffer.length);
			var indexOfEnd = this.findEndOfBlock(buffer);
//			console.log("found one", ifDefString);
			bounds.push([indexOfStart + offset, indexOfStart + indexOfEnd + offset + 1]);
			offset += indexOfStart;
			buffer = buffer.substring(indexOfEnd, buffer.length);
			offset += indexOfEnd;
		}
		return bounds;
	},
	findEndOfBlock: function(code) {
		var depthCount = 0;
		var indexCut = 0;
		var indexOfEnd = 0;
		var step = function() {
			var indexUp = code.indexOf("{");
			var indexDown = code.indexOf("}");
			if(indexUp == -1) indexUp = 10000000;
			if(indexDown == -1) indexDown = 10000000;

			if(indexUp < indexDown) {
				//console.log("UP");
				indexCut = indexUp;
				depthCount++;
			} else if(indexUp > indexDown) {
				//console.log("DOWN");
				indexCut = indexDown;
				depthCount--;
			} else {
				depthCount = -1;
			}
			indexOfEnd += indexCut;
			code = code.substring(indexCut+1, code.length);
		}

		step();
		while(depthCount > 0) step();
		if(depthCount == -1) throw("ERROR: code is malformed. Could not find closing }.");
		return indexOfEnd;
	}
}
module.exports = CodeUtils;