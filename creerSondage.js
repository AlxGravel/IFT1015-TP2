//NEEDED var listeSondages = []; var MILLIS_PAR_JOUR = (24 * 60 * 60 * 1000);




// Crée un sondage à partir des informations entrées
//
// Doit retourner false si les informations ne sont pas valides, ou
// true si le sondage a été créé correctement.
var creerSondage = function(titre, id, dateDebut, dateFin, heureDebut, heureFin) {
    // TODO(BONUS)
	
	//On commence par vérifier les informations
	
	if ( !(/^[a-zA-Z0-9\-]+$/.test(id) ) ) return false;
	
	if ( +heureDebut > +heureFin ) return false;
	
	if ( dateFin - dateDebut < 0 ) return false;
	
	if ( dateFin - dateDebut > 30*MILLIS_PAR_JOUR ) return false;
	
	
	//On veut ensuite créer le sondage et l'ajouter à notre liste.
	var sondage = {
	    "titre":titre, "id":id,
	    "dateDebut":dateDebut, "dateFin":dateFin,
	    "heureDebut":heureDebut, "heureFin":heureFin,
	    "participants": []
	};
	
	listeSondages.push(sondage);
	
	//Tout s'est déroulé comme prévu, alors on retourne true!
    return true;
};
