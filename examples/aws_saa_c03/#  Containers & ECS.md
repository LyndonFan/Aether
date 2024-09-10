#  Containers & ECS

## Introduction to Containers

### Virtualization Problems

![Untitled](img/Untitled%2061.png)

### Containerization

![Untitled](img/Untitled%2062.png)

### Image Anatomy

- Running copy of a docker image
- Made up of multiple layers
- Dockerfile creates docker image
- Each step creates fs layers
- Images are created from a **base** image or **scratch**
- Images contain **readonly** layers, changes are layered onto the image using a **differential** architecture

### Container Anatomy

- Running copy of a docker image with one difference - **one additional read/write layer**
- Anything happening during running is only stored in this layer

![Untitled](img/Untitled%2063.png)

### Container Registry (e.g. Docker Hub)

![Untitled](img/Untitled%2064.png)

### Container Key Concepts

- **Dockerfiles** are used to **build images**
- Portable - self-contained, always run as expected
- Lightweight - Parent OS used, **fs layers are shared**
- Container only runs the application & environment it needs
- Provides much of the isolations VM’s do
- Ports are **exposed** to the host and beyond
- Application stack can be multi-container…

## Elastic Container Service (ECS) Concepts

> *Remove admin overhead of managing containers*
>

### ECS

![Untitled](img/Untitled%2065.png)

- Runs in two modes
- EC2
- Fargate
- 20 GB of free ephemeral  storage
- Create ECS Cluster
- **ECR - Elastic Container Registry (AWS alt to Docker Hub)**
- **Container definition** - Tell container where container image is
- **Task definition -** One or many container inside it
- Represents the application as a whole
- Store the resources used by the task
- CPU, Memory, Network mode, compatibility (ec2 vs fargate)
- Task role
- IAM role that the task can use
- Best way to give tasks access to resources
- **Service definition**
- How many copies of a task we want to run
- Add Load balancer
- Scaling
- High availability
- **Service is what is deployed into the ECS Cluster!**

### ECS Concepts

- **Container Definition** - Image & Ports
- **Task Definition** - Security (Task Role), Container(s), Resources
- **Task Role** - IAM Role which the TASK assumes
- **Service** - How many copies, HA, Restarts

## ECS - Cluster Mode

> *ECS is capable of running in EC2 mode or Fargate mode.*
>
>
> *EC2 mode deploys EC2 instances into your AWS account which can be used to deploy tasks and services.*
>
> *With EC2 mode you pay for the EC2 instances regardless of container usage*
>
> *Fargate mode uses shared AWS infrastructure, and ENI's which are injected into your VPC*
>
> *You pay only for container resources used while they are running*
>

### EC2 Mode

- EC2 cluster is created within a VPC - benefit from multiple AZ’s
- **ASG - Auto Scaling Group**
- Horizontal scaling
- Container Registry (ECR)
- **If you want to use containers, but need to manage the host the container is running on - EC2!**
- Keep overhead and flexibility

![Untitled](img/Untitled%2066.png)

### Fargate Mode

- “Serverless” - No servers to manage
- Not paying for EC2 instances regardless of you’re using them or not
- How containers are hosted are different from EC2 mode
- Fargate Shared Infrastructure
- **Tasks are services actually running from a shared infrastructure platform**
- **Tasks *injected* into the VPC - given ENI**
- A lot of customizability
- **You only pay for the containers you are using based on the resources you consume!**

### EC2 vs ECS (EC2) vs Fargate

- If you use containers - **ECS!**
- **Large** workload - **price conscious** - **EC2 Mode**
- Beware of management overhead
- **Large** workload - **overhead** conscious - **Fargate**
- **Small/burst** workloads - **Fargate**
- **Batch/periodic** workloads - **Fargate**

## Elastic Container Registry (ECR)

- Managed **container image registry** service
- like Dockerhub but for AWS
- Each AWS account has a public and private registry
- Each **registry** can have many repository
- Each **repository** can contain many **images**
- **Images** can have several **tags**
- **Public** = public R/O
- R/W requires permissions
- **Private** = permissions required for any R/O or R/W
- Integrated with IAM
- Image scanning, **basic** and **enhanced** (inspector)
- nr real-time **Metrics** → CW(auth, push, pull)
- **API** actions = **CloudTrail**
- **Events →** EventBridge
- Replication
- Cross-region AND Cross-account
-

## Kubernetes 101

> ***Kubernetes**, also known as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications.*
>

### Cluster Structure

![Untitled](img/Untitled%2067.png)

### Cluster Detail

![Untitled](img/Untitled%2068.png)

### Key Concepts

- **Cluster** - A deployment of Kubernetes, management, orchestration …
- **Node** - Resources; pods are placed on nodes to run
- **Pod** - 1+ containers; smallest unit in Kubernetes; often 1 container 1 pod
- **Service** - Abstraction, service running on 1 ore more pods
- **Job** - ad-hoc, creates one ore more pods until completion
- **Ingress** - Exposes a way into a service (**Ingress → Routing → Service → 1+ Pods)**
- **Ingress Controller -** used to provide ingress (e.g. AWS LB Controller uses ALB/NLB)
- **Persistent** Storage (**PV)** - Volume whose lifecycle lives beyond any 1 pod using it

## Elastic Kubernetes Service (EKS) 101

> *Amazon **Elastic** **Kubernetes** **Service** (Amazon EKS) is a fully-managed, **Kubernetes** implementation that simplifies the process of building, securing, operating, and maintaining **Kubernetes** clusters on AWS.
Kubernetes as a Service (KaaS?)*
>
- AWS Managed Kubernetes - open source & **cloud agnostic**
- AWS, Outposts, EKS Anywhere, EKS Distro
- **Control plane scales** and runs on **multiple AZs**
- **Integrates** with **AWS services** - ECR, ELB, IAM, VPC
- **EKS Cluster**  = EKS Control Plane & EKS Nodes
- **etcd** distributed across **multiple AZs**
- **Nodes** - Self managed, managed node groups or Fargate pods
- Windows, GPU, Inferentia, Bottlerocket, Outposts, Local zones
- Check node type
- **Storage Providers** include - EBS, EFS, FSx Lustre, FSx for NetApp ONTAP
- Two VPC!
- AWS Managed
- Customer VPC
- These will communicate

![Untitled](img/Untitled%2069.png)


