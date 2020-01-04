#!/bin/bash

IMAGE_VERSION=0.1.3

helm uninstall amki-web
yarn build
docker build --tag amki-web:$IMAGE_VERSION .
k3d import-images amki-web::$IMAGE_VERSION
helm install amki-web ./charts/amki-web --wait --set values.ingress.enabled=true
kubectl port-forward svc/istio-ingressgateway 80