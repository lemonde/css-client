# css-client

Framework css des itégrateur du Monde.fr

## Comment travailler ?

1) Clonner le projet

```bash
git clone git@github.com:lemonde/css-client.git
```

2) Installer les dépendances

```bash
cd css-client && npm install
````

3) Compiler les css

```bash
gulp css-client:compile-all
```

4) Développer 

```bash
gulp css-client:watch
```

Les fichiers compiler se trouve dans le dossier /build-css-customer à la racine du projet.

Une fois le développement terminer, il vous suffit de faire une release pour l'utiliser dans un projet.


## Utiliser le projet

### 1 - Sans docker

Exemple de sf-lemonde:

1) Clonner le projet

```bash
git clone git@github.com:lemonde/sf-lemonde.git
```

2) Ajouter le package dans le package.json

```json
"css-client": "git+ssh://git@github.com:lemonde/css-client#[VERSION]",
```

3) Installer

```bash
npm install
```

4) Compiler les css

```bash
gulp css-client:compile-all
```

5) Déplace les css compiler la ou vous souhaitez les utilsier, vous pouvez utiliser un gulp file pour le faire plus facilement

```javascript
var gulp = require('gulp');
require('css-client')(gulp);

gulp.task('css:css-client:build', ['css-client:compile-style'], function() {
    return gulp.src('build-css-customer/css/*')
        .pipe(gulp.dest('web/media/css/customer'));
});

gulp.task('watch', ['css-client:watch', 'css:css-client:build']);

```

6) Si vous souhaitez développer sur css-client en même temps, il faut utiliser npm link

```bash
cd css-client && npm link
cd sf-lemonde && npm link css-client
```

Si vous éffectuer des changements dans css-client le css sera changer directement dans sf-lemonde


### 2 - Avec Docker

Exemple de sf-lemonde:

1) Clonner le projet

```bash
git clone git@github.com:lemonde/sf-lemonde.git
```

2) Mettre à jour le package json

```bash
"css-client": "git+https://GITHUB_TOKEN:x-oauth-basic@github.com/lemonde/css-client#1.0.5",
```

3) Installer docker (sur MAC)

```bash
cd sf-lemonde
## Si vous aviez déjà une machine docker
docker-machine rm dev
docker-machine create -d virtualbox --virtualbox-memory 3072  --virtualbox-cpu-count 2 dev || docker-machine start dev
docker-machine env dev
eval "$(docker-machine env dev)"
docker-compose up
```

4) Installer le projet

Dans une autre console

```bash
eval "$(docker-machine env dev)"
docker-compose run web bash
cp /var/www/package.json /tmp && npm config set unsafe-perm true && npm install --verbose --no-bin-links --prefix /tmp && rm -rf /var/www/node_modules && cp -r /tmp/node_modules /var/www && cd /var/css-client && rm -rf node_modules && npm link && cd /var/www && npm link css-client
```

Récuperer l'id du container docker, sur l'ecran vous devriez voir

```bash
root@87070dc9a529:/var/www#
```

5) Lancer le watcher

Dans une autre console

```bash
eval "$(docker-machine env dev)"
## CONTAINER_ID = 87070dc9a529
docker exec CONTAINER_ID bash -c 'node_modules/gulp/bin/gulp.js watch'
```
