/**
 The AWB Resume Service

 This web service requires Node.js and the Restify.js plugin.

 2012.02.05 andy@awbsoftware.com
**/
var restify = require('restify');
var resume = require('./awb-resume.js').resume;

function usage(req, res, next) {
    var routes = [
        'GET     /',
        'GET     /resume/:name',
        'GET     /resume/:name/contact',
        'GET     /resume/:name/positions',
        'GET     /resume/:name/positions/:id',
        'GET     /resume/:name/patents',
        'GET     /resume/:name/degrees',
    ];
    res.send(200, routes);
    next();
}

function respond(req, res, next) {
    console.log(req.params);
    
    var name = req.params.name;
    var section = req.params.section;
    var id = req.params.id;
    if (name != 'awb') {
	return new restify.ResourceNotFoundError("No resume for \'' + name + '\'.");
    }

    if (typeof section == "undefined" || !section){
	console.log('whole resume');
	res.json(resume);

    } else {
	if (!resume.hasOwnProperty(section) ) {
	    return new restify.ResourceNotFoundError("No section \'' + section + '\' available.");
	} else {
	    if (typeof id == "undefined" || !id) {
		console.log("whole section '" + section + "'.");
		res.json(resume[section]);	    
	    } else {
		if (!resume[section].hasOwnProperty(id)) {
		    return new restify.ResourceNotFoundError("No object in '" + section + "' with id '" + id + "'.");
		} else {
		    console.log("section '" + section + "["+ id + "]'");
		    res.json(resume[section][id]);
		}
	    }
	}
    }
    return next();
}

function badNameErr(name) {
    return new restify.ResourceNotFoundError("No resume for \'' + name + '\'.");
}

var server = restify.createServer();
server.use(restify.queryParser());
server.get('/resume/:name/:section/:id', respond);
server.get('/resume/:name/:section', respond);
server.get('/resume/:name', respond);
//server.get('/resume/:name/:section/:id', function(req, res, next) { return next(resume[req.params.section][req.params.id]); });
//server.get('/resume/:name/:section', function(req, res, next) { return next(resume[req.params.section]); });
//server.get('/resume/:name', function(req, res, next) { return next(resume); });

// Default handler for '/'
server.get('/', usage);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
    //console.log(JSON.stringify(resume.contact,null,' '));
});
