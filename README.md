# myStudizBack

- Créer le fichier .env à la racine du projet avec les variables d'environnement
TZ=UTC
PORT=3333
HOST=::
LOG_LEVEL=info
APP_KEY=nqGCsjRp0ltYJO39o7ZytxZ2UlAFEm81
NODE_ENV=development
SESSION_DRIVER=cookie
DB_HOST=123
DB_PORT=123
DB_USER=postgres
DB_PASSWORD=123
DB_DATABASE=123
LIMITER_STORE=database
MAILGUN_API_KEY=123
MAILGUN_DOMAIN=123
API_VERSION=0.1
STRIPE_API_SECRET=123
STRIPE_KEY_PUBLISHABLE=123
STRIPE_WEBHOOK=http://stripe.com/
FRONT_DOMAIN=http://127.0.0.1:3000/
SCW_ACCESS_KEY=123
SCW_SECRET_KEY=123
SCW_REGION=fr-par
SCW_BUCKET=mystudiz-dev
SCW_ENPOINT=https://s3.fr-par.scw.cloud/
DRIVE_DISK=fs

- npm i
- node ace migration:run
- node db:seed (si vous voulez populate la base de donnée)
- npm run dev

ou connectez-vous sur https://app.my-studiz.com
