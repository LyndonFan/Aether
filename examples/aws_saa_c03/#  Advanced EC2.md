#  Advanced EC2

## Bootstrapping EC2 Using User Data

> *EC2 Bootstrapping is the process of configuring an EC2 instance to perform automated install & configuration steps 'post launch' before an instance is brought into service. With EC2 this is accomplished by passing a script via the User Data part of the Meta-data service - which is then executed by the EC2 Instance OS*
>

### EC2 Bootstrapping

- Bootstrapping is a process which allows a system to self-configure
- Bootstrapping allows **EC2 Build Automation**
- http://169.254.169.254/latest-user-data
- Anything in User Data is **executed** by the **instance OS**
- **ONLY on launch**
- EC2 doesn’t interpret, the OS needs to understand the User Data

![Untitled](img/Untitled%2070.png)


### User Data Key Points

- It’s **opaque** to EC2 - its just a **block of data**
- It’s **NOT** secure - don’t use it for passwords or long term credentials (ideally)
- User data is limited to 16 KB in size
- Can be modified when instance is stopped
- But **only executed once at launch**

![Untitled](img/Untitled%2071.png)


## Enhanced Bootstrapping with CFN-INIT

> *CFN-INIT is a powerful desired-state-like configuration engine which is part of the CFN suite of products.*
>
>
> *It allows you to set a state for things like packages, users, groups, sources and files within resources inside a template - and it will make that change happen on the instance, performing whatever actions are required.*
>
> *Creation policies create a 'WAIT STATE' on resources .. not allowing the resource to move to CREATE_COMPLETE until signalled using the cfn-signal tool.*
>
- **cfn-init** helper script - installed on EC2 OS
- Simple configuration management system
- Procedural (User Data) vs Desired State (cfn-init)
- Packages, Groups, Users, Sources, Files, Commands and Services
- Provided with directives via **Metadata** and **AWS::ClodFormation::Init** on a CFN resource
- Variables passed into User Data by CloudFormation

### cfn-init

![Untitled](img/Untitled%2072.png)

### CreationPolicy and Signals

- `-e $?` = output of previous command

![Untitled](img/Untitled%2073.png)

## EC2 Instance Roles & Profile

> *EC2 Instance roles and Instance Profiles are how applications running on an EC2 instance can be given permissions to access AWS resources on your behalf.*
>
>
> *Short Term Temporary credentials are available via the EC2 Instance Metadata and are renewed automatically by the EC2 and STS Services.*
>
> Starts with an IAM role with a permissions policy. EC2 instance role allows the EC2 service to assume that role.
>
> The **instance profile** is the item that allows the permissions to get inside the instance. When you create an instance role in the console, an instance profile is created with the same name.
>
> When IAM roles are assumed, you are provided temporary roles based on the permission assigned to that role. These credentials are passed through instance **meta-data**.
>
> EC2 and the secure token service ensure the credentials never expire.
>

### EC2 Instance Roles

- Credentials are inside meta-data
- iam/security-credentials/role-name
- Automatically rotated - Always valid
- Should always be used rather than adding access keys into instance
- CLI tools will use ROLE credentials automatically

## AWS Systems Manager Parameter Store

> *The SSM Parameter store is a service which is part of Systems Manager which allows the storage and retrieval of parameters - string, stringlist or secure string.*
>
>
> *The service supports encryption which integrates with KMS, versioning and can be secured using IAM.*
>
> *The service integrates natively with many AWS services - and can be accessed using the CLI/APIs from anywhere with access to the AWS Public Spare Endpoints.*
>

```bash
aws ssm get-parameters --names /my-app/dbstring # return JSON object

aws ssm get-parameters-by-path --path /my-app/ # return three parameters - three JSON objects

aws ssm get-parameters-by-path --path /my-app/ --with-decryption # decrypt encrypted parameters. require permissions to both interact with SSM and KMS
```

### SSM Parameter Store

- Storage for **configuration & secrets**
- String, StringList & SecureString
- License codes, Database Strings, Full Configs & Passwords
- Hierarchies & Versioning
- Plaintext and Ciphertext
- Public Parameters - **Latest AMIs per region**

![Untitled](img/Untitled%2074.png)

## System and Application Logging on EC2

> *CloudWatch and CloudWatch Logs cannot natively capture data inside an instance.*
>

### Logging on EC2

- CloudWatch is for metrics
- CloudWatch Logs is for logging
- Neither capture *data inside an instance*
- CloudWatch Agent is required - runs inside the instance
- Needs configuration and permissions

![Untitled](img/Untitled%2075.png)

## EC2 Placement Groups

> *Allows you to influence placement, having instances physically closer to each other*
>

### Cluster Placement Groups

> *Pack Instances close together. **PERFORMANCE!***
>
- Absolute highest **performance** possible within EC2
- In a single AZ
- Same Rack
- Sometime **same host**
- All members have direct connections to each other
- Up to 10Gbps per stream
- 5Gbps normally
- Lowest latency and max PPS possible
- Tradeoff: Little to no resilience
- Can’t span AZs - one AZ only - locked when launching first instance
- Can span VPC peers - but impacts performance
- Requires a supported instance type
- Use the same type of instance (**not mandatory)**
- Launch at the same time (**not mandatory, very recommended)**
- **10Gbps single stream performance**
- Use cases:
- Performance
- Fast speeds
- Low latency

### Spread Placement Groups

> *Keep instances separated*
>
- Can span multiple AZs
- Distinct racks - if a single rack fail, fault is isolated to rack
- **7 instances per AZ - HARD LIMIT** - Isolated infrastructure limit
- Provides infrastructure isolation
- Each rack has its own network and power source
- Not supported for Dedicated Instances or Hosts
- Use case
- Small number of critical instances that need to be kept separated from each other

### Partition Placement Groups

> *Groups of instances spread apart*
>
- Across multiple AZs
- Divided into **“partitions”**
- MAX 7 per AZ
- Each partition has its own racks - no sharing between partitions
- Instances can be placed in a specific partition
- or auto placed
- Great for topology aware applications
- HDFS, HBase and Cassandra
- Contain the impact of failure to part of an application

## EC2 Dedicated Hosts

> *Dedicated hosts are EC2 Hosts which support a certain type of instance which are dedicated to your account.*
>
>
> *You can pay an on-demand or reserved price for the hosts and then you have no EC2 instance pricing to pay for instances running on these dedicated hosts.*
>
> *Generally dedicated hosts are used for applications which use physical core/socket licensing*
>
- EC2 Host **dedicated to you**
- Specific family, e.g. a1, c5, m5
- **No instance charges** - you pay for the host
- On-demand & Reserved options available
- Host hardware has **physical sockets and cores**

![Untitled](img/Untitled%2076.png)

![Untitled](img/Untitled%2077.png)

### Limitations & Features

- **AMI Limits** - RHEL, SUSE Linux, and Windows AMIs aren’t supported
- **Amazon RDS** instances are not supported
- **Placement groups** are not supported for dedicated hosts
- Hosts can be shared with other ORG Account… RAM

## Enhanced Networking & EBS Optimized

> *Enhanced networking is the AWS implementation of SR-IOV, a standard allowing a physical host network card to present many logical devices which can be directly utilized by instances.*
>
>
> *This means lower host CPU usage, better throughput, lower and consistent latency*
>
> *EBS optimization on instances means dedicated bandwidth for storage networking - separate from data networking.*
>

### Enhanced Networking

- Uses **SR-IOV** - NIC (Network Interface Card) is virtualization aware
- The host has multiple logical cards per physical card, which interacts with the instance
- **Higher I/O & Lower Host CPU Usage**
- More **bandwidth**
- Higher packets-per-second (**PPS)**
- Consistent **lower** **latency**
- Either enabled by default or available free of charge (for most instances)

### EBS Optimized

- **EBS** = Block storage over the network
- Historically network was **shared**
- **Data** and **EBS**
- EBS Optimized means **dedicated capacity** for EBS
- Most instances **support** and have **enabled by default**
- Some support, but enabling costs extra


