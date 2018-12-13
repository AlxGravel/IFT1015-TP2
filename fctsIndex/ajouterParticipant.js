var ajouterParticipant = function(sondageId, nom, disponibilites) {

    findSondage(sondageId).participants.push({"nom": parseUserInput(nom),
                                              "disponibilites": disponibilites
                                             });
};
