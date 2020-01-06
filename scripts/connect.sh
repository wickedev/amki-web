#!/bin/bash
function finish {
    kill %1
    echo kubectl port-forward finished
}
trap finish EXIT

export DB_NAME=amki
export DB_USER=amki
export DB_PASSWORD=amkipass

export AMKI_WEB_POSTGRESQL_SERVICE_HOST=localhost
export AMKI_WEB_POSTGRESQL_SERVICE_PORT=5432

kubectl create namespace amki
helm upgrade -i amki-web ./helm/amki-web -n amki --wait \
    --set values.development=true \
    --set postgresql.postgresqlDatabase=$DB_NAME \
    --set postgresql.postgresqlUsername=$DB_USER \
    --set postgresql.postgresqlPassword=$DB_PASSWORD
kubectl port-forward -n amki svc/amki-web-postgresql 5432 &

yarn start

