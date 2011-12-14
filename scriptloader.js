/**
 * 
 * ScriptLoader is a simple JavaScript loader utility API which downloads scripts 
 * in parallel with other resources along with maintaining execution order. 
 * 
 * The parallelism is achieved using the script DOM element technique (i.e. 
 * creating dynamic scripts and inserting them in DOM) and for execution order
 * a code massaging build time step is needed. 
 * 
 * The extra step is to wrap the entire JS code (for which execution order should
 * be maintained) in a wrapper function and passing that function in the API, as
 * shown below
 * 
 * var wrappedFn = function () {
 * 	// All the application JS code
 * };
 *
 * @function loadScript
 * @param fileList {Array|String} Array of JSON objects or the URL string
 * 					JSON object format { url:  'http://one.js', delayedExec:  false },
 * 									   { url:  'http://two.js', delayedExec:  'wrappedFn' }, 
 * @param callback {function} the callback function to be executed after the scripts are
 * 							  loaded
 * 
 */
function loadScript(fileList, callBack) {
    // Type conversion of fileList parameter if not an Array
	fileList = (Array.isArray && Array.isArray(fileList)) || Object.prototype.toString.call(fileList) === "[object Array]" ? fileList : [fileList];
    
	var count = 0, 
    	i = 0, 
    	len = fileList.length, 
    	obj = (typeof fileList[i] === "object"), 
    	scriptObj, 
    	headObj = document.documentElement.firstChild,
    	file,
    	done = function (idx) {
	    	if (obj) {
	    		fileList[idx].done = true;
	            for (var j = 0; j < len; j++) {
	            	/* Check if the dependent files are downloaded and executed else just break the loop */
	            	if (!fileList[j].done) {
	            		break;
	            	}
	                // Call the delayed execution wrapper function if any              
	            	fileList[j].delayedExec && fileList[j]["delayedExec"](); 
	            }
	    	}
	    	if (++count == len && callBack) {
	    		callBack();
	    	}
	    };
	
    for(;i < len; i++) {
		file = fileList[i];
		scriptObj = document.createElement("script"); // Creating script element
		scriptObj.type = "text/javascript";
		scriptObj.async = true;
        if (scriptObj.readyState) { // For IE
        	// Passing idx as closure to done function to know the order of the loaded JS
        	scriptObj.onreadystatechange = function (idx) {
        		return function () {
        			var state = this.readyState;
        			if (state == "loaded" || state == "complete" || state == "completed") {
        				this.onreadystatechange = null;
                            done(idx);
        			}
        		};
        	}(i);
        } else { // For all other browsers
        	// Passing idx as closure to done function to know the order of the loaded JS
        	scriptObj.onload = function (idx) {
        		return function () {
        			done(idx);
        		};
        	}(i);
        }
        scriptObj.src = file.url || file;
        headObj.appendChild(scriptObj);
    }
};
