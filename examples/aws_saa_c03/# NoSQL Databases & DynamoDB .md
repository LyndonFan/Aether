# NoSQL Databases & DynamoDB 

## DynamoDB - Architecture

> *DynamoDB is a NoSQL fully managed Database-as-a-Service (DBaaS) product available within AWS.*
>
- NoSQL **Public** Database-as-a-Service (**DBaaS**). **Key/Value & Document**
- **No self-managed servers** or infrastructure
- **Manual/automatic** provisioned performance IN/OUT or **on-demand**
- Highly Resilient
- **Across AZs**
- ***Optionally GLOBAL***
- **Really fast - single-digit milliseconds (SSD based)**
- Backups, point-in-time recovery, encryption at rest
- Event-Driven integration - do things when data changes

### DynamoDB Considerations

- NoSQL - **Preference** **DynamoDB** in exam
- Relational Data - **Generally NOT DynamoDB**
- Key/value - **Preference DynamoDB** in exam
- Access via console, CLI, API - **“No SQL”**
- Billed based **RCU, WCU, Storage** and **Features**
- No cost for infrastructure

### DynamoDB Tables

> Database-(table)-as-a-Service
>

![Untitled](img/Untitled%20227.png)

### On-Demand Backups

![Untitled](img/Untitled%20228.png)

### Point-in-time Recovery (PITR)

> Not enabled by default
>

![Untitled](img/Untitled%20229.png)

## Operations, Consistency and Performance

### Reading and Writing

- **On-Demand:** Unknown, unpredictable, low admin
- On-Demand: price **per million** R/W units
- **Provisioned** - **RCU** and **WCU** set on a per table basis
- ❗Every operation consumes at least **1 RCU/WCU**❗
- ❗1 RCU is **1 x 4KB** read operation per second ❗
- ❗1 WCU is **1 x 1KB** write operation per second ❗
- Every table has a RCU and WCU burst pool (**300 seconds)**

### Query

![Untitled](img/Untitled%20230.png)

### Scan

> Least efficient operation in DynamoDB, but also most flexible
>

![Untitled](img/Untitled%20231.png)

### Consistency Model

> **Eventually** or **strong**/immediate consistency
>

![Untitled](img/Untitled%20232.png)

### WCU Calculation

> If you need  to store **10 ITEMS per second** - **2.5K average size** per ITEM

Calculate **WCU per item** - ROUND UP! ITEM.SIZE / 1 KB (3)

**Multiply** by average **number per second** (30)

= **WCU Required** (30)
>

### RCU Calculation

> Need to retrieve **10 ITEMS per second** - **2.5K average size**

Calculate **RCU per item** - ROUND UP! ITEM.SIZE / 4KB = 1

**Multiply** by average read ops per second (10)

= Strongly Consistent RCU Required = 10

(50% of strongly consistent) = Eventually consistent RCU required = 5
>

## DynamoDB Local and Global Secondary Indexes

> *Local Secondary Indexes (LSI) and Global Secondary Indexes (GSI) allow for an alternative presentation of data stored in a base table.*
>
>
> *LSI allow for alternative SK's whereas with GSIs you can use alternative PK and SK.*
>

### DynamoDB Indexes

- Query is the most efficient operation in DDB
- Query can only work on 1 PK value at a time
- and optionally a single, or range of SK values
- Indexes are **alternative views** on table data
- ❗Different **SK** (**LSI**) or different **PK and SK** (**GSI**)❗
- ❗**Some** or **all attributes** (**projection**) ❗

### Local Secondary Indexes (LSI)

- LSI is an alternative view for a table
- **MUST** be created with a table❗
- **Use when strong consistency is required** ❗
- **5 LSI’s** per base table
- Alternative **SK** on the table❗
- **Shares** the **RCU** and **WCU** with the **table**❗
- Shared Capacity Settings with the table
- Attributes - ALL, KEYS_ONLY & INCLUDE

![Untitled](img/Untitled%20233.png)

### Global Secondary Indexes (GSI)

- Can be created **at any time**❗
- Default limit of **20 per base table**❗
- Use as default, when strong consistency is NOT required ❗
- Alternative **PK** and **SK**❗
- GSI’s have their own **RCU** and **WCU** allocations ❗
- Attributes - ALL, KEYS_ONLY & INCLUDE

![Untitled](img/Untitled%20234.png)

### LSI and GSI Considerations

- Careful with projection (KEYS_ONLY, INCLUDE, ALL)
- Queries on attributes NOT projected are expensive
- Use **GSIs** **as default**, LSO only when **strong consistency is required** ❗
- Use indexes for **alternative access patterns**

## Streams and Triggers

> *DynamoDB Streams are a 24 hour rolling window of time ordered changes to ITEMS in a DynamoDB table*
>
>
> *Streams have to be enabled on a per table basis , and have 4 view types*
>
> *KEYS_ONLY*
>
> *NEW_IMAGE*
>
> *OLD_IMAGE*
>
> *NEW_AND_OLD_IMAGES*
>
> *Lambda can be integrated to provide trigger functionality - invoking when new entries are added on the stream.*
>

### Stream Concepts

- Time ordered list of **ITEM CHANGES** in a table
- **24-hour** rolling window
- Enabled on a **per table** basis
- Records **INSERTS, UPDATE and DELETES**
- Different **view types** influence what is in the stream
- KEYS_ONLY
- NEW_IMAGE
- OLD_IMAGE
- NEW_AND_OLD_IMAGES

![Untitled](img/Untitled%20235.png)


### Trigger Concepts

> Event-driven architecture - respond to events
>
- **ITEM changes** generate an **event**
- That event **contains the data** which changed
- An **action is taken** using that data
- **AWS = Streams + Lambda**
- **Reporting & Analytics**
- **Aggregation, Messaging** or **Notifications**

![Untitled](img/Untitled%20236.png)

## Global Tables

> *DynamoDB Global Tables provides multi-master global replication of DynamoDB tables which can be used for performance, HA or DR/BC reasons.*
>
- Global tables provides **multi-master cross-region** replication
- Tables are created in multiple regions and added to the same global table (becoming replica tables)
- **Last writer wins** is used for conflict resolution
- Reads and writes can occur to **any region**
- Generally **sub-second** replication between regions
- Strongly consistent reads **ONLY** in the same region as writes
- Global **eventual consistency**
- Provides **Global HA and Global DR/BC**

## DynamoDB Accelerator (DAX)

> *DynamoDB Accelerator (DAX) is an in-memory cache designed specifically for DynamoDB. It should be your default choice for any DynamoDB caching related questions.*
>

### Traditional Caches vs DAX

![Untitled](img/Untitled%20237.png)

### DAX Architecture

![Untitled](img/Untitled%20238.png)

### DAX Considerations

- **Primary** NODE (**Writes**) and **Replicas** (**Read**)
- Nodes are **HA** - Primary failure = Election
- In-memory cache - Scaling. **Much faster reads, reduced costs**
- Scale **UP** and scale **OUT** (**Bigger** or **More**)
- Supports **write-through**
- DAX Deployed **WITHIN a VPC**
- Bad if strong consistency is required❗

## DynamoDB TTL

> *Amazon DynamoDB Time to Live (TTL) allows you to define a per-item timestamp to determine when an item is no longer needed. Shortly after the date and time of the specified timestamp, DynamoDB deletes the item from your table without consuming any write throughput. TTL is provided at no extra cost as a means to reduce stored data volumes by retaining only the items that remain current for your workload’s needs*
>

![Untitled](img/Untitled%20239.png)

## Amazon Athena

> *Amazon Athena is serverless querying service which allows for ad-hoc questions where billing is based on the amount of data consumed.*
>
>
> *Athena is an underrated service capable of working with unstructured, semi-structured or structured data*
>
- **Serverless** Interactive Querying Service
- Ad-hoc queries on data - pay only **data consumed**
- **Schema-on-read** - table-like translation
- Original data **never changed - remains on S3**
- Schema translates data → relational-like when read
- Output can be sent to **other services**

![Untitled](img/Untitled%20240.png)

### Athena Considerations

- Queries where **loading/transformation** **isn’t desired**
- **Occasional / ad-hoc** queries on data in S3
- **Serverless querying** scenarios - **cost conscious**
- Querying **AWS logs** - VPC Flow logs, CloudTrail, ELB logs, cost reports etc…
- AWS **Glue Data Catalog** & **Web Server Logs**
- w/ **Athena Federated Query**  - **other data sources**

## ElastiCache

> *ElastiCache is a managed in-memory cache which provides a managed implementation of the Redis or Memcached engines.*
>
>
> *It’s useful for read heavy workloads, scaling reads in a cost effective way and allowing for externally hosted user session state.*
>
- In-memory database - **high performance**
- Managed **Redis** or **Memcached** - as a serivce ❗
- Can be used to **cache data** - for **READ HEAVY** workloads with **low latency** requirements ❗
- **Reduces database** workloads (expensive)❗
- Can be used to store **Session Data** (**Stateless** Servers)❗
- **Requires application code changes!!**❗

![Untitled](img/Untitled%20241.png)

### Session State Data

![Untitled](img/Untitled%20242.png)

### Redis vs MemcacheD

**MemcacheD**

- Simple data structures
- No replication
- Multiple Nodes (sharding)
- No backups
- Multi-threaded
- Utilize CPU

**Redis**

- Advanced Structures
- Multi-AZ
- Replication (Scale reads)
- Backup & Restore
- Transactions
- More strict consistency requirements

## Redshift Architecture

> *Redshift is a column based, petabyte scale, data warehousing product within AWS*
>
>
> *Its designed for OLAP products within AWS/on-premises to add data to for long term processing, aggregation and trending.*
>
- **Petabyte**-scale **Data warehouse**
- **OLAP** (**Column** based) not OLTP (row/transaction)
- Pay as you use - similar structure to RDS
- Direct Query S3 using **Redshift Spectrum**
- Direct Query other DBs using **federated query**
- Integrates with AWS tooling such as Quicksight
- SQL-like interface JDBC/ODBC

### Architecture

- Server based (*not serverless*)
- **One AZ** in a VPC - network cost/performance
- **Leader node** - Query input, planning and aggregation
- **Compute node** - performing queries of data
- VPC security, **IAM** permissions, **KMS** at rest Encryption, **CW** monitoring
- Redshift **Enhanced VPC Routing** - VPC Networking ❗
- Routing based on VPC/SG etc

![Untitled](img/Untitled%20243.png)

## Redshift Resilience and Recovery

![Untitled](img/Untitled%20244.png)


