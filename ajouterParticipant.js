var ajouterParticipant = function(sondageId, nom, disponibilites) {
    // TODO
    var sondage = findSondage(sondageId);

    sondage.particpants.push({"nom": nom, "disponibilites": disponibilites});
    
};
//NB: il faut ajoutter à la fonction créer sondage le champ participant
//    qui contient un tableau avec tous les participants dedans
