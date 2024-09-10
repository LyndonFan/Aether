#  Route 53 - Global DNS

## R53 Public Hosted Zones

> *A public hosted zone is a container that holds information about how you want to route traffic on the internet for a specific domain which is accessible from the public internet*
>

💡 Two types of zones in R53: **Public** and **Private**


### R53 Hosted Zones

- A **R53 Hosted Zone** is a DNS DB for a domain, e.g. a4l.org
- **Globally resilient** (multiple DNS Servers)
- Created with domain registration via R53 - can be created separately
- Host DNS Records (A, AAAA, MX, NS, TXT,…)
- Hosted Zones are what the DNS system references - **Authoritative** for a domain e.g. a4l.org
- DNS Database

### R53 Public Hosted Zones

- DNS Database (Zone file) hosted by R53 (Public Name Servers)
- Accessible from the public internet & VPCs
- Hosted on “**4**” R53 Name Servers (**NS**) specific for the zone
- use “**NS records**” to point at these NS (connect to global DNS)
- Resource Records (**RR**) created within the Hosted Zone
- Externally registered domains can point at R53 Public Zone

![Untitled](img/Untitled%2078.png)

## R53 Private Hosted Zones

> A *private hosted zone* is a container that holds information about how you want Amazon Route 53 to respond to DNS queries for a domain and its subdomains within one or more VPCs that you create with the Amazon VPC service
>
- A public hosted zone, which isn’t public
- Associated with **VPCs**
- Only accessible in those **VPCs**
- Using **different accounts** is supported via **CLI/API**
- Split-view (overlapping public & private) for **PUBLIC** and **INTERNAL** use with the same zone name

![Untitled](img/Untitled%2079.png)

### R53 Split View Hosted Zones

- Public zone is a subset of the private zone, limiting access to some resources

![Untitled](img/Untitled%2080.png)

## CNAME vs R53 Alias

> *This lesson steps through the shortcomings of the CNAME record type, the differences between CNAME and ALIAS and when to use one v's the other.*
>

### R53 CNAME vs Alias (the problem)

- “A” Maps a NAME to an IP Address
- [catagram.io](http://catagram.io) → 1.3.3.7
- CNAME maps a NAME to another NAME
- [www.catagram.io](http://www.catagram.io) → catagram.io
- CNAME is invalid for naked/apex (catagram.io)
- Many AWS services us a DNS Name (ELBs)
- With just CNAME - [catagram.io](http://catagram.io) → ELB would be invalid

### Alias

- **ALIAS** records map a **NAME** to an **AWS resource**
- Can be used both for **naked/apex** and **normal** records
- For non apex/naked - functions like CNAME
- There is no charge for ALIAS requests pointing at AWS resources
- For AWS services - default to picking ALIAS
- Should be the same “type” as what the records is pointing at
- **Use ALIAS when pointing at:**
- API Gateway
- CloudFront
- Elastic Beanstalk
- ELB
- Global Accelerator
- S3

## R53 Health Checks

> *Amazon Route 53 health checks monitor the health and performance of your web applications, web servers, and other resources. Each health check that you create can monitor one of the following:*
>
> - *The health of a specified resource, such as a web server*
> - *The status of other health checks*
> - *The status of an Amazon CloudWatch alarm*
- Health check are **separate from**, but are **used by** records
- Health checkers located **globally**
- Health checker check every 30s (every 10s costs extra)
- TCP, HTTP/HTTPS, HTTP/HTTPS with String Matching
- Healthy or **Unhealthy**
- Endpoint, CloudWatch Alarm, Check of Checks (Calculated)

****

![Untitled](img/Untitled%2081.png)

## ❗Failover: Active/Passive ❗

**Active-Active Failover**

Use this failover configuration when you want all of your resources to be available the majority of the time. When a resource becomes unavailable, Route 53 can detect that it’s unhealthy and stop including it when responding to queries.

In active-active failover, all the records that have the same name, the same type (such as A or AAAA), and the same routing policy (such as weighted or latency) are active unless Route 53 considers them unhealthy. Route 53 can respond to a DNS query using any healthy record.

**Active-Passive Failover**

Use an active-passive failover configuration when you want a primary resource or group of resources to be available the majority of the time and you want a secondary resource or group of resources to be on standby in case all the primary resources become unavailable. When responding to queries, Route 53 includes only the healthy primary resources. If all the primary resources are unhealthy, Route 53 begins to include only the healthy secondary resources in response to DNS queries.

**Configuring an Active-Passive Failover with Weighted Records** and **configuring an Active-Passive Failover with Multiple Primary and Secondary Resources** are incorrect because an Active-Passive Failover is mainly used when you want a primary resource or group of resources to be available most of the time and you want a secondary resource or group of resources to be on standby in case all the primary resources become unavailable. In this scenario, all of your resources should be available all the time as much as possible which is why you have to use an Active-Active Failover instead.

**Configuring an Active-Active Failover with One Primary and One Secondary Resource** is incorrect because you cannot set up an Active-Active Failover with One Primary and One Secondary Resource. Remember that an Active-Active Failover uses all available resources all the time without a primary nor a secondary resource.

## Routing Policy 1: Simple Routing

> *Simple routing lets you configure standard DNS records, with no special Route 53 routing such as weighted or latency. With simple routing, you typically route traffic to a single resource, for example, to a web server for your website.*
>

![Untitled](img/Untitled%2082.png)

## Routing Policy 2: Failover Routing

> *Failover routing lets you route traffic to a resource when the resource is healthy or to a different resource when the first resource is unhealthy
1st of four routing policies*
>

💡 Create two records of the same name and the same type. One is set to be the primary and the other is the secondary. This is the same as the simple policy except for the response. Route 53 knows the health of both instances. As long as the primary is healthy, it will respond with this one. If the health check with the primary fails, the backup will be returned instead. This is set to implement active - passive failover.


![Untitled](img/Untitled%2083.png)

## Routing Policy 3: ****Multi Value Routing****

> *Multivalue answer routing lets you configure Amazon Route 53 to return multiple values, such as IP addresses for your web servers, in response to DNS queries. You can specify multiple values for almost any record, but multivalue answer routing also lets you check the health of each resource, so Route 53 returns only values for healthy resources*
>

💡 Simple records use one name and multiple values in this record. These will be health checked and the unhealthy responses will automatically be removed. With multi-value, you can have multiple records with the same name and each of these records can have a health check. R53 using this method will respond to queries with any and all healthy records, but it removes any records that are marked as unhealthy from those responses. This removes the problem with simple routing where a single unhealthy record can make it through to your customers. Great alternative to simple routing when you need to improve the reliability, and it's an alternative to failover when you have more than two records to respond with, but don't want the complexity or the overhead of weighted routing.


![Untitled](img/Untitled%2084.png)

## Routing Policy 4: Weighted Routing

> *Weighted routing lets you associate multiple resources with a single domain name ([catagram.io](http://catagram.io/)) and choose how much traffic is routed to each resource. This can be useful for a variety of purposes, including load balancing and testing new versions of software.*
>

💡 Create multiple records of the same name within the hosted zone. For each of those records, you provide a weighted value. The total weight is the same as the weight of all the records of the same name. If all of the parts of the same name are healthy, it will distribute the load based on the weight. If one of them fails its health check, it will be skipped over and over again until a good one gets hit. This can be used for migration to separate servers.


![Untitled](img/Untitled%2085.png)

## Routing Policy 5: Latency Routing

> *If your application is hosted in multiple AWS Regions, you can improve performance for your users by serving their requests from the AWS Region that provides the lowest latency.*
>

💡 Multiple records in a hosted zone can be created with the same name and same type. When a client request arrives, it knows which region the request comes from. It knows the lowest latency and will respond with the lowest latency.


![Untitled](img/Untitled%2086.png)

## Routing Policy 6: Geolocation Routing

> *Geolocation routing lets you choose the resources that serve your traffic based on the geographic location of your users, meaning the location that DNS queries originate from.*
>

💡 Focused to delivering results matching the query of your customers. The record will first be matched based on the country if possible. If this does not happen, the record will be checked based on the continent. Finally, if nothing matches again it will respond with the default response. This can be used for licensing rights. If overlapping regions occur, the priority will always go to the most specific or smallest region. The US will be chosen over the North America record.


- Good for restricting content to a certain location

![Untitled](img/Untitled%2087.png)

## Routing Policy 7: Geoproximity Routing

> *Geoproximity routing lets Amazon Route 53 route traffic to your resources based on the geographic location of your users and your resources. You can also optionally choose to route more traffic or less to a given resource by specifying a value, known as a bias. A bias expands or shrinks the size of the geographic region from which traffic is routed to a resource.*
>
- As close to customers as possible
- Calculate **distance** between customer and records
- Define rules and a bias
- Bias: + or - bias can be added to rules

![Untitled](img/Untitled%2088.png)

## R53 Interoperability

> *This lesson details how Route53 provides Registrar and DNS Hosting features and steps through architectures where it is used for BOTH, or only one of those functions - and how it integrates with other registrars or DNS hosting.*
>
- R53 normally has two jobs - **Domain registrar** and **Domain Hosting**
- R53 can do **BOTH**, or either registrar or hosting
- R53 Accepts your money (domain registration fee)
- R53 allocates 4 Names Servers (NS) (Domain hosting)
- R53 Creates a zone file (domain hosting) on the above NS
- R53 communicates with the registry of the TLD (Domain Registrar)
- sets the NS records for the domain to point at the 4 NS above

### R53: Both Roles

![Untitled](img/Untitled%2089.png)

### R53: Registrar Only

> “Worst way to manage domains”
>

![Untitled](img/Untitled%2090.png)

### R53: Hosting Only

![Untitled](img/Untitled%2091.png)


