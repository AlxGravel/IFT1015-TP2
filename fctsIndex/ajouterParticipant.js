var ajouterParticipant = function(sondageId, nom, disponibilites) {
    // TODO
    var sondage = findSondage(sondageId);

    sondage.particpants.push({"nom": nom, "disponibilites": disponibilites});
    
};
