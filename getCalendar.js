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
	
	//On créé notre table en suivant le modèle donné dans l'énoncé du TP
	var table = "<table id = \"calendrier\" \n" +
							"onmousedown = \"onClick(event)\" \n" +
							"onmouseover = \"onMove(event)\" \n" +
							"data-nbjours = \"" +
							nbJours +
							"\" data-nbheures = \"" + 
							(+sondage.heureFin - +sondage.heureDebut) +
							"\">"
	
	for(var i = 0; i < nbJours; i++) {
		
		table += "<tr> <th> </th>";
		
		
							
	console.log(+sondage.heureFin - +sondage.heureDebut);
							
	
	
	defaultDoc = defaultDoc.replace( /\{\{titre\}\}/g , sondage.titre).replace(
	/\{\{url\}\}/g, " http://localhost:1337/" + sondage.id);
	
	
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