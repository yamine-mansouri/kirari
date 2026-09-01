# Publier Kirari

Deux paquets avancent ensemble, `@kirari-ds/core` et `@kirari-ds/react`, sur
un même numéro de version. `react` déclare `core` en peer dependency : leurs
versions ne doivent jamais diverger.

Une version publiée ne se retire pas vraiment. Tout ce qui suit part de là.

---

## Réglages, une fois pour toutes

### 1. Le jeton npm

Les jetons « classiques » sont dépréciés. Sur npmjs.com → **Access Tokens** →
**Generate New Token** → **Granular Access Token** :

| | |
|---|---|
| Nom | `kirari — GitHub Actions` |
| Expiration | 90 jours |
| Permissions | Read and write |
| Portée | les deux paquets `@kirari-ds/*` |

Puis dans le dépôt → **Settings** → **Secrets and variables** → **Actions** →
secret `NPM_TOKEN`.

L'expiration est le prix à payer : le jeton meurt tous les trois mois et la
publication échoue jusqu'au renouvellement. Voir plus bas comment s'en
débarrasser définitivement.

### 2. L'environnement de publication

Dépôt → **Settings** → **Environments** → **New environment**, nommé `npm`.

Le workflow y est rattaché. Y ajouter **Required reviewers** avec soi-même
donne un dernier point d'arrêt : le job attend une approbation avant
d'envoyer quoi que ce soit sur le registre. Pour une action irréversible,
ça vaut les dix secondes.

### 3. Se débarrasser du jeton — trusted publishing

npm sait authentifier un workflow GitHub par OIDC, sans jeton stocké. Sur la
page du paquet → **Settings** → **Trusted Publisher**, déclarer le dépôt et
`publish.yml`. Une fois les deux paquets configurés, supprimer `NPM_TOKEN` et
la ligne `NODE_AUTH_TOKEN` du workflow.

Ça ne se fait qu'**après** la première publication : la page de réglages
n'existe pas tant que le paquet n'existe pas.

---

## Publier une version

### 1. Choisir le numéro

Tant que la majeure est à zéro, l'API peut changer sur une mineure.

| | |
|---|---|
| `0.1.0` → `0.1.1` | corrections, documentation |
| `0.1.0` → `0.2.0` | nouveaux composants, nouveaux tokens, rupture d'API |

Une rupture se signale dans le CHANGELOG, même en `0.x`.

### 2. Poser la version et le journal

Depuis une branche dédiée, jamais sur `main` :

```bash
git checkout -b release/0.2.0
pnpm --filter @kirari-ds/core --filter @kirari-ds/react \
  exec npm version 0.2.0 --no-git-tag-version
```

Ouvrir `CHANGELOG.md`, ajouter la section de la version. Puis PR, CI verte,
merge.

### 3. Poser le tag

```bash
git checkout main && git pull
git tag v0.2.0
git push origin v0.2.0
```

Le tag déclenche le workflow **Publication**. Il rejoue toutes les
vérifications, contrôle que le tag correspond aux versions des deux paquets,
empaquette avec pnpm et envoie avec npm.

### 4. Vérifier

```bash
npm view @kirari-ds/core version
npm view @kirari-ds/react version
```

Et l'installation réelle, dans un dossier vide :

```bash
npm i @kirari-ds/core @kirari-ds/react tailwindcss
```

---

## Première publication, à la main

Le workflow ne peut pas servir au premier tour : le trusted publishing se
configure sur un paquet qui existe déjà, et on veut voir de nos yeux ce qui
part.

```bash
npm login
npm whoami

# les noms sont-ils libres ?
npm view @kirari-ds/core   # 404 attendu
npm view @kirari-ds/react  # 404 attendu

# ce qui partira, sans rien envoyer
pnpm --filter @kirari-ds/core publish --dry-run
pnpm --filter @kirari-ds/react publish --dry-run

# pour de vrai — core d'abord, react en dépend
pnpm --filter @kirari-ds/core publish
pnpm --filter @kirari-ds/react publish

git tag v0.1.0 && git push origin v0.1.0
```

`prepublishOnly` reconstruit les deux paquets avant l'envoi : pas de `dist/`
périmé.

Le tag déclenchera le workflow, qui constatera que les deux versions sont
déjà sur le registre et les ignorera. C'est voulu — l'envoi est idempotent.

---

## Rattraper une mauvaise version

**Dans les 72 heures**, si rien ne dépend du paquet :

```bash
npm unpublish @kirari-ds/core@0.2.0
```

Compter une minute ou deux avant que le registre se mette à jour. Et le
numéro reste brûlé : `0.2.0` ne pourra plus jamais être republié. Passer à
`0.2.1`.

**Au-delà**, la dépublication reste possible si personne ne dépend du paquet,
moins de 300 téléchargements sur la semaine, et un seul mainteneur. Sinon, la
voie normale est de déprécier et de corriger :

```bash
npm deprecate @kirari-ds/core@0.2.0 "Version cassée, utiliser 0.2.1"
```

La version reste installable — c'est le point : on n'arrache pas le tapis
sous les pieds de qui l'a déjà installée. L'avertissement s'affiche à
l'installation.

---

## Ce qui a déjà mordu

Deux défauts trouvés en montant un vrai projet consommateur depuis les
archives, la veille de la première publication. Aucun des deux ne faisait
échouer quoi que ce soit.

**Le protocole `workspace:`.** `@kirari-ds/react` déclare
`@kirari-ds/core@workspace:^` en peer. `pnpm pack` le réécrit en `^X.Y.Z` ;
`npm publish` ne le fait pas. C'est pourquoi le workflow empaquette avec pnpm
et n'envoie que l'archive.

**Le scan Tailwind.** Un `@source` déclaré dans le paquet ne résiste pas à la
disposition de pnpm. C'est au projet consommateur de le déclarer, et c'est
documenté dans `AGENTS.md`.

La leçon vaut plus que les deux correctifs : depuis le monorepo, tout est
déjà câblé, et ces pannes sont invisibles. **Avant une version qui touche à
l'empaquetage, monter un projet neuf depuis les `.tgz`** — `pnpm pack`, puis
installer l'archive dans un dossier vide, compiler, regarder.
