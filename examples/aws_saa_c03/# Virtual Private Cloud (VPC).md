# Virtual Private Cloud (VPC)

## VPC Sizing and Structure

### VPC Considerations

- VPC CIDR range
- What size should the VPC be
- Are there any networks we can’t use?
- VPC’s, Cloud, On-premises, Partners & Vendors
- Try to predict the future
- VPC Structure - Tiers & Resiliency (Availability) Zones
- Global architecture
- E.g. ranges to avoid in a real-case scenario
- **VPC minimum /28 (16 IPs), maximum /16 (65536 IPs)**
- Personal preference for the 10.x.y.z range
- **Avoid common ranges** - avoid future issues
- Reserve 2+ networks per region being used per account

| VPC Size | Netmask | Subnet Size | Hosts/Subet* | Subnets/VPC | Total IPs* |
|  |  |  |  |  |  |
| Micro | /24 | /27 | 27 | 8 | 216 |
| Small | /21 | /24 | 251 | 8 | 2008 |
| Medium | /19 | /22 | 1019 | 8 | 8152 |
| Large | /18 | /21 | 2043 | 8 | 16344 |
| Extra Large | /16 | /20 | 4091 | 16 | 65456 |

### VPC Structure

- Number of AZs for VPC
- Start with 3 as default
- 1 as spare for future
- Four tiers default
- Web, app, db, spare

![Untitled](img/Untitled%2033.png)


## **Custom VPCs**

![VPC Design - End state](img/Untitled%2034.png)

VPC Design - End state

### Custom VPC Fundamentals

- Regional service - All AZ’s in the region
- Isolated network
- Nothing IN or OUT without explicit configuration
- Flexible configuration - simple or multi-tier
- Hybrid networking - other cloud & on-premises
- Default or dedicated tenancy
- IPv4 Private CIDR Blocks & Public IPs
- 1 Primary Private IPv4 CIDR Block
- min /28 max /16 (16 - 65536 IPs)
- Optional secondary IPv4 Blocks
- Optional single assigned IPv6 /56 CIDR Block

### DNS in a VPC

- Provided by R53
- VPC ‘Base IP +2’ Address
- **enableDnsHostnames**
- gives instances DNS Names
- **enableDnsSupport**
- enables DNS resolution in VPC

## VPC Subnets

- AZ resilient
- A subnetwork of a VPC - within a particular AZ
- 1 subnet → 1 AZ, 1 AZ → 0+ Subnets
- IPv4 CIDR is a subset of the VPC CIDR
- Cannot overlap with other subnets
- Optional IPv6 CIDR (/64 subset of the /56 VPC - space for 256)
- Subnets can communicate with other subnets in the VPC

### Subnet IP Addressing

- Reserved IP addresses (5 in total)
- 10.16.16.0/20 (10.16.16.0 → 10.16.16.255)
- Reserved addresses
- **Network Address** (10.16.16.0)
- First in network is always reserved. Goes for all networks.
- Network+1 (10.16.16.1)
- VPC Router
- Network+2 (10.16.16.2)
- Reserved (DNS*)
- Network+3 (10.16.16.3)
- Reserved Future Use
- **Broadcast** Address 10.16.31.255
- Last IP in subnet
- **DHCP** Option Set (**Dynamic Host Configuration Protocol**)
- How devices receive IP addresses automatically
- Per subnet:
- Auto assign public IPv4
- Auto assign public IPv6

## VPC Routing and Internet Gateway

### VPC Router

- Every VPC has a VPC Router - Highly available
- In every subnet ’network+1’ address
- Routes traffic between subnets
- Controlled by ‘route tables’ each subnet has one
- A VPC has a **Main** route table - subnet default
- Route tables are attached to 0 or more subnets
- `/n` higher n = more specific = higher priority
- A subnet has to have a route table. Either main by VPC or a custom.
- Route table controls what happens to data as it leaves the subnet that route table is associate with
- **A subnet can only be associated with 1 route table at the time**

### Internet Gateway (IGW)

- Region resilient gateway attached to a VPC
- 1 VPC = 0 or 1 IGW, 1 IGW = 0 or 1 VPC
- Runs from within the AWS Public Zone
- Gateways traffic between the VPC and the Internet or AWS Public Zone (S3, SQS, SNS, etc)
- Managed - AWS handles performance
- Self note:
- Maps private IP to Public IP and vice versa

### Using an IGW

![Untitled](img/Untitled%2035.png)

### IPv4 Addresses with a IGW

![Untitled](img/Untitled%2036.png)

- **OS on EC2 is at no point aware of its public IPv4!**

### Bastion Host / Jumpbox

- Bastion Host = Jumpbox
- An instance in a public subnet
- Incoming management connections arrive there
- Then access internal VPC resources
- Often the only way IN to a VPC

## Stateful vs Stateless Firewalls

### Transmission Control Protocol (TCP)

> *TCP is a connection based protocol. A connection is established between two devices using a **random port** on a client and a **known port** on the server. Once established the connection is **bi-directional**. The “connection” is a reliable connection, provided via the segment encapsulated in IP packets.*
>

💡 **HTTP: Port 80
HTTPS: Port 443**


![Untitled](img/Untitled%2037.png)

### Stateful vs Stateless Firewalls

![Untitled](img/Untitled%2038.png)

### Stateless Firewalls

> 2 Rules (1 IN, 1 OUT) per connection (inbound application)
2 Rules (1 OUT, 1 IN) per connection (outbound application)
>

![Untitled](img/Untitled%2039.png)

### Stateful Firewalls

> *Intelligent enough to identify the request and response components of a connection as being related*
>

![Untitled](img/Untitled%2040.png)

## Network Access Control Lists (NACL)

> Can be considered a traditional firewall within AWS VPC
Every subnet has an associated NACL
>

![Untitled](img/Untitled%2041.png)

- **Inbound rules** and **Outbound rules.**
- **Inbound:** Traffic entering the subnet
- **Outbound:** Traffic leaving the subnet
- Rules match the DST IP/Range, DST Port and Protocol and Allow or Deny based on that match
- Rules are processed in order, lowest rule number first. Once a match occurs, processing STOPS.
- * is an implicit DENY if nothing else matches

![Untitled](img/Untitled%2042.png)

- NACLs are **STATELESS.** Both request and response need individual rules.
- These rule-pairs (**app port** and **ephemeral ports)** are needed  on each NACL for each communication type which occurs
1. Within a VPC
2. TO a VPC
3. FROM a VPC
- A VPC is created with a default NACL
- Inbound and outbound rules have the implicit deny (*) and an ALLOW ALL rule
- The result - all traffic is allowed, the NACL has no effect

### Custom NACL

> *Custom NACLs can be created for a specific VPC and are initially associated with no subnets*
>
- They only have 1 INBOUND rule - implicit (*) DENY
- All traffic is denied
- They only have 1 OUTBOUND rule - the implicit (*) DENY

### NACL Key Points

- **Stateless:** Request and Response seen as different
- Only impacts data crossing subnet boundary
- NACL can explicitly ALLOW and DENY
- IPs/CIDR, Ports & Protocols - no logical resources
- NACLs cannot be assigned to AWS resources - only subnets
- Use together with Security Groups to add explicit DENY (Bad IPs/Nets)
- Each subnet can have **ONE NACL** (default or custom)
- A NACL can be associated with **MANY Subnet**

## VPC Security Groups (SG)

> *Security Groups (SGs) are another security feature of AWS VPC ... only unlike NACLs they are attached to AWS resources, not VPC subnets.*
>
>
> *SGs offer a few advantages vs NACLs in that they can recognize AWS resources and filter based on them, they can reference other SGs and also themselves.*
>
> *But.. SGs are not capable of explicitly blocking traffic - so often require assistance from NACLs*
>

💡 **STATEFUL
NO EXPLICIT DENY -** Need assistance from NACL


- **STATEFUL** - detect response traffic automatically
- Allowed (IN or OUT) request = allowed response
- **NO EXPLICIT DENY** - only allow or Implicit DENY
- can’t block specific bad actors
- Support IP/CIDR and **logical resources**
- including other security groups and itself
- Attached to ENI’s (Elastic Network Interfaces) not instances (even if the UI shows it this way)

### Logical References

> *Logical referencing scales.
Any new instances which use the webSG are allowed to communicate with any instances using the APP SG.
Reduce admin overhead*
>

![Untitled](img/Untitled%2043.png)

### SG Self References

> Anything with the same security group can communicate
>

![Untitled](img/Untitled%2044.png)

## Network Address Translation (NAT) and NAT Gateways

> Giving a private resource outgoing access to the internet
>

### What is NAT?

- A set of processes - remapping source og dest IPs
- **IP masquerading:** Hiding CIDR Blocks behind one IP
- Gives Private VID range **outgoing** internet* access

### NAT Architecture

![Untitled](img/Untitled%2045.png)

### NAT Gateways

- Runs from a **public subnet**
- Uses **ELASTIC IPs (Static IPv4 Public)**
- **Don’t support security groups! Only NACLs**
- **AZ resilient Service** (HA in that AZ)
- Need a NATGW in every AZ
- For region resilience - **NATGW in each AZ**
- RT in for each AZ with that NATGW as target
- Managed, scales to 45 Gpbs
- $ Duration & Data Volume

### VPC Design - NATGW Full Resilience

![Untitled](img/Untitled%2046.png)

### Nat Instance vs NAT Gateway

![Untitled](img/Untitled%2047.png)

### What about IPv6?

- NAT isn’t required for IPv6
- All IPv6 addresses in AWS are publicly routable
- The internet gateway works with all IPv6 IPs directly
- NAT Gateways **don’t work with IPv6**
- ::/0 Route + IGW for bi-directional connectivity
- ::/0 Route + Egress-Only Internet Gateway - Outbound Only


