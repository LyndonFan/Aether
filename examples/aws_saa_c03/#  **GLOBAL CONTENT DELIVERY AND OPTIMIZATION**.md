# GLOBAL CONTENT DELIVERY AND OPTIMIZATION

## CloudFront Architecture

> *CloudFront is a Content Delivery network (CDN) within AWS.*
>
>
> *This lesson steps through the basic architecture*
>

### CloudFront Terms

- **Origin:** The source location of your content
- Used by behaviours as content sources
- **S3 Origin** or **Custom Origin**
- **Distribution:** The ‘**configuration**’ unit of CloudFront
- **Edge Location:** Local cache of your data
- **Regional Edge Cache**: Larger version of an edge location. Provides another layer of caching.
- **Behaviour:** Sits between origin and distribution
- private (img/*)
- default (*)
- Part of distribution?

### CloudFront Architecture

![Untitled](img/Untitled%20154.png)

![Untitled](img/Untitled%20155.png)

## CloudFront Behaviors

> *CloudFront Behaviours control much of the TTL, protocol and privacy settings within CloudFront*
>
- A distribution can have multiple behaviors, but have one default
- Default used when nothing else matches

## CF TTL and Invalidations

- More frequent cache hits = lower origin load
- Default TLT (behavior) = **24 hours (validity period)**
- You can set Min TTL and Max TTL
- Per object TTL
- Origin Header: **Cache-Control max-age** (seconds)
- Origin Header: **Cache-Control s-maxage** (seconds)
- Origin Header: **Expires** (Date & Time)
- Custom Origin or S3 (Via **Object metadata**)
- Default if not specified

### Cache Invalidations

- Cache invalidation - performed on a **distribution**
- Applies to all edge locations - **take time**
- /images/whiskers1.jpg
- /images/whickers*
- /images/*
- /*
- Cache invalidations has the same cost regardless of number of hits
- **Versioned file names**: whiskers1_v1.jpg // _v2.jpg // _v3.jpg
- Not S3 object versioning
- **More cost effective!**
-

## AWS Certificate Manager (ACM)

> *The AWS certificate Manage is a service which allows the creation, management and renewal of certificates. It allows deployment of certificates onto supported AWS services such as CloudFront and ALB.*
>
- HTTP: Simple and Insecure
- HTTPS: SSL/TLS Layer of Encryption added to HTTP
- Data is encrypted in-transit
- Certificates prove identity
- **Chain of trust** - Signed by a **trusted authority**
- ACM lets you run a **public** or **private** Certificate Authority (CA)
- **Private CA:** Applications need to trust your private CA
- **Public CA**: Browsers trust a list of providers, which can trust other providers (chain of trust)
- AVM can **generate** or **import** certifications
- If generated it can automatically renew
- If imported **you are responsible for renewal**
- Certificates can be deployed out to **supported services**
- Supported AWS Services ONLY (E.g. CloudFront and ALBs… NOT EC2)
- ACM is a **regional service**
- Certs **cannot leave the region they are generated or imported in**
- To use a cert with an ALB in ap-southeast-2 you need a cert in ACM in ap-southeast-2
- Global Services such as CloudFront **operate as though within us-east-1**

### Architecture

![Untitled](img/Untitled%20156.png)

## CloudFront and SSL/TLS

💡 **❗Generate or import in ACM in us-east-1 to use with CloudFront❗**


- CloudFront Default Domain Name (CNAME)
- SSL supported by default - ***.cloudfront.net** cert
- **Alternate Domain Names** (CNAMES) e.g. cdn.catagram…
- Verify Ownership (optionally HTTPS) using a matching certificate
- HTTP or HTTPS, HTTP → HTTPS, HTTPS Only
- Two SSL Connections: Viewer → CloudFront and CloudFront → Origin
- Both need valid public certifications (and intermediate certs)

### CloudFront and SNI

- Historically every SSL enabled site needed its own IP
- Encryption starts at the TCP connection
- Host headers happens after that: Layer 7 // Application
- Used to need multiple IPs for multiple sites if SSL enabled
- **SNI** is a **TLS extension**, allowing host to be included
- Resulting in many SSL Certs/Hosts using a shared IP
- **Old browsers don’t support SNI**: CF charges extra for dedicated IP
- 600$ / month

![Untitled](img/Untitled%20157.png)

## Origin Types and Architecture

> *CloudFront origins store content distributed via edge locations.*
>
>
> *The features available differ based on using S3 origins vs Custom origins*
>

## Securing CF and S3 using OAI

> *Origin Access Identities are a feature where virtual identities can be created, associated with a CloudFront Distribution and deployed to edge locations.*
>
>
> *Access to an s3 bucket can be controlled by using these OAI's - allowing access from an OAI, and using an implicit DENY for everything else.*
>
> *They are generally used to ensure no direct access to S3 objects is allowed when using private CF Distributions.*
>
> *This lesson covers the main ways to secure origins from direct access (bypassing CloudFront)*
>
> - *Origin Access identities (OAI) - for S3 Origins*
> - *Custom Headers - For Custom Origins*
> - *IP Based FW Blocks - For Custom Origins.*

### Origin Access Identity (OAI)

- An OAI is a type of identity
- It can be associated with CloudFront Distributions
- CloudFront ‘**becomes’** that OAI
- That OAI can be used in S3 Bucket Policies
- DENY all BUT one or more OAI’s

![Untitled](img/Untitled%20158.png)

### Securing Custom Origins

![Untitled](img/Untitled%20159.png)

## CloudFront Private Distributions & Behavior -  Signed URLs & Cookies

### Private Distributions (*behaviors)

- Public - Open Access to objects
- Private - Requests require Signed Cookie or URL
- 1 behavior - Whole Distribution PUBLIC or PRIVATE
- Multiple behaviors- each is PUBLIC or PRIVATE
- OLD way: A CloudFront Key is created by an Account Root User
- Then account is added as a **TRUSTED SIGNER**
- **NEW:** **Trusted Key Groups** added

### CloudFront Signed URLs vs Cookies

- Signed URLs provides access to **one object**
- Historically RTMP distributions couldn’t use cookies
- Use URLs if your client doesn’t support cookies
- Cookies provides access to groups of objects
- Use for groups of files/all files of a type - e.g. all cat gifs
- Or if maintaining application URL’s is important

### Private Distributions

![Untitled](img/Untitled%20160.png)

## ****Lambda@Edge****

> *Lambda@Edge allows cloudfront to run lambda function at CloudFront edge locations to modify traffic between the viewer and edge location and edge locations and origins.*
>
- You can run **lightweight** Lambda at **edge locations**
- **Adjust** data between the **viewer** and **origin**
- Currently supports Node.js and Python
- Run in the AWS Public Space (Not VPC)
- **Layers** are not supported
- Different limits vs normal Lambda functions

![Untitled](img/Untitled%20161.png)

### Lambda@Edge Use Cases

- A/B testing - **Viewer Request**
- Modify image URL
- Migration between S3 Origins - **Origin Request**
- Different Object based on Device - **Origin Request**
- Content by Country - **Origin Request**

## AWS Global Accelerator

> *AWS Global Accelerator is designed to improve global network performance by offering entry point onto the global AWS transit network as close to customers as possible using ANycast IP addresses*
>

### The Problem

- Starts in one area, grows popular and then receive lots of users from far-off locations
- Latency
- Multiple “hops”
- Low quality connection

### Global Accelerator

- ❗When to use CF and when to use GA
- 2x **anycast** IP Addresses
- 1.2.3.4 & 4.3.2.1
- **Anycast IPs** allow a single IP to be in multiple locations. Routing moves traffic to closest location
- Traffic initially uses **public internet** and enters a Global Accelerator edge location
- From the edge, data transits globally across the AWS global backbone network. Less hops, directly under AWS control, significantly better performance

### Key Concepts

- Moves the AWS network closer to customers
- **Connections enter at edge using anycast IPs**
- Transit over AWS backbone to 1+ locations
- Can be used for NON hTTP/S (TCP/UDP) - **DIFFERENCE FROM CLOUDFRONT**


