# Migrations Alembic

Le backend fonctionne maintenant avec `AUTO_CREATE_TABLES=false` par defaut.

## Base neuve

Depuis le dossier `backends` :

```bash
alembic upgrade head
```

Avec Docker :

```bash
docker compose exec backend alembic upgrade head
```

## Base existante creee avant Alembic

Si les tables existent deja parce qu'elles ont ete creees via `create_all`, il ne faut pas lancer `upgrade head` tout de suite.
Il faut d'abord marquer la base comme deja synchronisee avec la migration initiale :

```bash
alembic stamp 20260422_0001
```

Avec Docker :

```bash
docker compose exec backend alembic stamp 20260422_0001
```

Ensuite, les prochaines evolutions de schema se feront normalement avec `upgrade head`.

## Nouveau changement de schema

1. Generer une migration :

```bash
alembic revision --autogenerate -m "description_du_changement"
```

2. Verifier le contenu genere.

3. Appliquer la migration :

```bash
alembic upgrade head
```

## Migration initiale

La premiere migration de reference est :

- revision: `20260422_0001`
- fichier: `backends/alembic/versions/20260422_0001_initial_schema.py`

## Migration type de signature + OTP

Le cas d'usage "definir type signature" ajoute une deuxieme migration :

- revision: `20260422_0002`
- fichier: `backends/alembic/versions/20260422_0002_signature_type_and_otp.py`

Pour recuperer a la fois le schema initial et les champs OTP, applique simplement :

```bash
alembic upgrade head
```
