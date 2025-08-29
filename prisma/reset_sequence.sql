-- Vérifier le nom de la séquence
SELECT pg_get_serial_sequence('enquete', 'id') as sequence_name;

-- Réinitialiser la séquence à 7500
SELECT setval(pg_get_serial_sequence('enquete', 'id'), 7499, false);
