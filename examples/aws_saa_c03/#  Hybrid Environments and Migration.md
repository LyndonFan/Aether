#  Hybrid Environments and Migration

## Border Gateway Protocol 101

> *This lesson provides a high level introduction to the Border Gateway Protocol (BGP) which is used by some AWS services such as Direct Connect and Dynamic Site to Site VPNs.*
>
- Autonomous System (**AS**) - Routers controlled by one entity - a network in BGP
- **ASN** are unique and allocated by IANA (0-65535), 64512-65534 are private
- BGP operates over tcp/179 - it’s reliable
- **Not automatic** - peering is **manually configured**
- BGP is a **path-vector protocol** it exchanges the **best path** to a destination between **peers** - the path is called the **ASPATH**
- **iBGP** = Internal BGP - Routing within an AS
- **eBGP** = External BGP - Routing between AS

![Untitled](img/Untitled%20169.png)

## IPSec VPN Fundamentals

> *IPsec VPN negotiation occurs in two phases. In Phase 1, participants establish a secure channel in which to negotiate the IPsec security association (SA). In Phase 2, participants negotiate the IPsec SA for authenticating traffic that will flow through the tunnel.*
>
- IPSEC is a group of protocols
- It sets up **secure tunnels** across **insecure networks** between **two peers** (local and remote)
- Provides authentication and encryption

![Untitled](img/Untitled%20170.png)

- Remember - **symmetric encryption** is fast, but it’s a challenge to exchange keys securely
- **Asymmetric encryption** is slow, but you can easily exchange public keys
- IPSEC har two main phases
- **IKE PHASE 1** (Slow and heavy)
- Authenticate: Pre-shared key (password) / cert
- Using asymmetric encryption to agree on, and create a shared symmetric key
- IKE SA Created (phase 1 tunnel)
- **IKE PHASE 2** (Fast and agile)
- Uses the keys agreed in phase 1
- Agree encryption method, and keys used for bulk data transfer
- Create IPSEC SA - phase 2 tunnel (architecturally running over phase 1)

### Policy-Based VPNs

- **Rele sets** match traffic → a pair of SAa
- Different rules/security settings

### Route-Based VPNs

- Target matching (prefix)
- Matches a single pair of SA’a

### IKE Phase 1 Architecture

![Untitled](img/Untitled%20171.png)

### IKE Phase 2 Architecture

![Untitled](img/Untitled%20172.png)

### Route vs Policy Based

![Untitled](img/Untitled%20173.png)

## AWS Site-to-Site VPN

> *AWS Site-to-Site VPN is a hardware VPN solution which creates a highly available IPSEC VPN between an AWS VPN and external network such as on-premises traditional networks. VPNs are quick to setup vs direct connect, don't offer the same high performance, but do encrypt data in transit.*
>
- A logical connection between a VPC and on-premises network encrypted using IPSec, running over the **public internet**
- Full HA - if you design and implement it correctly
- ❗Quick to provision - **less than an hour!**
- Virtual Private Gateway (**VGW**)
- Customer Gateway (**CGW**)
- VPN Connection between the **VGW** and **CGW**

### VPN Considerations

- Speed Limitations ~**1.25 Gbps**
- Latency - **inconsistent, public internet**
- Cost - AWS hourly cost, GB out cost, data cap (on premises)
- Speed of setup - **hours** - all software configuration
- Can be used as a backup for Direct Connect (**DX**)
- Can be used with Direct Connect

### Static vs Dynamic VPN (BGP)

- Dynamic VPN uses BGP

![Untitled](img/Untitled%20174.png)

### Architecture Partial HA

![Untitled](img/Untitled%20175.png)

### Architecture HA

![Untitled](img/Untitled%20176.png)

## Direct Connect (DX) Concepts

> *AWS Direct Connect links your internal network to an AWS Direct Connect location over a standard Ethernet fiber-optic cable. One end of the cable is connected to your router, the other to an AWS Direct Connect router. With this connection, you can create virtual interfaces directly to public AWS services (for example, to Amazon S3) or to Amazon VPC, bypassing internet service providers in your network path. An AWS Direct Connect location provides access to AWS in the Region with which it is associated. You can use a single connection in a public Region or AWS GovCloud (US) to access public AWS services in all other public Regions.*
>
- A physical connection (1, 10 or 100 Gbps)
- Business Premises → DX Location → AWS Region
- Port Allocation at a DX Location
- Port hourly cost & outbound data transfer (inbound is free of charge)
- Provisioning time - physical cables & no resilience
- Low & consistent latency + High speeds ⚡
- AWS Private Services (VPCs) and AWS Public Services - **NO INTERNET**
- **❗DX is NOT ENCRYPTED ❗**

### DX Architecture

![Untitled](img/Untitled%20177.png)

## Direct Connect (DX) Resilience

> *This lesson steps through the architecture of a few resilient implementations of direct connect, starting with an overview of why the default implementation architecture of direct connect provides no resilience.*
>

💡 **DX is a physical technology!**


### Good

![Untitled](img/Untitled%20178.png)

### GREAT

![Untitled](img/Untitled%20179.png)

## AWS Transit Gateway (TGW)

> *The AWS Transit gateway is a network gateway which can be used to significantly simplify networking between VPC's, VPN and Direct Connect.*
>
>
> *It can be used to peer VPCs in the same account, different account, same or different region and supports transitive routing between networks.*
>
- **Network Transit Hub** to connect VPCs to on premises networks
- Significantly reduces network complexity
- Single network object - HA and Scalable
- **Attachments** to other network types
- **VPC, Site-to-Site VPN** & **Direct Connect Gateway**

### TGW Considerations

- ❗**Supports transitive routing!**
- Can be used to create global networks
- Share **between accounts using AWS RAM**
- Peer with different regions - same or cross account
- **Less complexity** vs without TGW

### Architecture

![Untitled](img/Untitled%20180.png)

## Storage Gateway - Volume

> *Storage gateway is a product which integrates local infrastructure and AWS storage such as S3, EBS Snapshots and Glacier.*
>
- **Virtual machine** (or **hardware appliance**)
- Presents storage using **iSCSI, NFS or SMB**
- Integrates with **EBS, S3 and Glacier** within AWS
- **Migrations, extensions, storage tiering, DR** and replacement of **backup systems**
- For the exam: Picking the right mode

### Storage GW Volume: Stored

- Primary location of data is on-prem

![Untitled](img/Untitled%20181.png)

### Storage GW Volume: Cached

- Primary location of data is AWS (S3)

## Storage Gateway Tape - VTL Mode

> *Storage gateway in VTL mode allows the product to replace a tape based backup solution with one which uses S3 and Glacier rather than physical tape media.*
>
- Large backups → Tape
- LTO-9 Media can hold 24TB Raw data (up to 60GB compressed)
- 1 tape drive can use 1 tape at a time
- **Loaders** (Robots) can swap tapes
- A **library** is 1+ **drive(s),** 1+ **loader(s)** and **slots**
- Drive - library - shelf (anywhere but the library)

![Untitled](img/Untitled%20182.png)

## Storage Gateway - File Mode

> *File gateway bridges local file storage over NFS and SMB with S3 Storage.*
>
>
> *It supports multi site, maintains storage structure, integrates with other AWS products and supports S3 object lifecycle Management*
>
- Bridges on-premises **file** storage and **S3**
- Mount Points (shares) available via **NFS or SMB**
- Map directly onto an **S3 bucket**
- **Files stored** into a **mount point**, are visible as objects in an **S3 bucket**
- Read and Write Caching ensure LAN-like performance

### Architecture: Two-side

![Untitled](img/Untitled%20183.png)

### Architecture: Multiple Contributors

![Untitled](img/Untitled%20184.png)

### Architecture: Multiple Contributors and Replication

![Untitled](img/Untitled%20185.png)

## Snowball & Snowmobile

> *Snowball, Snowball Edge and Snowmobile are three parts of the same product family designed to allow the physical transfer of data between business locations and AWS.*
>

### Key Concepts

- Move large amount of data **IN & OUT** of AWS
- Physical storage - **suitcase** or **truck**
- Ordered from AWS **Empty, Load up, Return**
- Ordered from AWS **with data, empty & Return**
- For exam: Which to use!

### Snowball

- Ordered from AWS, Log a Job, Device Delivered (not instant)
- Data Encryption uses KMS
- **50TB or 80TB capacity**
- 1 Gbps (RJ45 GBase-TX) or 10Gbps (LR/SR) Network
- **10TB to 10PB** economical range (**multiple devices**)❗
- Multiple devices to **multiple premises** ❗
- Only storage ❗

### Snowball Edge

- Both **storage and compute** ❗
- **Larger capacity** vs Snowball
- 10Gbps (RJ45), 10/25 (SFP), 45/50,100 Gbps (QSFP+)
- **Storage Optimized** (with EC2) - 80TB, 24 vCPU, 32 Gib RAM, 1TB SSD
- **Compute Optimized** - 100TB + 7.68 NVME, 52 vCPU and 208 GiB RAM
- **Compute with GPU -** As above - **with GPU!**
- Ideal for remote sites or where data processing on ingestion is needed

### Snowmobile

- Portable DC within a shipping container on a **truck** ❗
- Special order
- Ideal for single location when **10PB+** is required ❗
- Up to **100PB per snowmobile**
- Not economical for **multi-site** (unless huge) or sub **10PB** ❗
- LITERALLY A TRUCK

## AWS Directory Service

> *The Directory service is a product which provides managed directory service instances within AWS*
>
>
> *it functions in three modes*
>
> - *Simple AD - An implementation of Samba 4 (compatibility with basics AD functions)*
> - *AWS Managed Microsoft AD - An actual Microsoft AD DS Implementation*
> - *AD Connector which proxies requests back to an on-premises directory.*

### What’s a Directory?

- Stores **objects** (e.g. Users, Groups, Computers, Servers, File Shares) with a **structure** (domain/tree)
- Multiple trees can be grouped into a **forest**
- Commonly used in **Windows Environments**
- Sign-in to multiple devices with the same username/password provides centralized management for assets
- Microsoft Active Directory Domain Services (**AD DS**)
- AF FD most popular, open-source alternatives (**SAMBA)**

### What is Directory Service?

- **AWS Managed** implementation
- Runs within a **VPC**
- To implement **HA** - deploy into **multiple AZs**
- Some AWS services NEED a directory, e.g. **Amazon Workspaces**
- Can be **isolated** or **integrated** with existing **on-premises system**
- Or act as a ***proxy*** back to on-premises

### Simple AD Mode Architecture

- Simple AD ↔ SAMBA 4

![Untitled](img/Untitled%20186.png)

### AWS Managed Microsoft AD Architecture

![Untitled](img/Untitled%20187.png)

### AD Connector Architecture

![Untitled](img/Untitled%20188.png)

### Picking Between Modes

- ❗ **Simple AD should be default** ❗
- **Microsoft AD** - Applications in AWS which need **MS AD DS**, or you need to **TRUST AD DS**
- **AD Connector** - Use AWS Services which need a directory **without storing any directory info in the cloud** - proxy to your on-premises Directory

## AWS DataSync

> *AWS DataSync is a product which can orchestrate the movement of large scale data (amounts or files) from on-premises NAS/SAN into AWS or vice-versa*
>
- Data Transfer service **TO/FROM** AWS
- **Migrations, Data Processing Transfers, Archival/Cost Effective Storage or DR/BC**
- Designed to work at **huge scale**
- Keeps **metadata** (e.g. permissions/timestamps)
- Built in **data validation**

### Key Features

- **Scalable** - 10Gbps per agent (~100TB per day)
- **Bandwidth Limiters** (avoid link saturation)
- **Incremental** and **scheduled** transfer options
- **Compression** and **encryption**
- **Automatic recovery** from transit errors
- AWS **Service integration** - S3, EFS, FSx
- Pay as you use - per GB cost for data moved

### Architecture

![Untitled](img/Untitled%20189.png)

### DataSync Components

- **Task** - A “job” within DataSync. Defines what is being synced, how quickly, FROM where and TO where
- **Agent** - Software used to **read/write** to on-premises data stores using **NFS** or **SMB**
- **Location** - every task has two locations (TO/FROM). E.g. NFS, Server Message Block (SMB), Amazon EFS, Amazon FSx and S3

## FSx for Windows File Server

> *FSx for Windows Servers provides a native windows file system as a service which can be used within AWS, or from on-premises environments via VPN or Direct Connect*
>
>
> *FSx is an advanced shared file system accessible over SMB, and integrates with Active Directory (either managed, or self-hosted).*
>
> *It provides advanced features such as VSS, Data de-duplication, backups, encryption at rest and forced encryption in transit.*
>
- Fully managed **native windows** file servers/shares
- Designed for **integration** with **windows environments**
- Integrates with **Directory Service or Self-Managed AD**
- **Single** or **Multi-AZ** within a VPC
- **On-demand** and **Scheduled** backups
- Accessible using **VPC, Peering, VPN, Direct Connect**
- ❗Exam job: When to use FSx and when to use EFS ❗

### Architecture

![Untitled](img/Untitled%20190.png)

### FSx Key Features and Benefits

- **VSS**: User-Driven Restores
- ❗Native file system accessible over **SMB** ❗
- ❗**Windows permission model**❗
- Supports **DFS** - scale-out file share structure
- Managed - no file server admin
- ❗Integrates with **DS** AND **your own** directory ❗

## FSx for Lustre

> *FSx for Lustre is a managed file system which uses the FSx product designed for high performance computing*
>
>
> *It delivers extreme performance for scenarios such as Big Data, Machine Learning and Financial Modeling*
>
- Managed **Lustre** - Designed for **HPC - Linux** clients (**POSIX)**
- **Machine Learning, Big Data, Financial Modeling**
- 100’s **GB/s** throughput and sub millisecond latency
- Deployment types: **Persistent** or **Scratch**
- **Scratch:** Highly optimized for **short term** no replication & fast
- **Persistent:** **Longer term, HA (in one AZ), self-healing**
- Accessible over **VPN** or **Direct Connect**
- Metadata stored on Metadata Targets (**MST**)
- Objects are stored on called object storage target s(**OSTs**) (**1.17TiB**)
- **Baseline** performance based on size
- Size - min **1.2TiB** then increments of **2.4TiB**
- For **Scratch:** Base **200 MB/s** per **TiB** of storage
- **Persistent** offers **50 MB/s, 100MB/s and 200 MB/s per TiB** of storage
- Burst up to **1300 MB/s** per TiB (credit system)

### Key Points

- Scratch is designed for **pure performance**
- **Short term or temp workloads**
- NO HA - NO REPLICATION
- **Larger file systems** means **more servers, more disks and more chance of failure**
- Persistent has **replication** within ONE AZ only
- **Auto-heals** when hardware failure occurs
- You can **backup to S3** with **BOTH** (manual or automatic 0-35 day retention)
- ❗SMB/Windows → FSx for Windows ❗
- ❗POSIX / High Performance → FSx for Lustre ❗

### Conceptually

![Untitled](img/Untitled%20191.png)

### Architecture

![Untitled](img/Untitled%20192.png)

## AWS Transfer Family

> *AWS Transfer Family is a secure transfer service that enables you to transfer files into and out of AWS storage services.*
>
>
> *AWS Transfer Family supports transferring data from or to the following AWS storage services.*
>
> - *Amazon Simple Storage Service (Amazon S3) storage.*
> - *Amazon Elastic File System (Amazon EFS) Network File System (NFS) file systems.*
>
> *AWS Transfer Family supports transferring data over the following protocols:*
>
> - *Secure Shell (SSH) File Transfer Protocol (SFTP)*
> - *File Transfer Protocol Secure (FTPS)*
> - *File Transfer Protocol (FTP)*
> - *Applicability Statement 2 (AS2)*
- Managed file transfer service - Supports transferring TO or FROM S3 and EFS
- Provides managed “servers” which supports **protocols**
- File Transfer Protocol (FTP) - Unencrypted file transfer - Legacy
- FTPS - FTP with TLS
- Secure Shell (SSH) File Transfer Protocol (SFTP) File transfer over SSH
- Applicability Statement 2 (AS2) - Structured B2B Data
- Identities - **Service** managed, directory service, custom (Lambda/APIGW)
- Managed File Transfer Workflows (**MFTW)** - serverless file workflow engine
- **Multi-AZ**: Resilient and Scalable
- Provisioned **Server per hours** + data transferred
- FTP and FTPS - Directory Service or Custom IDP only
- FTP - VPC only (cannot be public)
- AS2 VPC Internet/internal Only
- If you need to access S3/EFS, but with **existing protocols**
- integrating with existing workflow
- or using **MFTW** to create new ones

### Architecture

![Untitled](img/Untitled%20193.png)

### Endpoint Type

![Untitled](img/Untitled%20194.png)


