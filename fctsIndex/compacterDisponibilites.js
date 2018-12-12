
var compacterDisponibilites = function() {

    var cal = document.getElementById("calendrier");
    var nbHeures = cal.dataset.nbheures;
    var nbJours = cal.dataset.nbjours;

    var dispo = "";
    
    for( var i = 0; i < nbHeures; i++) {
		
		for(var j = 0; j < nbJours; j++){
			if(document.getElementById(j+"-"+i).innerHTML == "")
			dispo += "0";
			else
			dispo += "1";
		}
		
	}

    return dispo;
};
