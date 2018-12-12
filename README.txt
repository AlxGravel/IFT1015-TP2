=====MESSAGE D'ERREUR=====

====FAILLES DE SÉCURITÉS====

1- XSS

On a corrigé le cross-site scripting en créant une fonction
parseUserInput qui filtre les <, > et " entrées par un utilisateur
dans tous les champs où il peut entrer du texte (soit le titre
et le nom du sondage, et le nom du participant).

