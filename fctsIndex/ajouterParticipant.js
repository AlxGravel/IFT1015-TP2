var ajouterParticipant = function(sondageId, nom, disponibilites) {
    // TODO
    var sondage = findSondage(sondageId);

    sondage.participants.push({"nom": nom, "disponibilites": disponibilites});
	
	return;
};
