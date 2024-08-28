#  AWS Fundamentals

## Public vs Private Services

![Untitled](img/Untitled.png)

## AWS Global Infrastructure

**AWS Regions + AWS Edge Locations**

**Geographic Separation:** Isolated **Fault Domain**

**Geopolitical Separation:** Different **governance**

**Location Control:** Performance

Region Code: us-east-1

Region Name: N. Virginia

**Availability Zone (AZ):** Level of granularity below regions. Isolated infrastructure within a region.

us-east-1a, us-east-1b, …, us-east-1f

**Service Resilience:**

- **Globally** resilient: IAM and Route 53. Can tolerate failure of multiple regions without affecting service.
- **Region** resilient: If an AZ in a region fails, the service can continue operating. If all AZ fails, the service fails.
- **AZ** resilient

## Virtual Private Cloud (VPC) Basics

💡 A virtual network inside AWS

**A VPC is within 1 account & 1 region** ❗

Private and isolated unless you decide otherwise

Two types: Default VPC and Custom VPCs

**Custom VPCs used in almost all AWS deployments. More later.**

VPCs are created within a region. VPCs cannot communicate outside their network unless you specifically allow it.
**By default a VPC is entirely private.**❗

**VPC CIDER (Classless Inter-Domain Routing):** Every VPC is allocated a range of IP addresses. If you allow anything to communicate to a VPC, it needs to communicate to that VPC CIDR. Any outgoing connection is going to originate from that VPC CIDR. Custom VPCs can have multiple CIDR ranges, but the default VPC only gets one, which is always the same.
❗**Default VPC IP range: 172.31.0.0/16** ❗

****Each subnet within a VPC is located within a AZ, and can never be changed. Default VPC is configured to have a subnet in every AZ. Each use a part of the IP range and cannot overlap. This is how a VPC is resilient.


### Default VPC Basic

- One per region - can be removed and recreated
- **Default VPC CIDR is always 172.31.0.0/16** ❗
- /20 subnet in each AZ in the region
- The higher the /number is the smaller the range. /17 is half the size of /16.
- **IGW: Internet Gateway**
- VPC
- **SG: Security Group**
- (EC2) Instances
- Stateful
- Incoming rule change = allow outgoing response traffic
- Open port 80 for incoming will allow port 80 for outgoing response
- Allow rules only
- Instances can have multiple SGs
- Allow CIDR, IP, SG as destination
- **NACL: Network Access Control List**
- Subnet
- Stateless
- Open rule 80 for incoming does not allow port 80 for outgoing
- Allow and deny rules
- Subnets can have only one NACL
- Only allow CIDR as destination
- Subnets assign public IPv4 addresses
- Best practice not to use default VPC

![Source: https://medium.com/awesome-cloud/aws-difference-between-security-groups-and-network-acls-adc632ea29ae](img/Untitled%201.png)

Source: https://medium.com/awesome-cloud/aws-difference-between-security-groups-and-network-acls-adc632ea29ae

## Elastic Compute Cloud (EC2) Basics

> ***EC2 is AWS’s implement of IaaS - Infrastructure as a Service**
Default compute service within AWS.
Provide access to VMs known as instances*
>

### EC2 Key Facts & Features

- IaaS - Provides Virtual Machines (Instances)
- **Private** service by default - uses VPC networking
- AZ resilient - Instance fails if AZ fails
- Different instance sizes and capabilities
- On-Demand Billing - **Per second**
- Local on-host storage or **Elastic Block Store (EBS)**
- Instance composition: CPU, memory, disk and networking. All four are billed when running. ❗
- Only disk storage is billed when stopped (EBS).

### Instance Lifecycle

- Running
- Stopped
- Terminated

### Amazon Machine Image (AMI)

- An EC2 instance can be created from an AMI, or an EC2 can be used to create an AMI
- Contains
- Permissions - who can and can’t use the AMI
- Public - Everyone can launch instances from that AMI (Linux and Windows)
- Owner - Implicit allow
- Explicit - specific AWS accounts allowed
- Boot Volume
- The drive that boots the OS
- Block Device Mapping
- Links the volumes the AMI have
- Mapping between volumes

### Connecting to EC2

- EC2 instances can run different OS’s
- Windows: **RDP - Remote Desktop Protocol**
- Protocol Port 3389
- Linux: SSH protocol
- Port 22

## Simple Storage Service (S3) Basics

- Global Storage Platform - regional based/resilient
- Data is replicated across AZs in that region
- Public service, unlimited data & multi-user
- Movies, audio, photos, text, large data sets
- Economical & accessed via UI/CLI/API/HTTP
- Should be your default storing point
- **Objects** & **Buckets**
- Objects is the data you store
- Buckets are container for objects

### S3 Objects

- A file made up of two parts: key and value
- E.g koala.jpg : koala-image
- Value is the content being stored
- 0 - 5 TB data
- Version ID
- Metadata
- Access Control
- Subresources

### S3 Buckets

- Never leaves a region unless you configure it to do so
- A bucket is identified by its bucket name, which must be **globally unique**
- Often AWS stuff is only unique within an account or region - bucket is exception to this
- Unlimited Objects
- Flat Structure - all objects are stored at root level in the bucket
- Folders are prefixed names - but objects are still stored at the same level

### Summary

- Bucket names are **globally unique**
- 3-63 characters, all lower case, no underscores
- Start with a lowercase letter or a number
- Can’t be IP formatted e.g. 1.1.1.1
- Buckets - **100 soft limit, 1000 hard per account**
- Unlimited objects in bucket, **0 bytes to 5TB**
- Key = Name, Value = Data
- **ARN: Amazon Resource Name**

### S3 Patterns and Anti-Patterns

- S3 is an **object** store - not **file** or **block**
- S3 has no file system - it is flat
- You **can’t mount** an S3 bucket as (K:\ or /images)
- Great for large scale data storage, distribution or upload
- Great for **“offload”**
- **INPUT** and/or **OUTPUT** to **MANY AWS** products

## CloudFormation Basics

> ***CloudFormation is a Infrastructure as Code (IaC) product in AWS which allows automation infrastructure creation, update and deletion**
Templates created in YAML or JSON
Templates used to create stacks, which are used to interact with resources in an AWS account*
>

### YAML

```yaml
AWSTemplateFormatVersion: "version date"

Description: # Must directly follow AWSTemplateFormatVersion if defined
String

Metadata: # Control the UI
template metadata

Parameters: # Add fields that prompt the user for more information
set of parameters

Mappings: # Key/Value pairs which can be used for lookups
set of mappings

Conditions: # Allow decision making. Create Condition / Use Condition.
set of conditions

Transform:
set of transforms

Resources:
set of resources

Outputs: # Outputs from the template being applied
set of outputs
```

### Template

- All those other things
- Resources

```yaml
Resources:
Instance:
Type: 'AWS::EC2::Instance' # Logical Resource
Properties:
ImageId: !Ref LatestAmiId
InstanceType: !Ref InstanceType
KeyName: !Ref KeyName

```


### Stack

- **A living representation of a template**
- Class/Instance ~ Template/Stack
- Physical Resource is the actual EC2 instance
- Create, Update or Delete Stack

## CloudWatch Basics

> *Core supporting service within AWS which provides metric, log and event management services.
Used through other AWS services for health and performance monitoring, log management and nerveless architectures*
>

![Untitled](img/Untitled%202.png)

- Collects and manages operational data
- **Metrics -** AWS Products, Apps, on-premises
- CloudWatch Agent to monitor outside AWS
- Also to monitor certain things within certain products requires the CW Agent
- UI, API, CLI
- CloudWatch **Logs** - AWS Products, Apps, on-premises
- Same as above for CW Agent
- CloudWatch **Events -** AWS Services & Schedules

### Namespace

- Can think of as a container - separate things into different areas
- Reserved: AWS/service → AWS/EC2

### Metric

- Collection of Time Ordered Set of Data points
- CPU Usage, Network I/O, Disk I/O

### Datapoint

- CPU Utilization Metric
- Consist of two things in its simplest form:
- Timestamp: 2019-12-03T08:45:45Z
- Value: 98.3 (% CPU utilization)

### Dimension

- Dimensions separate datapoints for different **things** or **perspectives** within the same metric
- Use dimensions to look at the metric for a specific InstanceId

### Alarm

- Linked to a specific metric
- Can set criteria for an alarm to move into an alarm state and further define an SNS or action
- Billing alarm is an example of this
- Three states: OK, ALARM, INSUFFICIENT DATA

## Shared Responsibility Model

> *The Shared Responsibility Model - is how AWS provide clarity around which areas of systems security are theirs, and which are owned by the customer.*
>

![Untitled](img/Untitled%203.png)

- AWS responsible for the security of the cloud
- Hardware/AWS Global Infrastructure
- Regions, AZ, Edge Locations
- Compute, Storage, Database, Networking
- Software
- Customer responsible for security in the cloud
- Client-side data encryption, integrity & authentication
- Server-side encryption (File system and/or data)
- Networking traffic protection (encryption, integrity, identity)
- OS, Network and Firewall configuration
- Platform, applications, identity and access management
- Customer Data

## High-Availability (HA) vs Fault-Tolerance (FT) vs Disaster Recovery (DR)

### High-Availability (HA)

> *Aims to ensure an agreed level of operational performance, usually uptime, for a higher than normal period.
**Maximizing a system’s uptime / minimize outages.***
>
- E.g.
- 99.9% = 8.77 hours /year downtime
- 99.999% = 5.26 minutes /year downtime
- User disruption, such as re-login, is okay
- If a server goes down, but another is ready on standby, users may notice small disruptions, but thats okay
- Often require redundant service or architecture to achieve the agreed SL

### Fault-Tolerance (FT)

> *Is the property that enables a system to **continue operating properly** in the event of the **failure of some** (one or more faults within) of its **components.
Operate through faults.***
>
- High availability is not enough
- If a server goes down, disruption is not okay
- The system must be able to tolerate the failure
- Levels of redundancy and system of components which can route around failures
- Implementing FT when you need HA is expensive and is harder to implement
- Implementing HA when you need FT can be a disaster

### Disaster Recovery (DR)

> *A set of policies, tools and procedures to **enable the recovery** or **continuation** of **vital** technology infrastructure and system **following a natural or human-induced disaster.
Used when FT and HA don’t work***
>
- Parachute

## Domain Name System (DNS) Basics

### DNS 101

- DNS is a **discovery service**
- Distributed database
- Translates machine into human and vice-versa
- [amazon.com](http://amazon.com) → 104.98.34.131
- It’s **huge** and has to be distributed
- Zone files that can be queried

### ❗Remember these ❗

- **DNS Client:** Your laptop, phone, tablet, PC, etc.
- **Resolver:** Software on your device, or a server which queries DNS on your behalf
- **Zone:** A part of the DNS database (e.g. amazon.com)
- **Zonefile:** Physical database for a zone
- **Nameserver:** Where zonefiles are hosted

### DNS Root

- Starting point of DNS
- www.amazon.com
- Read right to left
- Hosted on 13 Root servers
- Operated by 12 different large companies and organization
- Only operates the servers, not the database itself
- Each root server can be a cluster of servers
- Root Hints
- Provided by Vendor
- List of these root servers, pointer to DNS root servers
- Root Zone is operated by IANA - Internet Assigned Numbers Authority

### DNS Hierarchy

- Root zone - Database of top level domains | IANA
- .com, .org, .uk, etc.
- .com zone | Verisign
- amazon.com
- NS - w.x.y.z
- [amazon.com](http://amazon.com) zone
- www ⇒ 104.98.34.131

### Registry

- Organization that maintains the zones for a TLD

### Registrar

- Organization with relationship with .org TLD zone manager allowing domain registration

### DNS Resolution

![Untitled](img/Untitled%204.png)

### ❗Remember these❗

- **Root hints:** Config points at the root servers IPs and addresses
- **Root Server:** Hosts the DNS root zone
- **Root zone:** Point at TLD authoritative servers
- **gTLD:** generic Top Level Domain (.com .org etc)
- **ccTLD:** country-code Top Level Domain (.uk, .eu, etc)

## Route53 Fundamentals

### R53 Basics

- **Register** domains
- Host **Zones** … managed **nameservers**
- Global servers … single database
- Globally Resilient

### Register domains

- Registries
- .com .io .net
- Create a zonefile
- animals4life.org
- Put zonefile to four nameservers

### Hosted Zones

- **Zone files** in AWS
- Hosted on four managed name servers
- Can be **public**
- Or **private** … linked to **VPC(s)**
- Stores records (**recordsets)**

## DNS Record Types

### Nameserver (NS)

- Record types that allow delegation to occur in DNS
- .com zone
- Multiple nameserver records inside it for amazon.com
- Point at servers managed by the [amazon.com](http://amazon.com) team

### A and AAAA Records

- Map host names to IP
- A: www → ipv4
- AAAA: → ipv6

### CNAME Records

- Host to host
- ftp, mail, www (references) → A server
- Cannot point directly at an IP address, only other names

### MX Records

- Important for email
- MX records are used as part of the process of sending email
- E.g. inside [google.com](http://google.com) zone
- MX 10 mail
- means mail.google.com
- MX 20 mail.other.domain.
- Fully qualified domain name
- means mail.other.domain
- Lower values for the priority field means higher priority
- MX 20 is only used if MX 10 doesn’t work

### TXT Records

- Allow you to add arbitrary text to a domain
- E.g. [animals4life.org](http://animals4life.org) zone
- Add: TXT cats are the best
- Important to prove that you own domain (animals4life.com)

### TTL - Time To Live

- TTL 3600 (seconds)
- Value configured by [amazon.com](http://amazon.com) admin
- Results of query stored at the resolver server for 1 hour
- **Authoritative:** Query results directly from [amazon.com](http://amazon.com) server
- **Non-authoritative:** If another client queries the resolver within 3600 seconds, the resolver can immediately return the results of the query

![Untitled](img/Untitled%205.png)



