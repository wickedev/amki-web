#!/bin/bash

helm uninstall amki-web
helm install amki-web ./helm/amki-web --wait
kubectl port-forward svc/istio-ingressgateway -n istio-system 3000:80
