# Elastic Compute Cloud (EC2) Basics

> *AZ resilient - very reliant on the AZ it is running in*
>

## Virtualization 101

> *EC2 is virtualization as a Service (IaaS)*
>

💡 **Virtualization** is running more than one operating system on a physical hardware or server
**Kernel** is the only part of the operating system that is able to directly interact with the hardware (CPU & MEM, Network, Devices)


![Untitled](img/Untitled%2048.png)

![Untitled](img/Untitled%2049.png)

### Emulated Virtualization (Software Virtualization)

- Software run i privileged mode and had access to HW
- Emulated hardware, but OS believed it was running on real hardware.
- OS tried to control HW despite it
- Overwrite each other, crash
- Slow!

![Untitled](img/Untitled%2050.png)

### Para-Virtualization

- Only works on a small subset of OS
- Modified source code to call the hypervisor rather than the hardware
- OS became *almost* aware of virtualization

![Untitled](img/Untitled%2051.png)

### Hardware Assisted Virtualization

- Hardware itself is aware of virtualization

![Untitled](img/Untitled%2052.png)

### SR-IOV (Single Root IO Virtualization)

> In EC2 - This is **enhanced networking**
>
- Network card can present themself as multiple cards rather than one
- Less CPU usage for the host CPU

![Untitled](img/Untitled%2053.png)

## EC2 Architecture and Resilience

- EC2 instances are **virtual machines** (OS + Resources)
- EC2 Instances run on **EC2 Hosts**
- **Shared** hosts or **Dedicated** hosts
- Shared hosts default
- Hosts = 1 AZ - AZ Fails, Host Fails, Instances Fails
- **EBS: Elastic Block Storage**

![EC2 Architecture ](img/Untitled%2054.png)

EC2 Architecture

### What’s EC2 Good for?

- Traditional **OS+Application** Compute
- **Long-Running** compute
- **Server** style applications
- either **burst** or **steady-state** load
- **Monolithic** application stacks
- **Migrated** application workloads or **Disaster Recovery**
- **Tends to be default compute service within AWS!**

## EC2 Instance Types

- Raw CPU, Memory, Local Storage Capacity & Type
- **Resource Ratios**
- **Storage** and **Data** Network **Bandwidth**
- System Architecture / Vendor
- ARM vs x86
- Additional Feature and Capabilities
- GPUs, FPGAs

### EC2 Categories

> *Five main categories*
>
- **General Purpose**. *Default*. Diverse workloads, equal resource ratio.
- **Computed Optimized**. Media Processing, HPC, Scientific Modeling, gaming, Machine Learning
- **Memory Optimized**. Processing large in-memory datasets, some database workloads
- **Accelerated Computing**. Hardware GPU, fields programmable gate arrays (FPGAs)
- **Storage Optimized.** Sequential and Random IO - scale-out transactional databases, data warehousing, Elasticsearch, analytics workloads

### Decoding EC2 Types

> ***R5dn.8xlarge** -* Instance type
****R** - Instance Familiy
**5 -** generation
**dn** - can vary. (d NVMe storage, n network optimized)
**8xlarge** - Instance Size
>

![Untitled](img/Untitled%2055.png)

https://aws.amazon.com/ec2/instance-types/

https://instances.vantage.sh/

![Untitled](img/Untitled%2056.png)

## Storage Refresher

### Key Terms

- **Direct** (local) attached Storage - Storage on the EC2 Host
- **Network** attached Storage - Volumes delivered over the network (EBS)
- **Ephemeral storage** - Temporary Storage
- **Persistent** storage - Permanent storage - lives on past the lifetime of the instance
- **Block** storage - **Volume** presented to the OS as a collection of blocks. No Structure provided.
- **Mountable**
- **Bootable**
- **File** storage - Presented as a file share. Has structure.
- **Mountable.**
- **NOT Bootable**
- **Object storage**. Collection of objects, flat.
- **Not mountable**
- **Not bootable**
- S3

### **Storage Performance**

- IO (block size)
- “Bigger wheels”
- IOPS (Input Output Per Second)
- “Rev of wheels”
- Throughput (MB/s)
- “End speed”
- Block size: 16 KB, IOPS: 100 → 1.6 MB/s
- 1 MB block size wont necessarily lead to 1000 MB/s - throughput limits etc

## Elastic Block Storage (EBS)

> *Amazon Elastic Block Store (Amazon EBS) provides block level storage volumes for use with EC2 instances. EBS volumes behave like raw, unformatted block devices. You can mount these volumes as devices on your instances. EBS volumes that are attached to an instance are exposed as storage volumes that persist independently from the life of the instance. You can create a file system on top of these volumes, or use them in any way you would use a block device (such as a hard drive).*
>
- **Block storage:** Raw disk allocations (volume). Can be **encrypted using KMS**.
- Instances see block device and create **file system** on this device (ext3/4, xfs)
- Storage is provisioned in **ONE AZ (AZ Resilient)**
- Attached to *one EC2 instance (or other service) over a storage network
- **Detached** and **reattached**. Not lifecycle linked to one instance. **Persistent.**
- **Snapshot** (backup) into **S3**. Create a volume from snapshot (migrate **between AZs).**
- Different physical storage types, different sizes, different performance profiles.
- Billed based on **GB-month** (and is some cases performance)

![Untitled](img/Untitled%2057.png)

## EBS Volume Types - General Purpose SSD

> *GP2 and GP3*
>

## GP2

- 1GB to 16 TB
- 1 IO credit = 16 KB chunk of data
- IO Credit bucket **capacity of 5.4 million** IO Credits
- Fills at rate of **Baseline Performance**
- Bucket fills with min 100 IO Credits per second
- Regardless of volume size
- Beyond this, bucket **fill with 3 IO credits per second, per GB of volume size (Baseline Performance)**
- **Burst up to 3000 IOPS by depleting the bucket**
- Bucket starts off full! 5.4 million IO credits
- If you’re depleting the bucket at a higher rate than it’s refilling you’re losing credits
- Volumes up to 1 TB use this IO credit architecture
- Above 1 TB baseline is above burst. Credit system isn’t used and you **always achieve baseline**
- Up to maximum for GP2 of 16000 IO credit per second (baseline performance)

### GP3

> Removes credit bucket architecture
>
- **3000 IOPS**
- **125 MiB/s - Standard**
- GP3 is cheaper (20%) vs GP2
- Extra cost for up to 16000 IOPS or 1000 MiB/s
- 4x Faster max throughput vs GP2
- 1000 MiB/s vs 250 MiB/s
- Benefits of both GP2 and IO1
- Suitable for
- Virtual desktops, medium sized single instance databases such as MSSQL Server and Oracle DB, low-latency interactive apps, dev&test, boot volumes

## Provisioned IOPS SSD (io1/2)

- io1/2/BlockExpress
- IOPS can be adjusted independently of size
- Consistent Low latency and jitter
- Up to:
- 64000 IOPS per volume (4x GP2/3)
- 256000 IOPS per volume (Block Express)
- 1000 MB/s throughput
- 4000 MB/s throughput (Block Express)
- 4GB - 16TB io1/2
- 4GB-64TB BlockExpress
- Limits:
- io1 50 IOPS/GB (max)
- io2 500 IOPS/GB (max)
- BlockExpress 1000 IOPS/GB (max)
- Per instance restriction:
- io1 - 260000 IOPS & 7500 MB/s
- io2 - 160000 IOPS & 4750 MB
- io2 Block Express - 260000 IOPS & 7500 MB/s

![Untitled](img/Untitled%2058.png)


## HDD-Based

- Two types (three, but legacy)
- **st1**
- Throughput optimized
- Cheap
- 125GB - 16 GB
- Max 500 IOPS (1MB blocks)
- Max 500 MB/s
- 40MB/s TB Base
- 250 MB/s Burst
- Frequent Access
- Throughput-intensive
- Sequential
- Big data, data warehouses, log processing
- **sc1**
- Cheaper
- Cold
- Max 250 IOPS (1 MB blocks)
- Max 250 MB/s
- 12 MB/s/TB Base
- 80 MB/s/TB Burst
- Coder data requiring fewer scans per day
- Lowest cost HDD volume designed for less frequently accessed workloads
-

## Instance Store Volumes

> An *instance store* provides temporary block-level storage for your instance. This storage is located on disks that are physically attached to the host computer. Instance store is ideal for temporary storage of information that changes frequently, such as buffers, caches, scratch data, and other temporary content, or for data that is replicated across a fleet of instances, such as a load-balanced pool of web servers.
>
>
> An instance store consists of one or more instance store volumes exposed as block devices. The size of an instance store as well as the number of devices available varies by instance type.
>
> The virtual devices for instance store volumes are `ephemeral[0-23]`. Instance types that support one instance store volume have `ephemeral0`. Instance types that support two instance store volumes have `ephemeral0` and `ephemeral1`, and so on.
>
- **Block Storage** devices
- Physically connected to **one EC2 host**
- Instances **on that host** can access them
- **Highest storage performance in AWS!**
- Included in instance price
- **ATTACH AT LAUNCH!**
- Can’t be added after launch

![Untitled](img/Untitled%2059.png)

- When instances move across volumes their storage will be blank
- Stop and start will migrate to a new host
- D3 = 4.6 GB/s throughput
- I3 = 16 GB/s of sequential throughput
- **More IOPS and throughput vs EBS!**

### Key points

- Local on EC2 Host
- Add at **launch ONLY**
- Lost if instance **move, resize or hardware failure**
- High performance
- Tradeoff - much higher performance but higher risk
- You pay for it anyway - included in instance price
- **TEMPORARY!**
- Not for persistent storage of data

## Instance Store vs EBS

### EBS

- Persistence
- Resilience
- Storage isolated from lifecycle
- Resilience with app in-built replication
- High performance needs

### Instance Store

- Resilience with app in-built replication
- High performance needs
- Super high performance needs
- Cost (often included)

### Instance Store vs EBS

- **Cheap = ST1 or SC1**
- **Throughput, streaming… = ST1**
- **Boot = NOT ST1 or SC1**
- GP2/3 - up to 16000 IOPS
- IO1/2 up to 64000 IOPS (*256000)
- RAID0 + EBS up to 260000 IOPS (io1/2-BE/GP2/3)
- More than 260000 IOOPS → **INSTANCE STORE!**

## EBS Snapshots

> *EBS Snapshots are backups of data consumed within EBS Volumes - Stored on S3.*
>
>
> *Snapshots are incremental, the first being a full backup - and any future snapshots being incremental.*
>
> *Snapshots can be used to migrate data to different availability zones in a region, or to different regions of AWS.*
>
- Snapshots are incremental volume copies to S3
- The first is a **full copy** of “data” on the volume
- If 10GB of 40GB is used, the 10GB is copied
- Future snaps are **incremental**
- They only store the difference between this and previous snapshot
- Volumes can be created (restored) from snapshots
- Snapshots can be copied to another region
- **STOP** and **START** of EC2 instances will move to another host
- You will lose your data

### EBS Snapshots/Volume Performance

- New EBS volume = **full performance immediately**
- **Snaps restore lazily** - fetched gradually
- Requested blocks are fetched immediately
- Force a real of all data immediately
- Fast Snapshot Restore (**FSR)** - Immediate restore
- Up to 50 snaps per region. Set on the **Snap & AZ**

### Snapshot Consumption and Billing

- GB per month
- Used **NOT** allocated data

## CLI Commands to Mount Filesystem on a EBS Volume

```bash
# Commands User

## Instance 1

lsblk
sudo file -s /dev/xvdf # Output data, because EBS is only attached but has no mounted fs
sudo mkfs -t xfs /dev/xvdf # Make file system on EBS volune
sudo file -s /dev/xvdf # Will output file system
sudo mkdir /ebstest # Make directory to mount EBS on
sudo mount /dev/xvdf /ebstest # Mounts attached EBS volume to directory
cd /ebstest
sudo nano amazingtestfile.txt
# add a message
# save and exit
ls -la

## Reboot Instance 1

sudo reboot

## Instance 1 After Reboot

df -k # Volume won't show - must configure st volume is auto mounted on reboot
sudo blkid # List unique IDs for all mounted volumes
sudo nano /etc/fstab
ADD LINE
UUID=YOURUUIDHEREREPLACEME  /ebstest  xfs  defaults,nofail
sudo mount -a # Will mount all files in the /etc/fstab file
cd /ebstest
ls -la # Amazingtestfile.txt still exists - volume is persistent even after reboot

## Instance 2
# We mount the same volume we detached from instance 1, and see that content is still the same
lsblk
sudo file -s /dev/xvdf
sudo mkdir /ebstest
sudo mount /dev/xvdf /ebstest
cd /ebstest
ls -la

## Instance 3
# Instance in another AZ - we created a snapshot and created a volume from the snapshot in another AZ
lsblk
sudo file -s /dev/xvdf
sudo mkdir /ebstest
sudo mount /dev/xvdf /ebstest
cd /ebstest
ls -la

## InstanceStoreTest

lsblk
sudo file -s /dev/nvme1n1
sudo mkfs -t xfs /dev/nvme1n1
sudo file -s /dev/nvme1n1
sudo mkdir /instancestore
sudo mount /dev/nvme1n1 /instancestore
cd /instancestore
sudo touch instancestore.txt

## InstancStoreTest - After Restart

df -k
its not there
but we can mount it
sudo mount /dev/nvme1n1 /instancestore
cd /instancestore
ls -la

## InstanceStoreTest - After Stop/Start

sudo file -s /dev/nvme1n1
```

## EBS Encryption

> *By default no encryption is applied. This adds risk - encryption helps mitigate this risk.*
>

💡 Data only exist in encrypted form on the volume.
Plaintext data only ever exist in the memory of the EC2 host
KMS Keys - aws/ebs or customer managed


### Key Concepts

- Accounts can be set to **encrypt by default** - default KMS Key
- Otherwise **choose a KMS Key** to use
- Each volume uses **1 unique DEK (Data Encryption Key)**
- **Snapshots & future volumes** use the **same DEK**
- **Can’t change a volume to NOT be encrypted!!**
- OS isn’t aware of the encryption
- **No performance loss!**
- If you need the OS to encrypt things, you must configure volume encryption (software disk encryption) by yourself

## (Elastic) Network Interfaces, Instance IPs and DNS

### EC2 Network & DNS Architecture

> **ENI - Elastic Network Interface**
>
- Every EC2 instance has *at least one* **ENI**
- Must be in same AZ
- When you launch an instance with SGs, that SG is on the ENI, not the instance itself
- (Primary) **(Elastic) Network interfaces have…**
- **MAC Addresses!**
- IPv4 Private IP → 10.16.0.10 → (dns) ip-10-16-0-10.ec2.internal
- DNS can be used for internal use
- 0 or more secondary IPs
- 0 or 1 Public IPv4 Address → random IP → random dns based on IP
- 1 elastic IP per private IPv4 address
- If you assign it
- Removes the Public IPv4
- Replaces with the Elastic IP
- You can’t regain the old public IPv4 if you remove Elastic IP
- 0 or more IPv6 addresses
- Security Groups
- Source/Destination Check
- Enable/disable
- Disable to use EC2 instance as NAT
- Secondary ENI
- As above, but can be detached and moved to other EC2 instances

### Key Concepts

- Secondary ENI + MAC  = **Licensing**
- Move licensing between instances by moving ENI
- Multi-homed (subnets) Management and Data
- Different Security Groups - **multiple interfaces with different SG on each**
- OS - **DOESN’T SEE PUBLIC IPv4.**
- Stop & Start = **Change**
- Public DNS = **private IP in VPC**
- Public IP everywhere else

## DEMO: Installation of Wordpress on EC2

```bash
# DBName=database name for wordpress
# DBUser=mariadb user for wordpress
# DBPassword=password for the mariadb user for wordpress
# DBRootPassword = root password for mariadb

# STEP 1 - Configure Authentication Variables which are used below
DBName='a4lwordpress'
DBUser='a4lwordpress'
DBPassword='REPLACEME'
DBRootPassword='REPLACEME'

# STEP 2 - Install system software - including Web and DB
sudo yum install -y mariadb-server httpd wget
sudo amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2

# STEP 3 - Web and DB Servers Online - and set to startup

sudo systemctl enable httpd
sudo systemctl enable mariadb
sudo systemctl start httpd
sudo systemctl start mariadb

# STEP 4 - Set Mariadb Root Password
mysqladmin -u root password $DBRootPassword

# STEP 5 - Install Wordpress
sudo wget http://wordpress.org/latest.tar.gz -P /var/www/html
cd /var/www/html
sudo tar -zxvf latest.tar.gz
sudo cp -rvf wordpress/* .
sudo rm -R wordpress
sudo rm latest.tar.gz

# STEP 6 - Configure Wordpress

sudo cp ./wp-config-sample.php ./wp-config.php
sudo sed -i "s/'database_name_here'/'$DBName'/g" wp-config.php
sudo sed -i "s/'username_here'/'$DBUser'/g" wp-config.php
sudo sed -i "s/'password_here'/'$DBPassword'/g" wp-config.php
sudo chown apache:apache * -R

# STEP 7 Create Wordpress DB

echo "CREATE DATABASE $DBName;" >> /tmp/db.setup
echo "CREATE USER '$DBUser'@'localhost' IDENTIFIED BY '$DBPassword';" >> /tmp/db.setup
echo "GRANT ALL ON $DBName.* TO '$DBUser'@'localhost';" >> /tmp/db.setup
echo "FLUSH PRIVILEGES;" >> /tmp/db.setup
mysql -u root --password=$DBRootPassword < /tmp/db.setup
sudo rm /tmp/db.setup

# STEP 8 - Browse to http://your_instance_public_ipv4_ip
```

## Amazon Machine Images (AMI)

> *Amazon Machine Images (AMI) 's are the images which can create EC2 instances of a certain configuration.*
>
>
> *In addition to using AMI's to launch instances, you can customize an EC2 instance to your bespoke business requirements and then generate a template AMI which can be used to create any number of customized EC2 instances.*
>
- AMI’s can be used to **launch EC2** instance
- **AWS** or **Community** provided
- Marketplace (can include **commercial software**)
- **Regional. Unique ID**. e.g. ami-0a893824e0928592f20
- Permissions (Public, Your Account, Specific Accounts)
- You can create an AMI from an EC2 instance you want to template
- AMI’s are containers that reference snapshots

### AMI Lifecycle

![Untitled](img/Untitled%2060.png)

### Key Concepts

- AMI = **One region**. Only works in that one region.
- **AMI Baking** - Creating an AMI from a configured instance + application
- An AMI **can’t be edited**. Launch instance, update configuration and *make a new AMI*
- Can be copied **between regions** (includes its snapshots)
- Remember permissions. **Default = your account**

## DEMO: A4L AMI

```bash
# DBName=database name for wordpress
# DBUser=mariadb user for wordpress
# DBPassword=password for the mariadb user for wordpress
# DBRootPassword = root password for mariadb

# STEP 1 - Configure Authentication Variables which are used below
DBName='a4lwordpress'
DBUser='a4lwordpress'
DBPassword='4n1m4l$L1f3'
DBRootPassword='4n1m4l$L1f3'

# STEP 2 - Install system software - including Web and DB
sudo yum install -y mariadb-server httpd wget
sudo amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2

# STEP 3 - Web and DB Servers Online - and set to startup

sudo systemctl enable httpd
sudo systemctl enable mariadb
sudo systemctl start httpd
sudo systemctl start mariadb

# STEP 4 - Set Mariadb Root Password
mysqladmin -u root password $DBRootPassword

# STEP 5 - Install Wordpress
sudo wget http://wordpress.org/latest.tar.gz -P /var/www/html
cd /var/www/html
sudo tar -zxvf latest.tar.gz
sudo cp -rvf wordpress/* .
sudo rm -R wordpress
sudo rm latest.tar.gz

# STEP 6 - Configure Wordpress

sudo cp ./wp-config-sample.php ./wp-config.php
sudo sed -i "s/'database_name_here'/'$DBName'/g" wp-config.php
sudo sed -i "s/'username_here'/'$DBUser'/g" wp-config.php
sudo sed -i "s/'password_here'/'$DBPassword'/g" wp-config.php
sudo chown apache:apache * -R

# STEP 7 Create Wordpress DB

echo "CREATE DATABASE $DBName;" >> /tmp/db.setup
echo "CREATE USER '$DBUser'@'localhost' IDENTIFIED BY '$DBPassword';" >> /tmp/db.setup
echo "GRANT ALL ON $DBName.* TO '$DBUser'@'localhost';" >> /tmp/db.setup
echo "FLUSH PRIVILEGES;" >> /tmp/db.setup
mysql -u root --password=$DBRootPassword < /tmp/db.setup
sudo rm /tmp/db.setup

# STEP 8 - Browse to http://your_instance_public_ipv4_ip

# Step 9

sudo yum install -y cowsay

cowsay "oh hi"

Create file /etc/update-motd.d/40-cow

sudo nano /etc/update-motd.d/40-cow

#!/bin/sh
cowsay "Amazon Linux 2 AMI - Animals4Life"

sudo chmod 755 /etc/update-motd.d/40-cow
sudo rm /etc/update-motd.d/30-banner

sudo update-motd
sudo reboot

Relogin

## STEP 10 - CREATE AMI
## STEP 11 - USE AMI to launch an instance
```

## EC2 Purchase Options (Launch Types)

### On-Demand

- Default
- No specific pros or cons
- Instances of **different sizes** run on the same EC2 hosts - consuming a **defined allocation** of resources
- **On-Demand** instances are isolated but **multiple customer instances** run on shared hardware
- **Per-second billing** while an instance is running. Associated resources such as storage **consume capacity**, so **bill**, **regardless of instance state**
- **Default** purchase option.
- No **interruption**
- Predictable pricing
- No upfront cost
- No discount
- Short term workloads
- Unknown workloads
- Apps which can’t be interrupted

### Spot

- SPOT pricing is AWS **selling unused EC2 host capacity** for up to **90%** discount - the spot price is based on the spare capacity at a given time
- If spot price goes above your limit the instances are terminated
- Makes Spot unreliable
- **Never** use spot for workloads which **can’t tolerate interruptions**
- **Non time critical**
- Anything which can be **rerun**
- **Bursty** capacity needs
- **Cost sensitive** workloads
- Anything which is **stateless**

### Reserved

> Long term consistent usage of EC2
>
- Matching instances - reduced or no per sec price
- **Unused reservation still billed**
- **Partial coverage** of **larger** instance
- You commit to AWS that you will use the instance for a longer period of time - regardless of whether you use them or not
- Reservations are for **one or three years**
- **No-Upfront:**
- Some savings for agreeing to the term
- Per second
- **All upfront:**
- Means no per second fee
- **Partial upfront:**
- Reduced per second fee

### Dedicated Instance

- No other customers use the same hardware
- You have the hardware to yourself
- You neither own or share the host
- Extra charges for instances, but dedicated hardware
- You don’t manage capacity

### Dedicated Host

> The host is allocated to you in its entirety
>
- Pay for HOST
- No instance charges
- You must managed the capacity and the resources
- **Use because of licensing based on sockets/cores requirements**
- Host affinity links instances to hosts

## Reserved Instances

> *Aka Standard Reserved*
>

### Scheduled Reserved Instances

- Ideal for **long term usage** which doesn’t run constantly
- Options:
- Batch processing daily for 5 hours starting at 23:00
- Weekly data, sales analysis. **Every friday for 24 hours**
- 100 hours of EC2 per month
- Doesn’t support all instance types or regions. 1200 hours per year and 1 year term minimum

### Capacity Reservations

> In case of disaster and lack of capacity, AWS uses a priority list of whom to give capacity to
>
- Regional Reservation provides a billing discount for valid instances launched in **any AZ in that region**
- While flexible they **don’t reserve capacity within in AZ** - which is risky during major faults when capacity can be limited
- **Zonal reservations** only apply to **one AZ** providing **billing discounts and capacity reservation** in **that AZ**
- **On-demand capacity reservations** can be booked to ensure you always have access to **capacity in an AZ** when you need it - but **at full on-demand price.** No term limits - but you pay **regardless of if you consume it.**

### EC2 Savings Plan

- A **hourly commitment** for a **1-3 year** term
- A reservation of **general compute $ amounts**($20 per hour for 3 years)
- Or a specific **EC2 Savings plan** - flexibility on size & OS
- Compute products, currently **EC2, Farge & Lambda**
- Products have an **on-demand rate** and a **savings plan** rate
- Resource usage consumes savings plan commitment at the reduced savings plan rate
- Beyond your commitment **on-demand is used**

## Instance Status Checks & Auto Recovery

> *With instance status monitoring, you can quickly determine whether Amazon EC2 has detected any problems that might prevent your instances from running applications. Amazon EC2 performs automated checks on every running EC2 instance to identify hardware and software issues. You can view the results of these status checks to identify specific and detectable problems.*
>
>
> *You can create an Amazon CloudWatch alarm that monitors an Amazon EC2 instance and automatically recovers the instance if it becomes impaired due to an underlying hardware failure or a problem that requires AWS involvement to repair. Terminated instances cannot be recovered. A recovered instance is identical to the original instance, including the instance ID, private IP addresses, Elastic IP addresses, and all instance metadata*
>

### Instance Status Checks

- Every EC2 instance have 2 status check
- **First**
- System status
- Loss of system power
- Loss of network connectivity
- Host software issues
- Host hardware issues
- **Second**
- Instance status
- Corrupted file system
- Incorrect instance networking
- OS Kernel issues

### Termination Protection

💡 Termination Protection is a feature which adds an attribute to EC2 instances meaning they cannot be terminated while the flag is enabled.

It provides protection against unintended termination and also allows role separation, where junior admins can be allowed to terminate but ONLY for instances with no protection attribute set.


## Horizontal and Vertical Scaling

> *Within AWS Horizontal and Vertical scaling are two ways which systems have to deal with increasing or decreasing user-side load.

Adding or removing resources to a system*
>

### Vertical Scaling

- Resizing EC2 instance
- t3.large → t3.xlarge
- Each resize requires a reboot - **disruption**
- Larger instances often carry a **$ premium**
- There is an upper cap on performance - **instance size**
- **No application modification** required
- Works for ALL applications - **even monoliths**

### Horizontal Scaling

- Adds more instances as load increases
- Load Balancer
- Between servers and customers
- Distribute load over all servers
- Sessions, sessions, sessions
- Requires application support OR **off-host sessions (stateless sessions)**
- **No disruption** when scaling
- Connections can be moved between servers (if stateless sessions without disruption)
- Often less expensive - **no large instance premium**
- More granular

## Instance Metadata

> *Instance metadata* is data about your instance that you can use to configure or manage the running instance. Instance metadata is divided into categories, for example, host name, events, and security groups.
>
>
> Instance metadata is accessed from an EC2 instance using
>
> ```
> http://169.254.169.254/latest/meta-data/
> ```
>
- EC2 Service provides data to instances
- Accessible inside ALL instances
- http://169.254.169.254
- http://169.254.169.254/latest/meta-data/
- **REMEMBER THIS**
- All information about environment can be queried
- Networking
- Authentication
- User-Data
- **NOT AUTHENTICATED** or **ENCRYPTED**
- Treat metadata as something that can and will be exposed


