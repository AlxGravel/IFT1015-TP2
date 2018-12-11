//NEED listSondages; mois;







// Retourne le texte HTML à afficher à l'utilisateur pour répondre au
// sondage demandé.
//
// Doit retourner false si le calendrier demandé n'existe pas
var getCalendar = function (sondageId) {
    // TODO
	var sondage = findSondage(sondageId);
	
	var defaultDoc = readFile("template/calendar.html");
	
	//On recréé les dates car elles ont mal été enregistrées
	//(Va savoir pourquoi)
	var dateDebut = new Date(sondage.dateDebut);
	var dateFin= new Date(sondage.dateFin);
	
	var nbJours = (dateFin-dateDebut)/MILLIS_PAR_JOUR;
	
	var nbHeures = +sondage.heureFin - +sondage.heureDebut;
	
	//On créé notre table en suivant le modèle donné dans l'énoncé du TP
	var table = "<table id = \"calendrier\" \n" +
							"onmousedown = \"onClick(event)\" \n" +
							"onmouseover = \"onMove(event)\" \n" +
							"data-nbjours = \"" +
							nbJours +
							"\" data-nbheures = \"" + 
							(+sondage.heureFin - +sondage.heureDebut) +
							"\">"

	table += "<tr><th></th>";
	
	var date = parseDate(sondage.dateDebut);
	
	for(var i = 0; i < nbJours; i++) {
		
		var jour = date[2]+i;
		
		table += "<th>" + jour + " " + mois[ date[1]-1 ] + "</th>";
		
	}
	
	table+= "</tr>";
	
	
	for(var i = 0; i < nbHeures; i++) {
		
		table += "<tr><th>" + (sondage.heureDebut+i) + "</th>";
		
		for(var j = 0; i < nbJours; i++) {
			
			table += "<td id=\"" + j + "-" + i + "\">" + j + "-" + i + "</td>";
			
		}
		
		table += "</tr>"
		
	}

	table += "</tr>";
							
	table += "</table>";
	
	
	
	defaultDoc = defaultDoc.replace( /\{\{titre\}\}/g , sondage.titre).replace(
	/\{\{url\}\}/g, " http://localhost:1337/" + sondage.id).replace(
	 /\{\{table\}\}/g , table);
	
	
    return 'Calendrier <b>' + sondageId + '</b> (TODO)' + defaultDoc;
};


//Retourne la position dans la liste de sondages
//du sondage demandé
function findSondage(sondageId) {
	
	//On cherche l'id du sondage parmi notre liste de sondages
	for(var i = 0; i < listeSondages.length; i++) {
		
		if( listeSondages[i].id == sondageId ) return listeSondages[i];
		
	}
	
	console.log("Sondage " + sondageId + " introuvable dans la liste!");
	return -1;

}


//Sépare une date de format "aaaa-mm-jj" en un tableau ["aaaa","mm","jj"]
function parseDate(date) {
	
	return date.split("-");

}