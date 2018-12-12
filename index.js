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
    reponse.end('302 page déplacé');
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

// ---- Général ----


var listeSondages = [];

var mois = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'
];

var MILLIS_PAR_JOUR = (24 * 60 * 60 * 1000);


//fonctions générales 

//NEED listSondages; mois;MILLIS_PAR_JOUR







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
	var nbJours = (sondage.dateFin.getTime() - sondage.dateDebut.getTime())/MILLIS_PAR_JOUR+1;
	var nbHeures = +sondage.heureFin - +sondage.heureDebut + 1;
	
	
	//On créé notre table en suivant le modèle donné dans l'énoncé du TP
	var table = writeTable(sondage);
	
	//On remplace les accolades par les bonnes choses en utilisant regex
	//(Accepté par un tpiste sur Studium)
	defaultDoc = defaultDoc.replace( /\{\{titre\}\}/g , sondage.titre).replace(
	/\{\{url\}\}/g, " http://localhost:1337/" + sondage.id).replace(
	 /\{\{table\}\}/g , table);
	
	
    return 'Calendrier <b>' + sondageId + '</b> (TODO)' + defaultDoc;
};


function writeTable(sondage) {
	
	//On ajoute 1 au nombre de jours car le dernier et le premier sont inclus
	var nbJours = (sondage.dateFin.getTime() - sondage.dateDebut.getTime())/MILLIS_PAR_JOUR+1;
	var nbHeures = +sondage.heureFin - +sondage.heureDebut + 1;
	
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
	//les dates durant lequel le sondage a lieu.
	for(var i = 0; i < nbJours; i++) {
		
		var jour = addDays(sondage.dateDebut, i+1);
		
		table += "<th>" + jour.getDate() + " " + mois[jour.getMonth()] + "</th>";
		
	}
		
	table+= "</tr>";
	
	//On créé ensuite une double boucle, car on en aura besoin pour
	//créé les cases de notre tableau. i est pour la rangée, et j la colonne
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






// Retourne le texte HTML à afficher à l'utilisateur pour voir les
// résultats du sondage demandé
//
// Doit retourner false si le calendrier demandé n'existe pas
var getResults = function (sondageId) {
    // TODO
    var resultsTmp = readFile("template/results.html");

    var sondage = findSondage(sondageId);
	
    var nbJours = (sondage.dateFin.getTime() - sondage.dateDebut.getTime())/MILLIS_PAR_JOUR+1;
    var nbHeures = +sondage.heureFin - +sondage.heureDebut + 1;

 

    //assignation des couleurs aux participants
    var colorTab = [];

    for(var i = 0; i < sondage.participants.length; i++){
		colorTab.push(genColor(i, sondage.participants.length))
    }
    
    //creation du tableau
    //TODO: max et min
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

//*******************************************************************************

//Fonctions auxiliaires


function writeResults(sondage, colorTab) {
	
    var nbJours = (sondage.dateFin.getTime() - sondage.dateDebut.getTime())/MILLIS_PAR_JOUR+1;
    var nbHeures = +sondage.heureFin - +sondage.heureDebut;
	
	var participantsMax = getMax(sondage);
	
	var participantsMin = getMin(sondage);
	
	var table = "<table>" + "<tr>" + "<th></th>";
	
	for(var i = 0; i < nbJours; i++) {
		
		var jour = addDays(sondage.dateDebut, i+1);
		
		table += "<th>" + jour.getDate() + " " + mois[jour.getMonth()] + "</th>";
		
	}
	
	table += "</tr>";
	
	for(var i = 0; i < nbHeures; i++) {
		
		table += "<tr>" + "<th>" + (+sondage.heureDebut + i) +"h</th>";
		
		for(var j = 0; j < nbJours; j++) {
			
			var isMax = false, isMin = false;
			var nb = 0;
			
			for(var k = 0; k < sondage.participants.length; k++){
				
				if(sondage.participants[k].disponibilites.charAt(i*nbJours+j) == '1')
					nb++;
			}
			
			if(nb == participantsMax) isMax = true;
			if(nb == participantsMin) isMin = true;
			
			console.log(i + "," + j + ":" + "Max:" + isMax + "\nMin:" + isMin);
			
			table += "<td" + (isMax?" class=\"max\"":"") + (isMin?" class=\"min\"":"") + ">";
			
			//i*nbJours+j est la position linéaire dans le tableau
			for(var k = 0; k < sondage.participants.length; k++){
				
				if(sondage.participants[k].disponibilites.charAt(i*nbJours+j) == '1'){
				
					table += "<span style=\"background-color:"+ colorTab[k] +
					";color:" + colorTab[k] + "\">.</span>";
					   
				}
				
			}
			
			table+= "</td>";
			
		}
		
		table += "</tr>";
	}
	
	table += "</table>";
	
	console.log("min = " + participantsMin + "\nmax = " + participantsMax);
	
	return table;
	
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
	    "dateDebut":new Date(dateDebut), "dateFin":new Date(dateFin),
	    "heureDebut":heureDebut, "heureFin":heureFin,
	    "participants": []
	};
	
	listeSondages.push(sondage);
	
	//Tout s'est déroulé comme prévu, alors on retourne true!
    return true;
};



// Ajoute un participant et ses disponibilités aux résultats d'un
// sondage. Les disponibilités sont envoyées au format textuel
// fourni par la fonction compacterDisponibilites() de public/calendar.js
//
// Cette fonction ne retourne rien
var ajouterParticipant = function(sondageId, nom, disponibilites) {
    // TODO
    var sondage = findSondage(sondageId);

    sondage.participants.push({"nom": nom, "disponibilites": disponibilites});
	
	console.log("Participant " + nom + " ajouté! " + disponibilites );
	
	return;
    
};




var colorToHexa = function(color){
    color = Math.floor(color * 255);
    color = color.toString(16);
    if(color.length == 1) color = "0" + color;

    return color;

};

// Génère la `i`ème couleur parmi un nombre total `total` au format
// hexadécimal HTML
//
// Notez que pour un grand nombre de couleurs (ex.: 250), générer
// toutes les couleurs et les afficher devrait donner un joli dégradé qui
// commence en rouge, qui passe par toutes les autres couleurs et qui
// revient à rouge.
var genColor = function(i, nbTotal) {
    // TODO
    
    var teinte = (i/nbTotal) * 360;
    var h = teinte/60;
    var c = 0.7;
    var x = c*(1-Math.abs(h%2-1));

    var hexaC = colorToHexa(c);
    var hexaX = colorToHexa(x);

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
