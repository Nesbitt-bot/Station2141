---
title: "Introduction to Containers Week 3"
image: "cover.png"
date: 2023-03-28T22:35:49Z
categories: ["IBM fullstack"]
draft: false
aliases:
  - /introduction-to-containers-week-3/
---

## ReplicaSet

### Single pod deployment limitations

If an application is deployed on a single pod, the pod will be unable to perform certain actions if requests increase manifold or outages occur.

#### Limitations for single-pod deployment cannot:

- Accommodate growing demands
- Handle outages
- Minimize downtime
- Auto restart on interruptions

A ReplicaSet ensures the right number of pods are always up and running. It always tries to match the actual state of the replicas to the desired state. Advantages of using ReplicaSet:

- Adds or deletes pods for scaling and redundancy
- Replaces failing pods or deletes additional pods to maintain the desired state
- Supersedes ReplicaControllers

### Create ReplicaSet from scratch

Let's step through creating a ReplicaSet from scratch.

```shell
kubectl create -f replicasets.yaml
```

Check if the pods are created

```shell
kubectl get pods
```

Check if the ReplicaSet are created.

### Create deployment

Let's step through creating a ReplicaSet

```shell
kubectl create -f deployment.yaml
```

```shell
kubectl get pods
```

```shell
kubectl get deploy
```

### Scale deployment

```shell
kubectl scale deploy hello-kubernetes --replicas=3
```

Check if the pods are created

```shell
kubectl get pods
```

When replica numbers are set, the Kubernetes will automatically maintain the number of pods.

## Autoscaling

Autoscaling enables scaling as needed Autoscaling occurs at two different layers:

- Cluster/node level
- Pod level

Autoscaler types:

- Horizontal Pod Autoscaler (HPA) Adjust the number of replicas of an application by increasing or decreasing the number of pods
- Vertical Pod Autoscaler (VPA) Adjusts the recourse requests and limits of an container by increasing or decreasing the resource size or speed of the pods
- Cluster Autoscaler (CA) Adjusts the number of nodes in the cluster when pods fail to schedule, or when demand increases or decreases in relation to the capacity of existing nodes

### Create autoscaling with Kubectl

To create autoscaling for a deployment or ReplicaSet:

```shell
kubectl get pods
kubectl get rs
kubectl autoscale deploy hello-kubernetes --min=2 --max=5 --cpu-percent=50
```

### Describe ReplicaSet

The deployment still uses the ReplicaSet to scale up and down:

```shell
kubectl get pods
kubectl describe rs [pod_name]
```

### Autoscaling with HPA from scratch

```shell
kubectl get hpa
```

Another way to enable autoscaling is to manually create the HPA in a YAML file:

```yaml
....
appVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
	name: hello-kubernetes
	namespace: default
spec:
	maxReplicas: 5
	minReplicas: 2
	scaleTargeRed:
		apiVersion: apps/v1
		kind: Deployment
		name: hello-kubernetes
	targetCPUUtilizationPercentage: 10
```

### Selecting the right autoscaler

Each autoscaler type is suitable in specific scenarios. That's why we analyze the pros and cons of each one to find the best choice. Using a combination of all three types ensures:

- Service run stably at peak load times
- Costs are minimized in times of lower demand

## Deployment Strategies

### Overview

A Kubernetes deployment strategy defines an application’s lifecycle that achieves and maintains the configured state for objects and applications in an automated manner. Effective deployment strategies minimize risk. Kubernetes deployment strategies are used to:

- Deploy, update, or rollback ReplicaSets, Pods, Services, and Applications
- Pause/Resume Deployments
- Scale Deployments manually or automatically

### Types of deployment strategies

The following are six types of deployment strategies:

1.  Recreate
2.  Rolling
3.  Blue/green
4.  Canary
5.  A/B testing
6.  Shadow

You can use either a single deployment strategy or a combination of multiple deployment strategies.

### Recreate strategy

  _(diagram unavailable)_ In the recreate strategy, Pods running the live version of the application are all shut down simultaneously, and a new version of the application is deployed on newly created Pods. Recreate is the simplest deployment strategy. There is a short downtime between the shutdown of the existing deployment and the new deployment. Recreate strategy steps include:

1.  A new version of the application (v2) is ready for deployment.
2.  All Pods running the current version (v1) are shut down or deleted.
3.  New (v2) Pods are created.

The rollback process is completed in the reverse order, replacing version 2 (v2) with version 1 (v1).

**Pros**

**Cons**

Simple setup

Short downtime occurs between shutdown and new deployment

Application version completely replaced

### Rolling (ramped) strategy

  _(diagram unavailable)_ In a rolling strategy, each Pod is updated one at a time. A single v1 Pod is replaced with a new v2 Pod. Each v1 Pod is updated in this way until all Pods are v2. During a rolling strategy update, there is hardly any downtime since users are directed to either version. Rolling strategy steps include:

1.  A new version of the application (v2) is ready for deployment.
2.  One of the Pods running the current version (v1) is shut down or deleted.
3.  A new (v2) Pod is created to replace the (v1) Pod that was removed.
4.  Steps 2 and 3 are repeated until all (v1) Pods are removed and replaced with (v2) Pods.

The rollback process is reversed, where v2 Pods are replaced by v1 Pods.

**Pros**

**Cons**

Simple setup

Rollout/rollback takes time

Suitable for stateful applications that need to handle rebalancing of the data

You cannot control traffic distribution

### Blue/green strategy

  _(diagram unavailable)_ In a blue/green strategy, the blue environment is the live version of the application. The green environment is an exact copy that contains the deployment of the new version of the application. The green environment is thoroughly tested. Once all changes, bugs, and issues are addressed, user traffic is switched from the blue environment to the green environment. Blue/green strategy steps include:

1.  Create a new environment identical to the current production environment.
2.  Design the new version and test it thoroughly until it is ready for production.
3.  Route all user traffic to the new version.

To perform a rollback, switch the environments back.

**Pros**

**Cons**

Instant rollout/rollback (no downtime)

Expensive (requires double resources)

New version is available immediately to all users

Rigorous testing required before releasing to production

 

Handling stateful applications is difficult

### Canary strategy

  _(diagram unavailable)_ In a canary strategy, the new version of the application is tested using a small set of random users alongside the current live version of the application. Once the new version of the application is successfully tested, it is then rolled out to all users. Canary strategy steps include:

1.  Design a new version of the application.
2.  Route a small sample of user requests to the new version.
3.  Test for efficiency, performance, bugs, and issues, and rollback as needed.
4.  Repeat steps 1 to 3. Once all issues are resolved, route all traffic to the new version.

Rollback has no downtime since few users are exposed to the new version.

**Pros**

**Cons**

Convenient for reliability, error, and performance monitoring

Slow rollout, gradual user access

Fast rollback

### A/B testing strategy

  _(diagram unavailable)_ The A/B testing strategy, also known as split testing, evaluates two versions of an application (version A and version B). With A/B testing, each version has features that cater to different sets of users. You can select which version is best for global deployment based on user interaction and feedback. A/B testing strategy steps include:

1.  Design a new version of the application by adding mostly UI features.
2.  Identify a small set of users based on conditions like weight, cookie value, query parameters, geolocalization, browser version, screen size, operating system, and language.
3.  Route requests from the user set to the new version.
4.  Check for bugs, efficiency, performance, and issues.
5.  Once all issues are resolved, route all traffic to the new version.

Rollbacks can be implemented, but downtime can impact the user.

**Pros**

**Cons**

Multiple versions can run in parallel

Requires intelligent load balancer

Full control over traffic distribution

Difficult to troubleshoot errors for a given session, distributed tracing becomes mandatory

### Shadow strategy

  _(diagram unavailable)_ In a shadow strategy, a “shadow version” of the application is deployed alongside the live version. User requests are sent to both versions, and both handle all requests, but the shadow version does not forward responses back to the users. This lets developers see how the shadow version performs using real-world data without interrupting user experience. To perform a rollback, switch the environments back.

**Pros**

**Cons**

Performance testing with production traffic

Expensive (double resources)

No user impact

Not a true user test, can lead to misinterpreted results

No downtime

Complex setup

 

Requires monitoring for two environments

### Deployment strategies summary

**Strategy**

**Zero Downtime**

**Real Traffic Testing**

**Targeted Users**

**Cloud Cost**

**Rollback Duration**

**NegativeUser Impact**

**Complexity of Setup**

**Recreate**Version 1 is removed then version 2 is rolled out

**X**

**X**

**X**

**•--**

**•••**

**•••**

**\- - -**

**Ramped**Version 1 is replaced by a slow rollout of version 2

**✓**

**X**

**X**

**•--**

**•••**

**•--**

**•--**

**Blue/Green**Version 2 is released together with version 1, then the traffic is switched to version 2

**✓**

**X**

**X**

**•••**

**\- - -**

**••-**

**••-**

**Canary**Version 2 is first released to a subset of users, then fully rolled out when production ready

**✓**

**✓**

**X**

**•--**

**•--**

**•--**

**••-**

**A/B Testing**Version 2 is only released to a subset of users with specific traits

**✓**

**✓**

**✓**

**•--**

**•--**

**•--**

**•••**

**Shadow**Version 2 receives real-world traffic together with version A but doesn’t respond to users

**✓**

**✓**

**X**

**•••**

**\- - -**

**\- - -**

**•••**

To create a good strategy:

- Consider the product type and the target audience
- Shadow and canary strategies use live user requests, as opposed to using a sample of users.
- The A/B testing strategy is useful if the version of the application requires minor tweaks or UI feature changes.
- The blue/green strategy is useful if your version of the application is complex or critical and needs proper monitoring with no downtime during deployment.
- The canary strategy is a good choice if you want zero downtime and are comfortable exposing your version of the application to the public.
- A rolling strategy gradually deploys the new version of the application. There is no downtime, and it is easy to roll back.
- The recreate strategy is a good choice if the application is not critical and users aren’t impacted by a short downtime.

## Rolling updates

Rolling updates are automated updates that occur on a scheduled basis.

- Roll out automated and controlled app changes across pods
- Work with pod templates like deployments
- Allow for rollback as needed

### First steps

Step 1: Add liveness and readiness probes to your deployments.

```yaml
livenessProbe:
	httpGet:
		path: /
		port: 9080
	initialDelaySeconds: 300
	periodSeconds: 15
readinessProbe:
	httpGet:
		path: /
		port: 9080
		initialDelaySeconds: 45
		periodSeconds: 5
```

Step 2: Add a rolling update strategy to your YAML file

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
	name: nginx-test
spec:
	replicas: 10
	selector: 
		matchLabels:
			service: http-server
	minReadySeconds: 5
	progressDeadlineSeconds: 600
	strategy:
		type: RollingUpdate
		rollingUpdate:
			maxUnavaliable: 50%
			maxSurge: 2
```

### Update versions

You have a new image for your application with a different message

```javascript
// Configuration
var port = process.env.PORT || 8080;
var message = process.env.MESSAGE || "Hello world!";
```

new version:

```javascript
// Configuration
var port = process.env.PORT || 8080;
var message = process.env.MESSAGE || "Hello maimai!";
```

First, you need to build, tag, and upload this new image to Docker Hub.

```shell
docker build -t hello-kubernetes .
```

Customize some properties of the new app.

```shell
docker tag hello-kubernetes upkar/hello-kubernetes:2.0
docker push upkar/hello-kubernetes:2.0
```

Now, apply this new image to your deployment.

```shell
kubectl get deployments
```

```shell
kubectl set image deployments/hello-kubernetes hello-kubernetes=upkar/hello-kubernetes:2.0
```

Check if version two is really deployed

```shell
kubectl rollout status deployments/hello-kubernetes
```

Roll back to version 1

```shell
kubectl rollout undo deployments/hello-kubernetes deployment.extensions/hello-kubernetes rolled back
```

### Practical demos

#### All-at-once rollout

In an all-at-once rollout, all v1 objects must be removed before v2 objects can become active.

#### All-at-once rollback

In am all-at-once rollback, all v2 objects must be removed before v1 objects can become active.

#### One-at-a-time rollout

In a one-at-a-time rollout, the update is staggered so user access is not interrupted.

#### One-at-a-time rollback

In a one-at-a-time rollback, the update rollback is staggered so user access is not interrupted.

## ConfigMaps and Secrets

### ConfigMap

- Helps developers avoid hard-coding configuration variables into the application code
- Is an API object used to store non-confidential data in key-value pairs
- Does not provide secrecy or encryption
- Provides configuration data to pods and deployments
- Is limited to 1 MB of data
    - For larger amounts of data, consider mounting a volume or use a separate database or file service
- Has optional data and binaryData fields and no spec field in the template
- Name must be a valid DNS subdomain name

### ConfigMap capabilities

- Easily portable as a ConfigMap is reusable across deployments
- Multiple ways to create eg. Configure environment variables
    
    ```yaml
    appVersion: apps/v1
    kind: Deployment
    metadata: 
    	name: hello-kubernetes
    	labels:
    		app: hello-kubernetes
    spec:
    	replicas: 1
    	selector:
    		matchLabels:
    			app: hello-kubernetes
    	template:
    		metadata:
    			labels:
    				app: hello-kubernetes
    	spec:
    		containers:
    		- name: hello-kubernetes
    		  image: upkar/myapp:latest
    		  ports:
    		  - containerPort:8080
    		  env:
    		  - name: MESSAGE
    		    value: "Hello from config file!"
    ```
    
    - Using string literals
        
        ```shell
        kubectl create ConfigMap my-config --from-literal=MESSAGE="hello from first configmap"
        ```
        
        ```yaml
        env:
        - name: MESSAGE
          valueFrom:
          	configMapKeyRef:
          		name: my-config
          		key: MESSAGE
        ```
        
    - Using an existing properties or "key"="value" file
        
        ```shell
        cat my.properties
        kubectl create cm my-config --from-file=my.properties
        kubectl describe ConfigMap my-config
        ```
        
        ```yaml
        env:
        - name: MESSAGE
          valueFrom:
          	configMapKeyRef:
          		name: my-config
          		key: my.properties
        ```
        
    - Providing a ConfigMap YAML descriptor file
        
        ```shell
        # check if config map is already created
        kubectl get cm
        # 
        cat my-config.YAML
        kubectl apply -f my-config.YAML
        kubectl describe cm my-config
        ```
        
- Multiple ways to reference from pod/deployment
    - Reference as an environment variable
    - Mount as a volume

#### Secret: Using with string literals

```shell
kubectl create secret generic api-creds --from-literal=key=mysupersecretapikey
# verify the secret is created
kubectl get secret
# check if that is a truely secret
kubectl describe secret api-creds
# the texts should be fully encoded when you use the command
kubectl get secret api-creds -o YAML
```

```yaml
env:
- name: API_CREDS
  valueFrom:
    secretKeyRef
      name: api-creds
      key: key
```

#### Secret: Use with volume mounts

```shell
kubectl create secret generic api-creds --from-literal=key=mysupersecretapikey
```

```yaml
spec:
  containers:
  - name: hello-kubernetes
    image: upkar/myapp:latest
    ports:
    - containerPort: 8080
    volumeMounts:
    - name: api-creds
      mountPath: "/etc/api"
      readOnly: true
    volumes:
      - name: api-creds
      secret:
        secretname: api-creds
```

## Service binding

- Is a process to consume external Services or backing Services
- Manages configuration and credentials for back-end Services while protecting sensitive data
- Makes Service credentials available to you automatically as a Secret
- Consumes the external Service by binding the application to a deployment
- The application code uses the credentials from the binding and calls the corresponding Service
