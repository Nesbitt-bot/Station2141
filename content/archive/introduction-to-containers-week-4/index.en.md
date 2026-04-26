---
title: "Introduction to Containers Week 4"
image: "cover.png"
date: 2023-03-28T22:36:11Z
lastmod: 2023-03-28T22:36:12Z
categories: ["IBM fullstack"]
draft: false
aliases:
  - /introduction-to-containers-week-4/
---

## Introduction to OpenShift

OpenShift is an enterprise-ready Kubernetes container platform built for an open hybrid cloud strategy.

- Consistent application platform to manage hybrid-cloud, multicloud, and edge deployment
- Built on Linux, containers, and automation
- Provides full-stack automation & self-service provisioning for efficient development and deployment
- Additional tooling for the complete lifecycle of an app

### Kubernetes and OpenShift

Both Kubernetes and OpenShift are container orchestration platforms.

- Kubernetes is a crucial component of Openshift
- Use OpenShift as an extension of Kubernetes to provide a more robust and comprehensive container platform

### OpenShift features

Here is a selection of OpenShift features

- Scalable
- Flexible
- Open sourcce
- Portable containers
- Enhanced developer experience
- Automated install & upgrades
- Automation & streamlining
- Edge architecture support
- Multi cluster management
- Advanced security & compliance
- Persistent storage
- Robust partner ecosystem

### OpenShift Platform Architecture

OpenShift runs on top of a Kubernetes cluster, with object data stored in the etcd key-value store. It has a microservices-based architecture.

- Docker provides the abstraction for lightweight, Linux-based container images
- Kubernetes provides cluster management and orchestrates containers on multiple hosts.
- OpenShift adds:
    - Source code management, builds, and deployments for developers
    - Managing and promoting images at scale as they flow through your system
    - Application management at scale
    - Team and user tracking management of a large developer organization
    - Networking infrastructure that supports the cluster

### OpenShift CLI

OpenShift offers a set of command line interface (CLI) tools that let users perform various admin and development operations from the terminal.

#### Why use oc over kubectl?

Since OpenShift runs on top of Kubernetes cluster, a copy of kubectl is also included with OC. The OC and kubectl binary offer the same capabilities, but OC is further extended to natively support OpenShift features:

- OC supports:
    - DeploymentConfigs
    - BuildConfigs
    - Routes
    - ImageStreams and ImageStreamTags
- In-built log-in command for authentication
- Additional commands that make it easier to get new apps started

## Builds

### What is a build

A Build is the process of transforming inputs into a resultant object. For example, transforming source code to a container image.

- A Build configuration file (BuildConfig) defines the build strategy and input sources

Commonly used Build strategies are:

- Source to Image (S2I)
- Docker
- Custom

### Build input sources

You can use the following build inputs, listed in order of precedence:

- Inline Dockerfile definitions
- Content extracted from existing images
- Git repositories
- Binary (Local) inputs
- Input secrets
- External artifacts

* * *

- You can combine multiple inputs into a single build
- An inline Docker file takes precedence and overwrites any external Dockerfile

### What is an ImageStream

An ImageStream is an abstraction for referencing container images within OpenShift

- Continuously creates and updates container images
- Does not contain actual image data but is merely a pointer
- Can store source images in different registries or ImageSteams
- Can trigger builds and deployments when a new image is available

### What are build triggers

Automate builds using the following triggers:

- Webhook trigger
    - Sends a request to an OpenShift Container Platform API endpoint
    - Supports generic webhooks and the more often used GitHub webhooks
- Image Change trigger
    - New version of an image is available
    - Useful for keeping base image up to date
- Configuration change trigger
    - Build when you create a new BuildConfig

### BuildConfig: Step-by-step process

```yaml
kind: BuildConfig
apiVersion:
build.openshift.io/v1
metadata:
  # 1. New BuildConfig called "ruby-sample build"
  name: "ruby-sample-bulid"
spec:
  # 2. runPolicy shows bulid created sequentially
  runPolicy: "Serial"
  # 3. Tiggers list creates a new build
  triggers:
	- type: "GitHub"
	github:
  secret: "secret101"
	- type: "Generic"
	  generic:
		secret: "secret101"
    - type: "ImageChange"
  # 4. Source section defines Build input source and strategy
source:
  git:
  # 5. Input source type is Git with uri.
    uri: "https://github.com/openshift/ruby-hello-world"
  strategy:
    sourceStrategy:
      from:
        kind: "ImageStreamTag"
  # 6. Source strategy is S2I (uses ruby-20-centos7)
        name: "ruby-20-centos7:latest"
  # 7. Container image pushed to repository (output section)
output:
  to:
    kind: "ImageStreamTag"
    name: "origin-ruby-sample:latest"
  # 8. postCommit section defines an optional build hook
postCommit:
  script: "bundle exec rake test"
   
```

### Source-to-Image (S2I) strategy

- Is a tool for building reproducible container images
- Injects application source into a container image to produce a ready-to-run image
- Eliminates using a Dockerfile
- Go from Source to Image in one step
- OpenShift includes predefined builder images

### Docker build strategy

Docker Registry

- Required a repository with Dockerfile and necessary artifacts
- Invoke the "docker build" command and creates an image
- Pushes image to the internal registry

Docker build strategy methods:

- Replace Dockerfile FROM image
- Use Dockerfile path
- Use Docker environment variables
- Add Docker build arguments

### Custom build strategy

In a custom build strategy, you must define and create your own builder image

- Custom builder images are Docker images that contain logic to transform inputs into expected outputs
- Custom build strategy creates additional objects like JAR files and CI/CD deployment that performs unit or integration tests
- Custom builds are only available to cluster administrators

### Builds automation

Cloud-native development requires greater automation throughout the container lifecycle

- Continuous integration and continuous delivery (CI/CD) deployment pipeline provides automation

The OpenShift CI/CD process:

1.  Merge code changes to a repository
2.  Builds and test
3.  Deploys

## Operators

### Operators - Introduction

Operators automate cluster tasks and act as a custom controller to extend the Kubernetes API.

- Run in a Pod, interact with the API sever
- Package, deploy and manage Kubernetes apps
- Automate app creation, configuration, and management via continuous real-time decisions

#### Human vs Software Operators

Operators package, deploy, and manage native apps in Kubernetes, automate other tasks, and ensure all relevant components are included. Operators provide the following features:

- Repeatable installs & upgrades
- Regular full-system health checks
- Over-the-air updates
- Communication tools
- Integration

#### Service Brokers vs Operators

Let's see how Service Brokers compare with Operators.

Service Brokers provide

Operators provide:

A short-running process that cannot perform the consecutive day's operations such as upgrades, failover, or scaling

A long-running process that can perform operations like upgrades, failover, or scaling every day

Customizations and parameterization only at the time of installation

Customizations and parameterization, as operators constantly watch the current state of your cluster

Off-cluster services

Off-cluster services

### Custom resource definition (CRD)

Custom resource definitions (or CRDs) store and retrieve objects in the Kubernetes API.

- Extend the Kubernetes API
- Make the Kubernetes API more modular and flexible
- Can be installed in clusters
- Once installed, can be accessed using kubectl

### Custom controllers

Controllers reconcile a cluster's actual state with its configured state.

- Custom controllers do the same reconciling for custom resources (CRDs)
- Combining CRDs and custom controllers creates a declarative API
- This combination is known as "The Operator Pattern"

### Operator Framework

The Operator Framework covers coding, testing, delivery, and Operator updates. Operator SDK

- Helps authors build, test, and package Operators

Operator Lifecycle Manager (OLM)

- Controls Operator install, upgrade, and RBAC

Operator Registry

- Store CRDs, CSVs, and Operator metadata

OperatorHub

- Lets cluster admins find and install Operators

### Operator Maturity Model

The sophistication of Operator management logic varies, depending on Operator service type.

1.  Basic Install Automated app provisioning & configuration management
2.  Seamless Upgrades Patch and minor version upgrades supported
3.  Full Lifecycle App lifecycle, storage lifecycle (backup, failure recovery)
4.  Deep Insights Metrics, alerts, log processing and workload analysis
5.  Auto Pilot Horizontal/vertical scaling, auto config tuning, abnormal detection, scheduling tuning

#### Examples

Some Operators examples include:

- Deploying an application to the OpenShift cluster
- Scaling the application with the help of multiple replicas
- Automation of backup/restore tasks
- Integration

#### Operators in practice

To deploy a complete application:

1.  Create a custom resource (CRD) for the app
2.  Create a custom controller for this CRD
3.  Operator logic determines how to reconcile the actual and desired states.
4.  A CRD requires the creation of deployments, services, storage and other objects.

#### OperatorHub

Install operators with a simple click Many operators available

- Red Hat
- Certified
- Community
- Custom

Can be used to install other Kubernetes tools

## Istio

### What is a service mesh?

- A dedicated infrastructure layer that adds capabilities (to applications without adding to code), such as
    - Traffic management
    - Security
    - Observability
- Help make service-to-service communication fast, secure, and reliable.

### What is Istio and what does it do?

Connection to control traffic

- Between services in canary deployment, A/B test, and other deployment models

Secures services

- Using managed authentication, authorization, and encryption

Enforces policies

- Across the fleet

Observes

- Traffic flow

Traces

- Call flows and dependencies

Enables the view

- Of metrics such as latency and errors

### Features of Istio

- TSL-encrypted (secure) communications between services in a cluster combined with authentication and authorization
- Load balances traffic for different protocols
- Granular configuration of traffic flow (routing rules) and control
- Policies and API support access controls, rate limits, and quotas
- Automatic monitoring, logging, and tracking traffic

### Istio on Kubernetes enables

- The addition of applications of a cluster to the mesh
- The extension of the mesh to additional clusters
- Connections to virtual machines or other endpoints running outside of Kubernetes

### Microservices with Istio

- Cloud-native architectural approach
- Single application composed of loosely coupled and independently deployable services
- Well-defined APIs for communication
- Benefits include easy updates to code, allowing different technology stacks for different components, and scaling components independently
- Challenges range from traffic encryption, Canary deployment and A/B testing to Cascading failures (Retries, Circuit-breaking)

## Summary

Congratulations! You have completed this module. At this point, you know:

- OpenShift® is an enterprise-ready Kubernetes container platform built for open hybrid cloud.
- OpenShift is easier to use, integrates with Jenkins, and has more services and features.
- Custom resource definitions (CRDs) extend the Kubernetes API.
- CRDs paired with custom controllers create new, declarative APIs in Kubernetes.
- Operators use CRDs and custom controllers to automate cluster tasks.
- A build is a process that transforms inputs into an object.
- An ImageStream is an abstraction for referencing container images in OpenShift.
- A service mesh provides traffic management to control the flow of traffic between services, security to encrypt traffic between services, and observability of service behavior to troubleshoot and optimize applications.
- Istio is a service mesh that supports four concepts of connection, security, enforcement, and observability. It is commonly used with Microservices applications.
- Istio provides service communication metrics for basic service monitoring needs: latency, traffic, errors, and saturation.

Term

Definition

**A/B testing**

Strategy is mostly used for testing new features in front-end applications. It is used to evaluate two versions of the application namely A and B, to assess which one performs better in a controlled environment. The two versions of the applications differ in terms of features and cater to different sets of users. Based on the interaction and responses received from the users such as feedback, you can choose one of the versions of the application that can be deployed globally into production.

**Build**

The process of transforming inputs into a resultant object.

**BuildConfig**

An OpenShift-specific object that defines the process for a build to follow. The build process makes use of the input sources and the build strategy. The BuildConfig is the blueprint, and the build is an instance of that blueprint.

**Canary Deployments**

Aims to deploy the new version of the application by gradually increasing the number of users. The canary deployment strategy uses the real users to test the new version of the application. As a result, bugs and issues can be detected and fixed before the new version of the application is deployed globally for all the users.

**Circuit breaking**

A method to prevent errors in one microservice from cascading to other microservices.

**Configuration Change**

A trigger that causes a new build to run when a new BuildConfig resource is created.

**Control Plane**

The control plane takes the desired configuration and its view of the services and dynamically programs and updates the proxy servers as the environment changes.

**Custom build strategy**

Requires you to define and create your own builder image.

**Custom builder images**

Are regular Docker images that contain the logic needed to transform the inputs into the expected output.

**CRDs**

Custom code that defines a resource to add to your Kubernetes API server without building a complete custom server.

**Custom controllers**

Reconcile the custom resources (CRDs) actual state with its desired state.

**Data plane**

Communication between services is handled by the data plane. If a service mesh is absent, the network cannot identify the type of traffic that flows, the source, and the destination and make any necessary decisions.

**Enforceability (Control)**

Istio provides control by enforcing policies across an entire fleet and ensures resources are fairly distributed among consumers.

**Envoy proxy**

All network traffic is subject to or intercepted by a proxy, called Envoy, used by the service mesh and allows many features depending on the configuration.

**Human operators**

Understand the systems they control. They know how to deploy services and how to recognize and fix problems.

**Image Change**

A trigger to rebuild a containerized application when a new or updated version of an image is available. For example, if an application is built using a Node.js base image, that image will be updated as security fixes are released and other updates occur.

**ImageStream**

An abstraction for referencing container images within OpenShift. Each image contains an ID, or digest, that identifies it. ImageStreams do not contain image data but rather are pointers to image digests.

**ImageStream Tag**

An identity to the pointer in an ImageStream that points to a certain image in a registry.

**Istio**

A platform-independent and popular service mesh platform, often used with Kubernetes. It intelligently controls the flow of traffic and API calls between services, conducts a range of tests and reduces the complexity of managing network services. Istio secures services through authentication, authorization, and encryption. Istio provides control by defining policies that can be enforced across an entire fleet. With Istio, you can observe traffic flow in your mesh so you can trace call flows, dependencies, and you can view service communication metrics such as latency, traffic, errors and saturation.

**Man-in-the-middle attacks**

A man-in-the-middle (MiTM) attack is a type of cyber-attack where the attacker secretly intercepts and relays messages between two parties who believe they are communicating directly with each other. The attack is a type of eavesdropping in which the attacker intercepts and then controls the entire conversation.

**Observability**

Helps to observe the traffic flow in your mesh, trace call flows and dependencies, and view metrics such as latency and errors.

**OpenShift**

A hybrid cloud, enterprise Kubernetes application.

**OpenShift CI/CD process**

Automatically merges new code changes to the repository, builds, tests, approves, and deploys a new version to different environments.

**Operators**

Automate cluster tasks and act as a custom controller to extend the Kubernetes API.

**Operator Framework**

Is a family of tools and capabilities to deliver an efficient customer experience. It is not just about writing code; what is also critical is testing, delivery, and updating Operators.

**OperatorHub**

Web console lets cluster administrators find Operators to install on their cluster. It provides many different types of Operators available, including Red Hat Operators, Certified Operators from independent service vendors partnered with Red Hat, Community Operators from the open-source community but not officially supported by Red Hat, and custom Operators defined by users.

**Operator Lifecycle Manager**

(or OLM) Controls the install, upgrade, and role-based access control (or RBAC) of Operators in a cluster.

**Operator maturity model**

Defines the phases of maturity for general day two Operations activities and ranges from Basic Install to Auto Pilot.

**Operator Pattern**

A system design that links a Controller to one or more custom resources.

**Operator Registry**

Stores CRDs, cluster service versions (CSVs), and Operator metadata for packages and channels. It runs in Kubernetes or OpenShift clusters to provide the Operator catalog data to OLM.

**Operator SDK**

(which includes Helm, Go, and Ansible) Helps authors build, test, and package their Operators without requiring knowledge of Kubernetes API complexities.

**postCommit**

Section defines an optional build hook.

**Retries**

A method to prevent errors in one microservice from cascading to other microservices.

**runPolicy**

Field controls how builds created from a build configuration need to run. Values include the default Serial (sequentially) and simultaneously.

**Service Broker**

Provides a short-running process that cannot perform the consecutive day’s operations such as upgrades, failover, or scaling.

**Service Mesh**

A dedicated layer for making service-to-service communication secure and reliable. It provides traffic management to control the flow of traffic between services, security to encrypt traffic between services, and observability of service behavior; so, you can troubleshoot and optimize applications.

**Software operators**

Try to capture the knowledge of human operators and automate the same processes.

**Source-to-Image**

A tool for building reproducible container images. Also abbreviated S2i, it injects application source code into a container image to produce a ready-to-run image.

**Source strategy**

Section shows the strategy used to execute the build, such as a Source, Docker, or Custom strategy.

**Source type**

Determines the primary input like a Git repository, an inline Dockerfile, or binary payloads.

**Webhook**

A trigger that sends a request to an OpenShift Container Platform API endpoint. Often this will be a GitHub webhook, though it can also be a generic webhook. If a GitHub webhook is utilized, GitHub can send the request to OpenShift when there is a new commit on a certain branch, or a pull request is merged, or under many more circumstances. Webhooks are a great way to automate development flows so that builds can occur automatically as new code is developed.
