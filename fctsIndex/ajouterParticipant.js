var ajouterParticipant = function(sondageId, nom, disponibilites) {
    // TODO
    var sondage = findSondage(sondageId);

    sondage.participants.push({"nom": parseUserInput(nom), "disponibilites": disponibilites});
	
	return;
};
