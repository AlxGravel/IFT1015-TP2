//NEED listSondages; mois;MILLIS_PAR_JOUR







// Retourne le texte HTML à afficher à l'utilisateur pour répondre au
// sondage demandé.
//
// Doit retourner false si le calendrier demandé n'existe pas
var getCalendar = function (sondageId) {
	
	//On trouve le sondage demandé grâce à notre fonction
	var sondage = findSondage(sondageId);
	
	
	//Si la fonction renvoie -1, on retourne false comme demandé
	if(sondage == -1) return false;
	
	
	var defaultDoc = readFile("template/calendar.html");
	
	//On ajoute 1 au nombre de jours car le dernier et le premier sont inclus
	var nbJours = (sondage.dateFin.getTime() - sondage.dateDebut.getTime())/MILLIS_PAR_JOUR+1;
	var nbHeures = +sondage.heureFin - +sondage.heureDebut;
	
	
	//On créé notre table en suivant le modèle donné dans l'énoncé du TP
	var table = writeTable(sondage);
	
	//On remplace les accolades par les bonnes choses en utilisant regex
	//(Accepté par un tpiste sur Studium)
	defaultDoc = defaultDoc.replace( /\{\{titre\}\}/g , sondage.titre).replace(
	/\{\{url\}\}/g, " http://localhost:1337/" + sondage.id).replace(
	 /\{\{table\}\}/g , table);
	
	
    return 'Calendrier <b>' + sondageId + '</b> (TODO)' + defaultDoc;
};


function writeTable(sondage) {
	
	var table = "<table id = \"calendrier\" \n" +
							"onmousedown = \"onClick(event)\" \n" +
							"onmouseover = \"onMove(event)\" \n" +
							"data-nbjours = \"" +
							nbJours +
							"\" data-nbheures = \"" + 
							(+sondage.heureFin - +sondage.heureDebut) +
							"\">";
							
	table += "<tr><th></th>";
	
	//On commence ici par ajouter la première rangée qui contient
	//les dates durant lequel le sondage a lieu.
	for(var i = 0; i < nbJours; i++) {
		
		var jour = addDays(sondage.dateDebut, i+1);
		
		table += "<th>" + jour.getDate() + " " + mois[jour.getMonth()] + "</th>";
		
	}
		
		table+= "</tr>";
	
	//On créé ensuite une double boucle, car on en aura besoin pour
	//créé les cases de notre tableau. i est pour la rangée, et j la colonne
	for(var i = 0; i < nbHeures; i++) {
		
		//L'heure sera incrémentée de 1 à chaque fois
		table += "<tr><th>" + (+sondage.heureDebut+i) + "h</th>";
		
		for(var j = 0; j < nbJours; j++) {
			
			table += "<td id=\"" + j + "-" + i + "\">" + j + "-" + i + "</td>";
			
		}
		
		table += "</tr>";
		
	}

	table += "</tr>" + "</table>";
		
}
	
	
	
	
	

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


//Ajoute un nombre de jours à une date
function addDays(date, days) {
	
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}