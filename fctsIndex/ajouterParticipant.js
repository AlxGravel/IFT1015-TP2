//enregistre un nouveau participant pour le sondage "sondageId"
var ajouterParticipant = function(sondageId, nom, disponibilites) {

    findSondage(sondageId).participants.push({"nom": parseUserInput(nom),
                                              "disponibilites": disponibilites
                                             });
};
