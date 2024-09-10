#  Relational Database Service (RDS)

## ACID vs BASE

💡 **CAP Theorem: Consistency, Availability, Partition Tolerant - *Choose two***

**ACID:
- Atomic:** All or nothing
**- Consistent:** From one valid state to another
**- Isolated:** Transactions don’t interfere with each other
**- Durable:** Stored on non-volatile memory. Resilient to crash.

**BASE:
- Basicly Available:** Read and write available *as much as possible without consistency guarantees*
**- Soft State:** Db doesn’t enforce consistency. Offload onto app/user
**- Eventually:** Eventually consistent (wait long enough)


- DynamoDB is BASE

## Database on EC2

- Splitting DB and App into different AZs introduce dependencies between AZs

Reasons to host DB on EC2:

- Access to the DB instance OS
- **Advanced DB Option tuning** (**DBROOT**)
- Vendor demands
- **DB or DB version AWS don’t provide**
- Specific **OS/DB Combination** AWS don’t provide
- Architecture AWS don’t provide (replication/resilience)
- Decision makers who *just want it*

Reasons to NOT host DB on EC2:

- **Admin overhead** - managing EC2 and DBHost
- **Backup** / DR Management
- EC2 is **single AZ**
- **Features -** some of AWS DB products are amazing
- EC2 is **ON** or **OFF** - no serverless, no easy scaling
- **Replication** - skills, setup time, monitoring & effectiveness
- **Performance** - AWS invest time into optimization and features

## Relational Database Service (RDS)

> *The Relational Database Service (RDS) is a Database(server) as a service product from AWS which allows the creation of managed databases instances.*
>
- ❌ “Database as a Service” (DBaaS)
- Not completely true
- ✅ **DatabaseServer-as-a-Service!**
- **Managed Database** Instance (1+ Databases)
- Multiple engines **MySQL, MariaDB, PostgresSQL, Oracle, Microsoft SQL Server**
- **Amazon Aurora**
- Different from the other engines

### RDS Architecture

![Untitled](img/Untitled%2092.png)

### RDS Database Instance

![Untitled](img/Untitled%2093.png)

## RDS Multi AZ

> *MultiAZ is a feature of RDS which provisions a standby replica which is kept in sync Synchronously with the primary instance.*
>
>
> *The **standby replica** cannot be used for any performance scaling ... only availability.*
>
> *Backups, software updates and restarts can take advantage of MultiAZ to reduce user disruption.*
>

In case of failure of the primary DB, the CNAME points to the standby DB

![Untitled](img/Untitled%2094.png)

- **No Free-tier!** Extra cost for standby replica
- Standby **can’t be directly used**
- **60-120 seconds failover**
- **Same region only** (other AZs in the VPC)
- Backups taken from Standby (removes performance impact)
- AZ Outage, Primary Failure, Manual failover, Instance type change and software patching

## RBD Backups and Restores

> *RDS is capable of performing Manual Snapshots and Automatic backups*
>
>
> *Manual snapshots are performed manually and live past the termination of an RDS instance*
>
> *Automatic backups can be taken of an RDS instance with a 0 (Disabled) to 35 Day retention.*
>
> *Automatic backups also use S3 for storing transaction logs every 5 minutes - allowing for point in time recovery.*
>
> *Snapshots can be restored .. but create a new RDS instance*
>

### RTO vs RPO

**RTO: Recovery Time Objective**

- Time between DR event and full recovery
- Influenced by process, staff, tech and documentation
- Generally lower values cost more

**RPO: Recovery Point Objective**

- Time between last backup and the incident
- Amount of maximum data loss
- Influences technical solution and cost
- Generally lower values cost more

### RDS Backups

**Automatic Backups**

- Delete after 0 to 35 days
- Restore to any point in time in this window

**Manual Snapshots**

- Don’t expire - manual deletion

AWS Managed S3 Bucket → Region Resilient

First snap is FULL → Next incremental (only diff is size)

RDS Backups are snapshots of the entire RDS - not only one database

Every 5 minutes Transaction Logs is written to S3

### RDS Restores

- Creates a **NEW RDS Instance** - new address
- Snapshots = **single point in time**, creation time
- Automated = any 5 minute point in time
- Backup is restores and transaction logs are *replayed* to bring DB to desired point in time
- Restores **aren’t fast** - Think about *RTO*

## RDS Read-Replicas

> *RDS Read Replicas can be added to an RDS Instance - 5 direct per primary instance.*
>
>
> *They can be in the same region, or cross-region replicas.*
>
> *They provide read performance scaling for the instance, but also offer low RTO recovery for any instance failure issues*
>
> *N.B they don't help with data corruption as the corruption will be replicated to the RR.*
>

### Read-Replica Architecture

![Writes to replica after primary write is complete. ***Can*** be accessed for read operation, unlike Standby Replica. ](img/Untitled%2095.png)

Writes to replica after primary write is complete. ***Can*** be accessed for read operation, unlike Standby Replica.

### (**read)** Performance Improvements

- **5x** direct read-replicas per DB instance
- Each providing an **additional instance of read performance**
- Read-replicas can have read-replicas - **but lag starts to be a problem**
- **Global** performance improvements

### Availability Improvements

- Snapshots & Backups Improve RPO
- **RTO’s are a problem**
- RR’s offer **nr. 0 RPO**
- RR’s can be **promoted quickly** - low RTO
- **Failure only** - watch for data corruption
- **Read only - until promoted**
- Not reversible - delete and create new RR
- **Global availability improvements → Global resilience**
- **Scale READS, NOT WRITES**

## Amazon RDS Security

- **SSL/TLS** (in transit) is available for RDS, can be mandatory
- RDS supports **EBS volume** encryption - **KMS**
- Handled by **HOST/EBS**
- AWS or Customer Managed CMK generates **data keys**
- Data keys used for encryption operations
- Storage, logs, snapshots and replicas are encrypted with the same master key
- encryption can’t be removed
- RDS MSSQL and RDS Oracle Support **TDE**
- **TDE: Transparent Data Encryption**
- Encryption handled within the DB engine
- RDS Oracle supports integration with CloudHSM
- Much stronger key controls (even from AWS)

![Untitled](img/Untitled%2096.png)

### Amazon RDS IAM Authentication

![Untitled](img/Untitled%2097.png)

## Amazon Aurora Architecture

> *Aurora is a AWS designed database engine officially part of RDS*
>
>
> *Aurora implements a number of radical design changes which offer significant performance and feature improvements over other RDS database engines.*
>

### Aurora Key Differences

- Aurora architecture is **VERY** different from RDS
- Uses a **Cluster**
- A single **primary** instance + 0 or more **replicas**
- Replicas can read and be standby
- No local storage - uses **cluster volume**
- Faster provisioning and improved availability and performance

### Aurora Storage Architecture

- Replication happens at storage level
- Primary is the only allowed to write to storage - other nodes can read
- In case of damage or error, data is immediately repaired
- More resilient than normal RDS
- Up to 15 different replicas to failover to
- Quicker failover

![Untitled](img/Untitled%2098.png)

- All SSD Based - **high IOPS, low latency**
- Storage is billed based on **what’s used**
- **High water mark** - billed for the most used
- Being changed
- Storage which is freed up can be re-used
- Replicas can be added and removed without requiring storage provisioning
- Multiple endpoints
- Cluster endpoint
- Reader endpoint
- Load balance across replicas
- Custom endpoints

### Cost

- **No free-tier**
- Aurora doesn’t support Micro Instances
- Beyond RDS singleAZ (micro) Aurora offers better value
- Compute - hourly charge, per second, 10 minute minimum
- Storage - GB-month consumed, IO cost per request
- 100% DB size in backups are included

### Aurora Restore, Clone and Backtrack

- Backups in Aurora work in the same way as RDS
- Restores create a **new cluster**
- Backtrack can be used which allow **in-place rewinds** to a previous point in time
- Fast clones make a new database MUCH faster than copying all the data - **copy-on-write**
- Uses a tiny amount of storage - only stores the data changed since the clone was created

## Aurora Serverless

> *Is to Aurora what Fargate is to EC2*
>

### Aurora Serverless Concepts

- Scalable - **ACU** : **Aurora Capacity Units**
- Aurora Serverless cluster has a **MIN and MAX ACU**
- Cluster adjusts based on load
- Can go to **0 and be paused**
- Consumption billing per-second basis
- Same resilience as Aurora (6 copies across AZs)

### Aurora Serverless Architecture

![Untitled](img/Untitled%2099.png)

### Aurora Serverless: Use Cases

- **Infrequently** used application
- **New** applications
- **Variable** workloads
- **Unpredictable** workloads
- **Development** and **test** databases
- **Multi-tenant** applications

## Aurora Global Database

> *Aurora global databases are a feature of Aurora Provisioned clusters which allow data to be replicated globally providing significant RPO and RTO improvements for BC and DR planning. Additionally global databases can provide performance improvements for customers .. with data being located closer to them, in a read-only form.*
>
>
> *Replication occurs at the storage layer and is generally ~1second between all AWS regions.*
>

### Aurora Global DB Architecture

![Untitled](img/Untitled%20100.png)

### Key Concepts

- **Cross-Region DR and BC (Business Continuity)**
- RPO and RTO low
- **Global Read Scaling -** low latency performance improvements
- **~1s or less** replication between regions
- No impact on DB performance
- Secondary regions can have **16 replicas**
- Currently MAX 5 secondary regions

## Aurora Multi-Master Writes

> *Multi-master write is a mode of Aurora Provisioned Clusters which allows multiple instances to perform reads and writes at the same time - rather than only one primary instance having write capability in a single-master cluster. This lesson steps through the architecture and explains how the conflict resolution works.*
>
- Default Aurora mode is **single-master**
- **One R/W** and **0+ Read Only** Replicas
- Cluster Endpoint is used to write, read endpoint is used for load balanced reads
- Failover takes time - replica promoted to R/W
- In Multi-Master mode **all instances are R/W**
- *Almost* fault-tolerant
- Faster and much better availability
- Immediately send writes to other instance in case of crash

### Architecture

- Seems like single-master, but no load balanced endpoint
- App can initiate connection to one or both replicas
- Changes are committed to the other replica in addition to storage

![Untitled](img/Untitled%20101.png)

## Database Migration Service (DMS)

> *The Database Migration Service (DMS) is a managed service which allows for 0 data loss, low or 0 downtime migrations between 2 database endpoints.*
>
>
> *The service is capable of moving databases INTO or OUT of AWS.*
>
- A managed database migration service
- Runs using a **replication instance**
- **Source** and **destination endpoints** point at **source and target** databases
- **One endpoint MUST be on AWS!**
- Safe default option in exam

### Architecture

![Untitled](img/Untitled%20102.png)

### Schema Conversion Tool (SCT)

- SCT is used when converting **one database** engine to another
- Including DB → S3 (Migrations using SNS)
- SCT is **not used when migrating between DB’s of the same type**
- On-premises MySQL → RDS MySQL
- Works with **OLTP** DB Types (MySQL, MSSQL, Oracle)
- And **OLAP** (Teradata, Oracle, Vertica, Greenplum)
- *E.g. On-premises MSSQL → RDS MySQL*
- *E.g. On-premises Oracle → Aurora*

### (DMS) & Snowball

- Larger migrations might be multi-TB in size
- moving data over networks takes time and consumes capacity
- DMS can utilize snowball
1. **Use SCT to extract data locally and move to a snowball device**
2. **Ship the device back to AWS. They load onto an S3 bucket.**
3. **DMS migrates from S3 into the target store**
4. **Change Data Capture (CDC) can capture changes, and via S3 intermediary they are also written to the target database**


