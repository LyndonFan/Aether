#  High Availability (HA) & Scaling

## Regional and Global AWS Architecture

- Global **Service Location & Discovery**
- Content Delivery (**CDN**) and optimization
- Global **health checks** and **Failover**
- Regional **entry point**
- **Scaling & Resilience**
- Application services and **components**

![Untitled](img/Untitled%20104.png)

### Tiers

- Web Tier
- Compute Tier
- Storage
- Caching
- DB Tier
- App Services

![Untitled](img/Untitled%20105.png)

## Evolution of Elastic Load Balancers (ELB)

> *The Elastic Load Balancer (ELB) was introduced in 2009 with the 'now called' Classic Load Balancer*
>
>
> *Two new versions the v2 Application and v2 Network load balancers are now the recommended solutions.*
>
- Three types of load balancers (ELB) available within AWS
- Split between v1 (**avoid/migrate)** and **v2** (prefer)
- Classic Load Balancer (**CLB**) - **v1** - Introduced in 2009
- Not really layer 7, lacking features, **1 SSL per CLB**
- Application Load Balancer (**ALB)** - v2 - HTTP/S/WebSocket
- Network Load Balancer (NLB) - v2 - TCP, TLS, UDP
- V2 = faster, cheaper, support target groups and rules

## Elastic Load Balancer Architecture (ELB)

> *Elastic Load Balancers are a core part of any scaling architecture within AWS. Accept and distribute connections.*
>

### ELB Architecture

- IPv4 only or dual-stack (include IPv6)
- Pick AZ load balancer will use
- Subnets in two or more AZs
- Pick only one subnet in each AZ

![Untitled](img/Untitled%20106.png)

![Untitled](img/Untitled%20107.png)

### Cross-Zone LB

Equally distribute load to instances across AZs

![Untitled](img/Untitled%20108.png)

### Key Points

- ELB is a **DNS A** Records pointing at **1+** Nodes per AZ
- Nodes (in one subnet per AZ) can scale
- **Internet-facing** means nodes have **public IPv4 IPs**
- **Internal** is **private only IPs**
- EC2 **doesn’t need to be public to work with a LB**
- **Listener** configuration controls **WHAT** the LB does
- **8+** free IPs per subnet, and **/27** subnet to allow scaling

## Application Load Balancing (ALB) vs Network Load Balancing (NLB)

### Load Balancer Consolidation

> CLBs bad
>

![Untitled](img/Untitled%20109.png)

### Application Load Balancer (ALB)

- **Layer 7** load balancer
- Listens on **HTTP/HTTPS**
- **No other Layer 7 protocols (**SMTP, SSH, Gaming)
- And **NO TCP/UDP/TLS Listeners**
- L7 content type, cookies, custom headers, user location and app behaviour
- HTTP HTTPS (SSL/TLS) always terminated on the ALB - **no unbroken SSL** (security teams!)
- **A new connection is made to the application**
- ALBs **MUST** have **SSL** certs if **HTTPS** is used
- ALBs are **slower** than **NLB**. More levels of the networks stack to process
- Health checks **evaluate application health**
- Layer 7

### ALB Rules

- Rules **direct connections** which arrive at a listener
- Processed in **priority order**
- **Default rule = catchall**
- **Rule Conditions:** host-header, http-header, http-request-method, path-pattern, query-string and source-ip
- **Actions:** forwards, redirects, fixed-response, authenticate-oids & authenticate-cognito

![Untitled](img/Untitled%20110.png)

### Network Load Balancer (NLB)

- Layer 4 load balancer
- TCP, TLS, UDP, TCP_UDP
- **No visibility** or **understanding** of HTTP/HTTPS
- **No headers, no cookies, no sessions stickiness**
- Really really really fast (**millions of rps, 25% of ALB latency)**
- SMTP, SSH, Game Servers, financial apps (not http/s)
- Health checks JUST check ICMP / TCP Handshake
- **Not app aware**
- NLBs can have **static IPs** useful for whitelisting
- **Forward TCP** to instances
- **Unbroken encryption**
- Used with private link to provide services to other VPCs

### ALB vs NLB

- Default to ALB
- Unbroken encryption? NLB
- Static IP for whitelisting? NLB
- The fastest performance? NLB
- Protocols not HTTP or HTTPS? NLB
- Private link? NLB
- Otherwise? **ALB!**

## Launch Configuration and Templates

> *Launch Configurations and Launch Templates provide the **WHAT** to Auto scaling groups.*
>
>
> *They define WHAT gets provisioned*
>
> *The AMI, the Instance Type, the networking & security, the key pair to use, the user data to inject and IAM Role to attach.*
>

### LC and LT Key Concepts

- Allow you to define the configuration of an EC2 instance **in advance**
- AMI, Instance Type, Storage & Key pair
- Networking and Security Groups
- User data & IA Role
- Both are NOT editable - defined once. LT has versions.
- Must create a new one
- LT provide **newer features** - including T2/T3 Unlimited, Placement Groups, Capacity Reservations, Elastic Graphics

### LC and LT Architecture

![Untitled](img/Untitled%20111.png)



## Auto Scaling Groups

> An *Auto Scaling group* contains a collection of Amazon EC2 instances that are treated as a logical grouping for the purposes of automatic scaling and management. An Auto Scaling group also enables you to use Amazon EC2 Auto Scaling features such as health check replacements and scaling policies. Both maintaining the number of instances in an Auto Scaling group and automatic scaling are the core functionality of the Amazon EC2 Auto Scaling service.
>
- **Automatic Scaling** and **Self-Healing** for EC2
- Uses **Launch Templates** or **Launch Configurations**
- Has a **Minimum,** **Desired** and **Maximum Size** ( e.g. 1:2:4)
- Keep running instances at the **Desired capacity** by provisioning or **terminating** instances
- **Scaling Policies** automate based on metrics

![Untitled](img/Untitled%20112.png)

### ASG Architecture

![Untitled](img/Untitled%20113.png)

### Scaling Policies

- **Manual Scaling** - Manually adjust the desired capacity
- **Scheduled Scaling** - Time based adjustment - e.g. Sales
- **Dynamic Scaling**
- **Simple:** “CPU above 50% +1”, “CPU Below 50 -1”
- Memory, Disk, I/O etc. metrics also available
- **Stepped Scaling:** Bigger +/- based on difference
- **Target Tracking**: Desired Aggregate CPU = 40% - ASG handle it
- **Cooldown Periods:** How long to wait before provisioning

### ASG + Load Balancers

![Untitled](img/Untitled%20114.png)

### Scaling Processes

- **Launch** and **Terminate:** SUSPEND and RESUME
- **AddToLoadBalancer:** Add to LB on launch
- **AlarmNotification:** Accept notification from CW
- **AZRebalance:** Balances instances evenly across all of the AZs
- **HealthCheck:** Instance health checks on/off
- **ReplaceUnhealthy:** Terminate unhealthy and replace
- **ScheduledActions:** Scheduled on/off
- **Standby:** Use this for instances ‘InService vs Standby’

### Final Points

- Autoscaling Groups are free
- Only the resources created are billed
- Use cool downs to avoid rapid scaling
- Think about **more, smaller** instances - **granularity**
- Use with ALB’s for elasticity - **abstraction**
- ASG defines **WHEN** and **WHERE**. LT defines **WHAT**
- **Auto Scaling Default Termination Policy:** ❗
1. AZ with the most running instances
2. Instance that was launched from the oldest launch template
3. Instance closest to the next billing hour and terminates

## ASG Scaling Policies

> *With step scaling and simple scaling, you choose scaling metrics and threshold values for the CloudWatch alarms that trigger the scaling process. You also define how your Auto Scaling group should be scaled when a threshold is in breach for a specified number of evaluation periods.*
>
>
> *Step scaling policies and simple scaling policies are two of the dynamic scaling options available for you to use. Both require you to create CloudWatch alarms for the scaling policies. Both require you to specify the high and low thresholds for the alarms. Both require you to define whether to add or remove instances, and how many, or set the group to an exact size.*
>
> *The main difference between the policy types is the step adjustments that you get with step scaling policies. When step adjustments are applied, and they increase or decrease the current capacity of your Auto Scaling group, the adjustments vary based on the size of the alarm breach.*
>
- ASGs don’t NEED scaling policies - they can have none
- Manual: Min, max & desired - Testing & Urgent
- Simple Scaling
- Add 1 if CPU is above X %
- Not that efficient
- Step scaling
- Upper and lower bounds of CPU level
- 50 < CPU < 60 - do nothing
- 60 < CPU < 70 - add 1
- Always better than simple - adjust better
- AWS recommends
- Target tracking
- Define ideal value, e.g. 50% CPU usage
- Add/remove to stay at ideal value
- Scaling based on **SQS - ApprocimateNumberOfMessagesVisible**

### ASG - Simple Scaling

![Untitled](img/Untitled%20115.png)

### ASG - Step Scaling

![Untitled](img/Untitled%20116.png)

## ASG Lifecycle Hooks

> Lifecycle hooks enable you to perform custom actions by *pausing* instances as an Auto Scaling group launches or terminates them. When an instance is paused, it remains in a wait state either until you complete the lifecycle action using the **complete-lifecycle-action** command or the `CompleteLifecycleAction` operation, or until the timeout period ends (one hour by default).
>
- **Custom Actions** on instances during ASG actions
- Instance launch or instance terminate transitions
- Instances are paused within the flow - they wait
- until a time (then either CONTINUE or ABANDON)
- or you resume the ASG process CompleteLifeCycleAction
- EventBridge or SNS Notifications

![Untitled](img/Untitled%20117.png)

## ASG Health Check Comparison - EC2 vs ELB

> *Amazon EC2 Auto Scaling can determine the health status of an instance using one or more of the following:*
>
> - *Status checks provided by Amazon EC2 to identify hardware and software issues that may impair an instance. The default health checks for an Auto Scaling group are EC2 status checks only.*
> - *Health checks provided by Elastic Load Balancing (ELB). These health checks are disabled by default but can be enabled.*
> - *Your custom health checks.*
- Three types of Health Checks:
- EC2 (Default)
- ELB (can be enabled)
- Custom
- **EC2** - Stopping, Stopped, Terminated, Shutting Down or Impaired (not 2/2/ status) = **UNHEALTHY**
- **ELB** - **HEALTHY** = Running & passing ELB health check
- can be more **application aware** (layer 7)
- **Custom** - Instances marked **healthy** & **unhealthy** by external system
- Health check grace period (Default **300s**) - **Delay before starting checks**
- allows **system launch**, **bootstrapping** and **application start**

## SSL Offload & Session Stickiness

> *SSL Bridging, SSL Pass Through, SSL Offloading*
>

### SSL Offload

- Bridging
- Pass-through
- Offload
- HTTP from ELB to EC2 instances

![Untitled](img/Untitled%20118.png)

### Connection Stickiness

![Untitled](img/Untitled%20119.png)

## Gateway Load Balancers (GWLB)

> *Gateway Load Balancers enable you to deploy, scale, and manage virtual appliances, such as firewalls, intrusion detection and prevention systems, and deep packet inspection systems. It combines a transparent network gateway (that is, a single entry and exit point for all traffic) and distributes traffic while scaling your virtual appliances with the demand.*
>

### Why do we need GWLB?

![Untitled](img/Untitled%20120.png)

### What is GWLB

- Help you **run and scale** 3rd party appliances
- things like **firewalls, intrusion detection** and **prevention** systems
- **Inbound** and **Outbound** traffic (transparent inspection and protection)
- **GWLB endpoints:** Traffic enters/leaves via these endpoints
- GWLB balances across multiple backend appliances
- Traffic and metadata is tunnelled using **GENEVE**

### How it works

![Untitled](img/Untitled%20121.png)

### GWLB Architecture

![Untitled](img/Untitled%20122.png)


