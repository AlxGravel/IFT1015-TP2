
// Retourne le texte HTML à afficher à l'utilisateur pour voir les
// résultats du sondage demandé
//
// Doit retourner false si le calendrier demandé n'existe pas
var getResults = function (sondageId) {
    // TODO
    var resultsTmp = readFile("template/results.html");

    var sondage = findSondage(sondageId);
    
    var dateDebut = new Date(sondage.dateDebut);
    var dateFin= new Date(sondage.dateFin);
    var nbJours = (dateFin.getTime() - dateDebut.getTime())/MILLIS_PAR_JOUR+1;
    var nbHeures = +sondage.heureFin - +sondage.heureDebut;

 

    //assignation des couleurs aux participants
    var colorTab = [];

    for(var i = 0; i < sondage.participants.length; i++){
	colorTab.push(genColor(i, sondage.participants.length))
    }
    
    //creation du tableau
    //TODO: max et min
    var table = "<table>";

    for(var i = 0; i < nbJours; i++){
	var jour = addDays(dateDebut, i+1)
	table +="<th>"+ jour.getDate() +" "+ mois[jour.getMonth()] +"</th>";
    }
    for(var i = 0; i < nbHeures; i++){
	
	table += "<tr><th>" + (+sondage.heureDebut+i) + "h</th>";
	
	for(var j = 0; j < nbJours; j++) {
	    table += "<td id=\"" + j + "-" + i + "\">";
	    
	    //i*nbJours+j est la position linéaire dans le tableau
	    for(var k = 0; k < sondage.participants.length; k++){
		if(sondage.participants[k].disponibilites
		   .charAt(i*nbJours+j) == '1'){
		    
		    table += "<span style=\"background-color:"+ colorTab[k]
		           + ";color:" + colorTab[k] + "\">.</span>"; 
		}
		    
	    }
	    
	    
	    table += "</td>";
		
	}
	table += "</tr>";
    }
    table += "</table>";

    //creation de la legende
    var legende;
    
    for(var i = 0; i < sondage.participants.length; i++){
	legende += "<li style=\"background-color:" + colorTab[i]
	         + "\">" + sondage.participants[i].nom + "</li>";

    }

    //usage de regex approuvé par un auxiliaire de cours sur Studium
    return resultsTmp.replace(/\{\{titre\}\}/g, sondage.titre)
	             .replace(/\{\{url\}\}/g, 
			      "http://localhost:1337/" + sondage.id 
			      + "/results")
	             .replace(/\{\{table\}\}/g, table)
	             .replace(/\{\{legende\}\}/g, legende);
};

