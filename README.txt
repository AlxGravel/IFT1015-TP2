=====MESSAGE D'ERREUR=====
Pour que le message d'erreur soit affiché correctement, on a du tester
les différentes erreurs et renvoyer des résultats différents selon
l'erreur dans la fonction creerSondage. On a donc remplacé la ligne
if(resultat.exists) par if(resultat.exists > 0) dans la fonction 
indexQuery.

====FAILLES DE SÉCURITÉS====

1- XSS

On a corrigé le cross-site scripting en créant une fonction
parseUserInput qui filtre les <, > et " entrées par un utilisateur
dans tous les champs où il peut entrer du texte (soit le titre
et le nom du sondage, et le nom du participant). Lorsqu'on 

