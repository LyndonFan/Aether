# Network Storage & Data Lifecycle

## Elastic File System (EFS) Architecture

> *The Elastic File System (EFS) is an AWS managed implementation of NFS which allows for the creation of shared 'filesystems' which can be mounted within multi EC2 instances.*
>
>
> *EFS can play an essential part in building scalable and resilient systems.*
>

### Elastic File System

- **EFS** is an implementation of **NFSv4**
- EFS Filesystems can be **mounted in Linux**
- Use POSIX permissions
- **Shared** between many EC2 instances
- Exist separate from EC2 instances
- Private service, via **mount targets** inside a VPC
- Can be accessed from on-premises - **VPN** or **DX**
- **LINUX ONLY**
- **General Purpose** and **Max I/O** performance modes
- **General Purpose** = default for 99,9% of uses
- **Bursting** and **Provisioned** Throughput Modes
- **Standard** and **Infrequent Access (IA)** Classes
- Like S3
- Lifecycle policies can be used with classes

![Untitled](img/Untitled%20103.png)

## AWS Backup

> *Use AWS Backup to centralize and automate data protection across AWS services and hybrid workloads. AWS Backup offers a cost-effective, fully managed, policy-based service that further simplifies data protection at scale. AWS Backup also helps you support your regulatory compliance or business policies for data protection. Together with AWS Organizations, you can use AWS Backup to centrally deploy data protection policies to configure, manage, and govern your backup activity across your company’s AWS accounts and resources.*
>
- **Fully managed** data-protection (backup/restore) service
- **Consolidate** management into one place across **accounts** and across **regions**
- Supports a **wide range** of AWS products
- **Backup Plans** - frequency, window, lifecycle, vault, region copy
- **Resources** - What resources are backed up
- **Vaults** - Backup **destination** (container) - assign KMS key for encryption
- Vault **Lock** - write-once, read-many (**WORM)**, 72 hour cool off, then even AWS can’t delete
- **On-demand** - manual backups created
- **PITR**  - Point in time recovery


