// Retourne le texte HTML à afficher à l'utilisateur pour voir les
// résultats du sondage demandé
//
// Doit retourner false si le calendrier demandé n'existe pas
var getResults = function (sondageId) {
    // TODO
    var resultsTmp = readFile("template/results.html");

    var sondage = findSondage(sondageId);

    var nbJours = (sondage.dateFin.getTime()
		   - sondage.dateDebut.getTime())
                  /MILLIS_PAR_JOUR+1;

    var nbHeures = +sondage.heureFin - +sondage.heureDebut + 1;



    //assignation des couleurs aux participants
    var colorTab = [];

    for(var i = 0; i < sondage.participants.length; i++){
		colorTab.push(genColor(i, sondage.participants.length))
    }

    //creation du tableau
    //TODO: max et min
	var table = writeResults(sondage, colorTab);

    //creation de la legende
    var legende = writeLegend(sondage, colorTab);

    //usage de regex approuvé par un auxiliaire de cours sur Studium
    return resultsTmp.replace(/\{\{titre\}\}/g, sondage.titre)
	            .replace(/\{\{url\}\}/g,
				"http://localhost:1337/" + sondage.id)
	            .replace(/\{\{table\}\}/g, table)
	            .replace(/\{\{legende\}\}/g, legende);
};

//*************************************************************************

//Fonctions auxiliaires


function writeResults(sondage, colorTab) {

    var nbJours = (sondage.dateFin.getTime()
		   - sondage.dateDebut.getTime())
                  /MILLIS_PAR_JOUR+1;
    var nbHeures = +sondage.heureFin - +sondage.heureDebut;

    var participantsMax = getMax(sondage);

    var participantsMin = getMin(sondage);

    var table = "<table>" + "<tr>" + "<th></th>";

    for(var i = 0; i < nbJours; i++) {

	var jour = addDays(sondage.dateDebut, i+1);

	table += "<th>" + jour.getDate() + " "
	    + mois[jour.getMonth()] + "</th>";

    }

    table += "</tr>";

    for(var i = 0; i < nbHeures; i++) {

	table += "<tr>" + "<th>" + (+sondage.heureDebut + i) +"h</th>";

	for(var j = 0; j < nbJours; j++) {

	    var isMax = false, isMin = false;
	    var nb = 0;

	    for(var k = 0; k < sondage.participants.length; k++){

		if(sondage.participants[k].disponibilites.
		   charAt(i*nbJours+j) == '1')

		    nb++;
	    }

	    if(nb == participantsMax) isMax = true;
	    if(nb == participantsMin) isMin = true;


	    table += "<td" + (isMax?" class=\"max\"":"")
		+ (isMin?" class=\"min\"":"") + ">";

	    //i*nbJours+j est la position linéaire dans le tableau
	    for(var k = 0; k < sondage.participants.length; k++){

		if(sondage.participants[k].disponibilites
		   .charAt(i*nbJours+j) == '1'){

		    table += "<span style=\"background-color:"+ colorTab[k] +
			";color:" + colorTab[k] + "\">.</span>";

		}

	    }

	    table+= "</td>";

	}

	table += "</tr>";
    }

    table += "</table>";

    return table;

    console.log("min = " + participantsMin + "\nmax = " + participantsMax);

}

function writeLegend(sondage, colorTab) {

    var legende = "";

    for(var i = 0; i < sondage.participants.length; i++){
	legende += "<li style=\"background-color:" + colorTab[i] +
	    "\">" + sondage.participants[i].nom + "</li>";

    }

    return legende;

}

function getMax(sondage) {

    var max = 0;

    for(var i = 0; i < sondage.participants[0].disponibilites.length; i++) {

	var nb = 0;
	for(var j = 0; j < sondage.participants.length; j++) {

	    if( sondage.participants[j].disponibilites.charAt(i) == 1) ++nb;

	}

	if( nb > max ) max = nb;

    }

    return max;
}


function getMin(sondage) {

    var min = 1e10;

    for(var i = 0; i < sondage.participants[0].disponibilites.length; i++) {

	var nb = 0;
	for(var j = 0; j < sondage.participants.length; j++) {

	    if( sondage.participants[j].disponibilites.charAt(i) == 1) ++nb;

	}

	if( nb < min ) min = nb;

	}

	return min;
}
