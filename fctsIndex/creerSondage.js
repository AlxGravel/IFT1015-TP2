//NEEDED var listeSondages = []; var MILLIS_PAR_JOUR = (24 * 60 * 60 * 1000);




// Crée un sondage à partir des informations entrées
//
// Doit retourner false si les informations ne sont pas valides, ou
// true si le sondage a été créé correctement.
var creerSondage = function(titre, id, dateDebut, dateFin, heureDebut, heureFin) {
    // TODO(BONUS)
	
	//On commence par vérifier les informations
	
	var b = document.getElementById("error");
	
	b.innerHTML = "";
	
	if ( !(/^[a-zA-Z0-9\-]+$/.test(id) ) ) {
		b += "Veuillez entrer un id valide\n";
		return false;
	}
	
	if ( +heureDebut > +heureFin ) {
		b += "L'heure de fin doit être plus grande que l'heure de début!\n";
		return false;
	}
	
	if ( dateFin - dateDebut < 0 ) {
		b += "La date de fin doit être plus grande que la date de début!\n";
		return false;
	}
	
	if ( dateFin - dateDebut > 30*MILLIS_PAR_JOUR ) {
		b += "L'étendue maximale d'un sondage est de 30 jours";
		return false;
	}
	
	
	//On veut ensuite créer le sondage et l'ajouter à notre liste.
	var sondage = {
	    "titre":parseUserInput(titre), "id":parseUserInput(id),
	    "dateDebut":new Date(dateDebut), "dateFin":new Date(dateFin),
	    "heureDebut":heureDebut, "heureFin":heureFin,
	    "participants": []
	};
	
	listeSondages.push(sondage);
	
	//Tout s'est déroulé comme prévu, alors on retourne true!
    return true;
};
