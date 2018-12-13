'use strict';

var http = require("http");
var fs = require('fs');
var urlParse = require('url').parse;
var pathParse = require('path').parse;
var querystring = require('querystring');

var port = 1337;
var hostUrl = 'http://localhost:'+port+'/';
var defaultPage = '/index.html';

var mimes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
};

// --- Helpers ---
var readFile = function (path) {
    return fs.readFileSync(path).toString('utf8');
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};

// --- Server handler ---
var redirect = function (reponse, path, query) {
    var newLocation = path + (query == null ? '' : '?' + query);
    reponse.writeHeader(302, {'Location' : newLocation });
    reponse.end('302 page déplacée');
};

var getDocument = function (url) {
    var pathname = url.pathname;
    var parsedPath = pathParse(url.pathname);
    var result = { data: null, status: 200, type: null };

    if(parsedPath.ext in mimes) {
        result.type = mimes[parsedPath.ext];
    } else {
        result.type = 'text/plain';
    }

    try {
        result.data = readFile('./public' + pathname);
        console.log('['+new Date().toLocaleString('iso') + "] GET " + url.path);
    } catch (e) {
        // File not found.
        console.log('['+new Date().toLocaleString('iso') + "] GET " +
                    url.path + ' not found');
        result.data = readFile('template/error404.html');
        result.type = 'text/html';
        result.status = 404;
    }

    return result;
};
var sendPage = function (reponse, page) {
    reponse.writeHeader(page.status, {'Content-Type' : page.type});
    reponse.end(page.data);
};

var indexQuery = function (query) {

    var resultat = { exists: false, id: null };

    if (query !== null) {

        query = querystring.parse(query);
        if ('id' in query && 'titre' in query &&
            query.id.length > 0 && query.titre.length > 0) {

            resultat.exists = creerSondage(
                query.titre, query.id,
                query.dateDebut, query.dateFin,
                query.heureDebut, query.heureFin);
        }

        if (resultat.exists) {
            resultat.id = query.id;
        }
    }

    return resultat;
};

var calQuery = function (id, query) {
    if (query !== null) {
        query = querystring.parse(query);
        // query = { nom: ..., disponibilites: ... }
        ajouterParticipant(id, query.nom, query.disponibilites);
        return true;
    }
    return false;
};

var getIndex = function (replacements) {
    return {
        status: 200,
        data: readFile('template/index.html'),
        type: 'text/html'
    };
};


// --- À compléter ---

var listeSondages = [];

var mois = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'
];

var MILLIS_PAR_JOUR = (24 * 60 * 60 * 1000);

//fonctions

// Crée un sondage à partir des informations entrées
//
// Doit retourner false si les informations ne sont pas valides, ou
// true si le sondage a été créé correctement.
/*NEED listSondages; mois;MILLIS_PAR_JOUR*/

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
    var nbJours = (sondage.dateFin.getTime()
                   - sondage.dateDebut.getTime())
                  /MILLIS_PAR_JOUR+1;

    var nbHeures = +sondage.heureFin - +sondage.heureDebut;


    //On créé notre table en suivant le modèle donné dans l'énoncé du TP
    var table = writeTable(sondage);

        //On remplace les accolades par les bonnes choses en utilisant regex
        //(Accepté par un auxiliaire de cours sur Studium)
        defaultDoc = defaultDoc.replace( /\{\{titre\}\}/g , sondage.titre)
                               .replace(/\{\{url\}\}/g,
                                        " http://localhost:1337/"
                                        + sondage.id)
                               .replace(/\{\{table\}\}/g , table);


    return defaultDoc;
};


function writeTable(sondage) {

    //On ajoute 1 au nombre de jours car le dernier et le premier sont inclus
    var nbJours = (sondage.dateFin.getTime()
                   - sondage.dateDebut.getTime())
                 /MILLIS_PAR_JOUR+1;

    var nbHeures = +sondage.heureFin - +sondage.heureDebut;


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
    //les dates durant lesquelles le sondage a lieu.
    for(var i = 0; i < nbJours; i++) {

        var jour = addDays(sondage.dateDebut, i+1);

        table += "<th>" + jour.getDate() + " "
            + mois[jour.getMonth()] + "</th>";

    }

    table+= "</tr>";

    //On crée ensuite une double boucle, car on en aura besoin pour
    //créer les cases de notre tableau. i est pour la rangée, et j la colonne
    for(var i = 0; i < nbHeures; i++) {

        //L'heure sera incrémentée de 1 à chaque fois
        table += "<tr><th>" + (+sondage.heureDebut+i) + "h</th>";

        for(var j = 0; j < nbJours; j++) {

            table += "<td id=\"" + j + "-" + i + "\"></td>";

        }

        table += "</tr>";

    }

    table += "</tr>" + "</table>";

    return table;

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

var creerSondage=function(titre, id, dateDebut, dateFin, heureDebut, heureFin){

    //On commence par vérifier les informations

    var b;

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

// Retourne le texte HTML à afficher à l'utilisateur pour voir les
// résultats du sondage demandé
//
// Doit retourner false si le calendrier demandé n'existe pas
var getResults = function (sondageId) {

    var resultsTmp = readFile("template/results.html");

    var sondage = findSondage(sondageId);

    if(sondage == -1)
	return false;

    var nbJours = (sondage.dateFin.getTime()
                   - sondage.dateDebut.getTime())
                  /MILLIS_PAR_JOUR+1;

    var nbHeures = +sondage.heureFin - +sondage.heureDebut + 1;



    //assignation des couleurs aux participants
    var colorTab = [];

    for(var i = 0; i < sondage.participants.length; i++){
                colorTab.push(genColor(i, sondage.participants.length))
    }

    //creation du tableau
        var table = writeResults(sondage, colorTab);

    //creation de la legende
    var legende = writeLegend(sondage, colorTab);

    //usage de regex approuvé par un auxiliaire de cours sur Studium
    return resultsTmp.replace(/\{\{titre\}\}/g, sondage.titre)
                    .replace(/\{\{url\}\}/g,
                                "http://localhost:1337/" + sondage.id)
                    .replace(/\{\{table\}\}/g, table)
                    .replace(/\{\{legende\}\}/g, legende);
};

function writeResults(sondage, colorTab) {

    var nbJours = (sondage.dateFin.getTime()
                   - sondage.dateDebut.getTime())
                  /MILLIS_PAR_JOUR+1;
    var nbHeures = +sondage.heureFin - +sondage.heureDebut;

    var participantsMax = getMax(sondage);

    var participantsMin = getMin(sondage);

    var table = "<table>" + "<tr>" + "<th></th>";

    for(var i = 0; i < nbJours; i++) {

        var jour = addDays(sondage.dateDebut, i+1);

        table += "<th>" + jour.getDate() + " "
            + mois[jour.getMonth()] + "</th>";

    }

    table += "</tr>";

    for(var i = 0; i < nbHeures; i++) {

        table += "<tr>" + "<th>" + (+sondage.heureDebut + i) +"h</th>";

        for(var j = 0; j < nbJours; j++) {

            var isMax = false, isMin = false;
            var nb = 0;

            for(var k = 0; k < sondage.participants.length; k++){

                if(sondage.participants[k].disponibilites.
                   charAt(i*nbJours+j) == '1')

                    nb++;
            }

            if(nb == participantsMax) isMax = true;
            if(nb == participantsMin) isMin = true;


            table += "<td" + (isMax?" class=\"max\"":"")
                + (isMin?" class=\"min\"":"") + ">";

            //i*nbJours+j est la position linéaire dans le tableau
            for(var k = 0; k < sondage.participants.length; k++){

                if(sondage.participants[k].disponibilites
                   .charAt(i*nbJours+j) == '1'){

                    table += "<span style=\"background-color:"+ colorTab[k] +
                        ";color:" + colorTab[k] + "\">.</span>";

                }

            }

            table+= "</td>";

        }

        table += "</tr>";
    }

    table += "</table>";

    return table;

    console.log("min = " + participantsMin + "\nmax = " + participantsMax);

}

function writeLegend(sondage, colorTab) {

    var legende = "";

    for(var i = 0; i < sondage.participants.length; i++){
        legende += "<li style=\"background-color:" + colorTab[i] +
                    "\">" + sondage.participants[i].nom + "</li>";

    }

    return legende;

}

function getMax(sondage) {

    var max = 0;

    for(var i = 0; i < sondage.participants[0].disponibilites.length; i++) {

        var nb = 0;
        for(var j = 0; j < sondage.participants.length; j++) {

            if( sondage.participants[j].disponibilites.charAt(i) == 1) ++nb;

        }

        if( nb > max ) max = nb;

    }

    return max;
}


function getMin(sondage) {

    var min = 1e10;

    for(var i = 0; i < sondage.participants[0].disponibilites.length; i++) {

        var nb = 0;
        for(var j = 0; j < sondage.participants.length; j++) {

            if( sondage.participants[j].disponibilites.charAt(i) == 1) ++nb;

        }

        if( nb < min ) min = nb;

        }

        return min;
}



//enregistre un nouveau participant pour le sondage "sondageId"
var ajouterParticipant = function(sondageId, nom, disponibilites) {

    findSondage(sondageId).participants.push({"nom": parseUserInput(nom),
                                              "disponibilites": disponibilites
                                             });
};


//retourne une lecture du tableau de disponibilitées
//sous forme de chaine de caractères binaire
//1 pour disponible et 0 pour non disponible
var compacterDisponibilites = function() {

    var cal = document.getElementById("calendrier");
    var nbHeures = cal.dataset.nbheures;
    var nbJours = cal.dataset.nbjours;

    var dispo = "";

    for( var i = 0; i < nbHeures; i++) {
        for(var j = 0; j < nbJours; j++){
            if(document.getElementById(j+"-"+i).innerHTML == "")
                dispo += "0";
            else
                dispo += "1";
        }
    }

    return dispo;
};

//converti une couleur du format 0à1 vers hexadécimal HTML
var colorToHexa = function(color){
    color = Math.floor(color * 255);//conversion decimale
    color = color.toString(16);//conversion hexadecimale

    if(color.length == 1)//ajout d'un 0 si nécessaire
        color = "0" + color;

    return color;
};

// Génère la `i`ème couleur parmi un nombre total `total` au format
// hexadécimal HTML
var genColor = function(i, nbTotal) {

    //application de la formule de l'énoncé
    var teinte = (i/nbTotal) * 360;
    var h = teinte/60;
    var c = 0.7;
    var x = c*(1-Math.abs(h%2-1));

    //conversion au format hexadécimal HTML
    var hexaC = colorToHexa(c);
    var hexaX = colorToHexa(x);

    //retour dans l'ordre fourni dans l'énoncé
    switch(Math.floor(h)){
        case 0:return "#" + hexaC + hexaX + "00";
        case 1:return "#" + hexaX + hexaC + "00";
        case 2:return "#" + "00" + hexaC + hexaX;
        case 3:return "#" + "00" + hexaX + hexaC;
        case 4:return "#" + hexaX + "00" + hexaC;
        case 5:return "#" + hexaC + "00" + hexaX;
        default:return "#000000";
    }
};


/*
 * Création du serveur HTTP
 * Note : pas besoin de toucher au code ici (sauf peut-être si vous
 * faites les bonus)
 */
http.createServer(function (requete, reponse) {
    var url = urlParse(requete.url);

    // Redirect to index.html
    if (url.pathname == '/') {
        redirect(reponse, defaultPage, url.query);
        return;
    }

    var doc;

    if (url.pathname == defaultPage) {
        var res = indexQuery(url.query);

        if (res.exists) {
            redirect(reponse, res.id);
            return;
        } else {
            doc = getIndex(res.data);
        }
    } else {
        var parsedPath = pathParse(url.pathname);

        if (parsedPath.ext.length == 0) {
            var id;

            if (parsedPath.dir == '/') {
                id = parsedPath.base;

                if (calQuery(id, url.query)) {
                    redirect(reponse, '/'+ id + '/results')
                    return ;
                }

                var data = getCalendar(id);

                if(data === false) {
                    redirect(reponse, '/error404.html');
                    return;
                }

                doc = {status: 200, data: data, type: 'text/html'};
            } else {
                if (parsedPath.base == 'results') {
                    id = parsedPath.dir.slice(1);
                    var data = getResults(id);

                    if(data === false) {
                        redirect(reponse, '/error404.html');
                        return;
                    }

                    doc = {status: 200, data: data, type: 'text/html'};
                } else {
                    redirect(reponse, '/error404.html');
                    return;
                }
            }
        } else {
            doc = getDocument(url);
        }
    }

    sendPage(reponse, doc);

}).listen(port);
