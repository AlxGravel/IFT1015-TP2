'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // TODO: Ajoutez ici du code qui doit s'exécuter au chargement de
    // la page
});

function onClick(event) {

    /* La variable t contient l'élément HTML sur lequel le clic a été
       fait. Notez qu'il ne s'agit pas forcément d'une case <td> du
       tableau */
    var t = event.target;

    //TODO: target not <td>

    // Attribut id de l'élément sur lequel le clic a été fait
    var id = t.id;

	var b = document.getElementById(id);
	
	//Si l'id de l'objet cliqué est celui d'une case
	//alors on procède. Sinon rien ne se produit
	if( /\d-\d/.test(id) ) {
		if(b.innerHTML == "") b.innerHTML = "&#10004";
		else b.innerHTML = "";
	}   
}




function onMove(event) {
    // TODO

    var t = event.target;
    var id = t.id;
}

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
