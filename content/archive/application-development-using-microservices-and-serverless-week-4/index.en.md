---
title: "Application Development using Microservices and Serverless Week 4"
image: "cover.png"
date: 2023-03-28T22:26:42Z
categories: ["IBM fullstack"]
draft: false
aliases:
  - /application-development-using-microservices-and-serverless-week-4/
---

## OpenShift Recap

OpenShift is a hybrid cloud, enterprise, Kubernetes application platform Hybrid cloud: can be run on premises or in public and private clouds Kubernetes: an underlying technology Application platform: provides additional tooling for applications

### OpenShift and Microservices

-   OpenShift is a premiere platform for running microservices
-   Orchestrates containerized workloads
-   Microservices on OpenShift can easily integrate with serverless technologies

### Kubernetes/OpenShift

-   Linux kernel is a powerful, open-source operating system kernel
-   Distributions add features and functions to the kernel
-   Kubernetes has core capabilities, similar to the Linux kernel
-   Distributions built on top of OpenShift is like a Linux distribution

## Service Mesh and Istio

### Benefits of microservices

-   Update code more easily
-   Implement different technology stacks for different components
-   Scale components independently

### Challenges of microservices

Additional configuration necessary to implement:

-   Encrypted traffic among services
-   Canary deployments and A/B testing
-   Retries and circuit breaking to prevent cascading failures

### What is a service mesh

A dedicated layer that enables fast, secure, and reliable service-to-service communication

-   Manages traffic
-   Encrypts traffic between services
-   Observes service behavior for network optimization and troubleshooting

### Istio service mesh

Istio build proxy on each services. Configuration were passed to Galley Galley would process the configuration file(usually written with YAML) and give them to Pilot to distribute them to different proxies The policy components customize the proxies with preconfigured rules The telemetry components would collect information like logs and status Citadel enables strong service-to-service and end-user authentication with built-in identity and credential management. You can use Citadel to upgrade unencrypted traffic in the service mesh.

## Microservices with OpenShift

CLI and web console for deployment

-   OpenShift creates a Jerkins job to automatically build microservices into containers
-   OpenShift pushes the built containers to a registry and deploys those containers to the clluster

## Red Hat Marketplace

### Benefits of OpenShift

-   Enables simplified microservices development and deployment
-   Enables use of third-party software to fill gaps without requiring development of an entire solution

### Red Hat Marketplace

"A simpler way to try, buy, and manage certified software for OpenShift"

### Discover software

Red Hat Marketplace is a one-stop shop for certified OpenShift-ready software

-   Search for available product and filter results
-   View product descriptions and automation capabilities

### Buy software

-   Size software
-   Sign up for free trials
-   Use convenient sotware pruchase options including:
    -   Real-time pricing
    -   Billing options
    -   Subscription choices

### Deploy software

Deploy form Red Hat Marketplace to selected OpenShift clusters on any cloud or on-prem environment

### Manage software

Use Red Hat Marketplace to:

-   Perform lifecycle task such as upgrades and insights
-   Access continuous support for purchased products

## Summary

Congratulations! You have completed this module. At this point in the course, you know that:

-   Red Hat OpenShift is a platform for running containerized workloads like microservices.
-   OpenShift is like a Kubernetes distribution in that OpenShift with additional capabilities. OpenShift services help manage workloads, build cloud-native apps, and increase developer productivity. For example, OpenShift creates a Jenkins job to automatically build microservices into containers. In addition, OpenShift pushes the built containers to a registry and deploys those containers to the cluster
-   Microservices architectures need security among services as well as ways to manage and test services.
-   A service mesh is a dedicated layer that provides security and more by coordinating communication. Istio is a service mesh that provides traffic shifting, mutual transport layer security, and telemetry when deployed with microservices.
-   Certified software fills development gaps in your application, eliminating the need for your organization to spend the time and money to develop new microservices. Red Hat Marketplace provides a central location to try, buy, deploy and manage software certified for OpenShift environments.
