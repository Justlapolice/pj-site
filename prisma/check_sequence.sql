-- Vérifier les séquences existantes
SELECT sequence_name 
FROM information_schema.sequences 
WHERE sequence_schema = 'public';

-- Vérifier la structure de la table enquete
SELECT column_name, column_default 
FROM information_schema.columns 
WHERE table_name = 'enquete';
