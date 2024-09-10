#  ADVANCED VPC Networking

## VPC Flow Logs

> *VPC Flow logs is a feature allowing the monitoring of traffic flow to and from interfaces within a VPC*
>
>
> *VPC Flow logs can be added at a VPC, Subnet or Interface level.*
>
> *Flow Logs DON'T monitor packet contents ... that requires a packet sniffer.*
>
> *Flow Logs can be stored on S3 or CloudWatch Logs*
>
- Capture **metadata** (not content)
- Source/dest IP, ports, protocol, action (e.g. ACCEPT), etc…
- Attached to a VPC/Subnet/ENI - All ENIs in that VPC
- Subnet - All ENIs in that subnet
- ENIs directly
- Flow Logs are NOT realtime
- Log Destinations - S3 or CloudWatch Logs
- Or Athena for querying

### Architecture

![Untitled](img/Untitled%20162.png)

![Untitled](img/Untitled%20163.png)

## Egress-Only Internet Gateway

> *Egress-Only internet gateways allow outbound (and response) only access to the public AWS services and Public Internet for IPv6 enabled instances or other VPC based services.*
>
- With IPv4 addresses are private or public
- **NAT** allows **private IPs** to access public networks
- without allowing externally initiated connections (IN)
- With IPv6 all IPs are public
- Internet Gateway (IPv6) allows all IPs IN and OUT
- Egress-Only is **outbound-only** for **IPv6**

### Architecture

![Untitled](img/Untitled%20164.png)

## VPC Endpoints (Gateway)

> *Gateway endpoints are a type of VPC endpoint which allow access to S3 and DynamoDB without using public addressing.*
>
>
> *Gateway endpoints add 'prefix lists' to route table, allowing the VPC router to direct traffic flow to the public services via the gateway endpoint.*
>
- Provide **private access** to **S3** and **DynamoDB**
- **Prefix List** added to **route table** → Gateway Endpoint
- Highly Available across all AZs in a region by default
- Endpoint policy is used to control what it can access
- Regional - **can’t access cross-region services**
- **Prevent Leaky Buckets** - S3 Buckets can be set to private only by allowing access ONLY from a gateway endpoint

![Untitled](img/Untitled%20165.png)

### Architecture

![Untitled](img/Untitled%20166.png)

## ****VPC Endpoints (Interface)****

> *Interface endpoints are used to allow private IP addressing to access public AWS services.*
>
>
> *S3 and DynamoDB are handled by gateway endpoints - other supported services are handled by interface endpoints.*
>
> *Unlike gateway endpoints - interface endpoints are not highly available by default - they are normal VPC network interfaces and should be placed 1 per AZ to ensure full HA.*
>
- Provide **private access** to AWS Public Services
- Historically anything NOT S3 and DDB - but S3 is now supported
- Added to **specific subnets** - an ENI - not HA
- For HA - add one endpoint, to one subnet, per AZ used in the VPC
- Network access controlled via **Security Groups**
- **Endpoint Policies** - restrict what can be done with the endpoint
- **TCP** and **IPv4** Only
- Uses **PrivateLink**
- **Interface endpoints use DNS**
- Endpoint provides a NEW service endpoint DNS
- e.g. vpce-123-xyz.sns.us-east-1.vpce.amazonaws.com
- Endpoint **regional DNS**
- Endpoint **Zonal DNS**
- Applications can optionally use these or
- **PrivateDNS overrides** the **default DNS for services**

### Architecture

![Untitled](img/Untitled%20167.png)

## VPC Peering

> *VPC peering is a software define and logical networking connection between two VPC's*
>
>
> *They can be created between VPCs in the same or different accounts and the same or different regions.*
>
> *In this lesson I step through the architectural key points which you'll need to understand for the exam and real world usage.*
>
- Direct encrypted network link between **two VPCs (ONLY TWO!)**
- Works **same/cross-region** and **same/cross-account**
- **Optional: Public hostnames resolve to private IPs**
- Same region SG’s can reference peer SG’s
- VPC Peering does NOT support transitive peering
- If A→B and B→C, NOT A→C
- Routing configuration is needed, SG’s & NACLs can filter

### Architecture

![Untitled](img/Untitled%20168.png)


