
var compacterDisponibilites = function() {

    var cal = document.getElementBtId("calendrier");
    var nbHeures = cal.dataset.nbheures;
    var nbJours = cal.dataset.nbjours;

    var dispo = "";
    
    for( var i = 0; i < nbHeures; i++)
	for(var j = 0; j < mbJours; j++){
	    if(document.getElementById(j+"-"+i) == "")
		dispo += "0";
	    else
		dispo += "1";
	}

    return dispo;
};
