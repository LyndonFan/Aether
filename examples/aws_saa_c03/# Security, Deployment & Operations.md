# Security, Deployment & Operations

## AWS Secrets Manager

> *AWS Secrets manager is a product which can manage secrets within AWS. There is some overlap between it and the SSM Parameter Store - but Secrets manager is specialised for secrets.*
>
>
> *Additionally Secrets managed is capable of automatic credential rotation using Lambda.*
>
> *For supported services it can even adjust the credentials of the service itself.*
>
- It does share functionality with Paramter Store
- ❗Designed for **secrets (passwords, API KEYS…)**❗
- Usable via **console, CLI, API** or **SDK’s** (integration)
- ❗Supports **automatic rotation** - this uses Lambda❗
- ❗Directly integrates with some AWS Products (RDS)❗

💡 **RDS, integration, secrets or rotation → Secrets Manager > Parameter Store!**


### Architecture

![Untitled](img/Untitled%20195.png)

## Application Layer (L7) Firewall

> *Application Layer, known as Layer 7 or L7 firewalls are capable of inspecting, filtering and even adjusting data up to Layer 7 of the OSI model. They have visibility of the data inside a L7 connection. For HTTP this means content, headers, DNS names .. for SMTP this would mean visibility of email metadata and for plaintext emails the contents.*
>

### Normal Firewalls (Layer 3/4/5)

![Untitled](img/Untitled%20196.png)

### Application (Layer 7) Firewalls

![Untitled](img/Untitled%20197.png)

## Web Application Firewall (WAF)

> *AWS WAF is a web application firewall that helps protect your web applications or APIs against common web exploits and bots that may affect availability, compromise security, or consume excessive resources.*
>
- AWS Layer 7 Firewall

### Architecture

![Untitled](img/Untitled%20198.png)

### Web Access Control lists (WEBACL)

- WEBACL Default Action (ALLOW or BLOCK) - Non matching
- Resource Type - **CloudFront** or **Regional Service (ALB, AP GW, AppSync)**
- Add **Rule Groups** or **Rules** - processed in order
- Web ACL Capacity Units (**WCU)** - Default 1500
- can be increased via **support ticket**
- WEBACL’s are associated with resources (this can take time)
- **adjusting** a WEBACL takes **less time** than associating one

### Rule Groups

- Rule groups contain rules
- They don’t have default actions - that’s defined when **groups** or **rules** are added to WEBACLs
- **Managed** (AWS or Marketplace), **Yours, Service** Owned (i.e Shield & Firewall Manager)
- **Rule Groups** can be referenced by multiple WEBACL
- Have a WCU capacity (defined upfront, max 1500*)

### WAF Rules

- **Type, Statement, Action**
- Type:
- **Regular**
- **Rate-Based**
- Statement:
- (WHAT to match)
- or (Count ALL)
- or (WHAT & COUNT)
- origin country, IP, label, header, cookies, query parameter, URI path, query string, body (**first 8292 bytes only)**, HTTP method
- **Single, AND, OR, NOT**
- Action: **ALLOW*, BLOCK, COUNT, CAPTCHA -** Custom **Response (x-amzn-waf-), Label**
- Labels can be referenced later in the same WEBACL - multi-stage flows
- **ALLOW** and **BLOCK** stop processing, Count/Captcha actions continue

### Pricing

- **WEBACL** - Monthly ($5 month) (remember can be reused)
- **RULE** on WEBACL - Monthly ($1 /month*)
- **REQUESTS** per WEBACL - Monthly ($0.60 / 1 million*)
- Intelligent Threat Mitigation
- Bot Control - $10/month & $1/1mil reqs
- Captcha - $0.40 / 1000 challenge attempts
- Fraud control/account takeover ($10 month) & $1 / 1000 login attempts
- Marketplace Rule Groups - Extra costs

## AWS Shield

> *AWS Shield is a managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS. AWS Shield provides always-on detection and automatic inline mitigations that minimize application downtime and latency, so there is no need to engage AWS Support to benefit from DDoS protection.*
>
- AWS Shield Standard & Advanced — **DDOS Protection** ❗
- Shield Standard is free - Advanced has a cost
- Network Volumetric Attacks (L3) - Saturate Capacity
- Network Protocol Attacks (L4) - TCP SYN Flood
- Leave connections open, prevent new ones
- L4 can also have volumetric component
- Application Layer Attacks (L7) - e.g. web request floods
- query.php?search=all_the_cat_images_ever

### Shield Standard

- Free for AWS Customers
- protection at the perimeter
- region/VPC or the AWS edge
- Common Network (L3) or Transport (L4) layer attacks
- Best protection using R53, CloudFront and AWS Global Accelerator

### AWS Shield Advanced

- $3000 per month (per ORG), 1 year lock-in + data (OUT) / month
- Protects CF, R53, Global Accelerator, Anything Associated with EIPs (EC2), ALBs, CLBs, NLBs
- Not automatic - must be explicitly enabled in Shield Advanced or AWS Firewall Manager Shield Advanced policy
- **Cost protection** (i.e. EC2 scaling) for unmitigated attacks
- Proactive engagement & AWS Shield Response Team (SRT)
- WAF Integration - includes basic AWS WAF fees for web ACLs, rules and web requests
- Application Layer (L7) DDOS protection (uses WAF)
- Real time visibility of DDOS events and attacks
- Health-based detection - application specific health checks, used by proactive engagement team
- Protection groups

## CloudHSM

> *CloudHSM is required to achieve compliance with certain security standards such as FIPS 140-2 Level 3*
>
- With KMS - AWS Manage - Shared but separated
- **❗Security concern: Shared Service❗**
- True “Single Tenant” **Hardware Security Module** (**HSM)**
- ❗**AWS provisioned - fully customer managed**❗
- ❗FIPS 140-2 Level 3 (KMS is L2 overall, some L3)❗
- Industry Standard APIs - PKCS#11, Java Cryptography Extensions (JCE), Microsoft CryptoNG (CNG) libraries
- KMS can use CloudHSM as a custom key store, CloudHSM integration with KMS

### Architecture

![Untitled](img/Untitled%20199.png)

### CloudHSM Use Cases

- No native AWS integration - e.g. no S3 SSE
- Offload the SSL/TLS processing for web servers
- Enable Transparent Data Encryption (TDE) for Oracle Databases
- Protect the Private Keys for an Issuing Certificate Authority (CA)

## AWS Config

> *AWS Config is a service which records the configuration of resources over time (configuration items) into configuration histories.*
>
>
> *All the information is stored regionally in an S3 config bucket.*
>
> *AWS Config is capable of checking for compliance .. and generating notifications and events based on compliance.*
>
- Record configuration changes over time on resources
- Auditing of changes, compliance with standards
- Does not prevent changes happening - no protection
- Regional Service - supports cross-region and account aggregation
- Changes can generate SNS notifications and near-real time events via EventBridge & Lambda

![Untitled](img/Untitled%20200.png)

## Amazon Macie

> *Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS.*
>
- Data **Security** and Data **Privacy** Service
- Discover, Monitor and Protect data - stored in S3 buckets
- Automated discovery of data, i.e. PII, PHI, Finance
- Managed Data Identifiers - Built-in - ML/Patterns
- Custom Data Identifiers - Proprietary - Regex Based
- Integrates - With Security Hub & “finding events” to EventBridge
- Centrally manage - either via AWS ORG or one Macie Account Inviting

### Architecture

![Untitled](img/Untitled%20201.png)

### Identifiers

- Managed data identifiers - maintained by AWS
- growing list of common sensitive data types
- credentials, finance, health, personal identifiers
- Custom data identifiers - created by you
- Regex
- Maximum Match Distance - how close keywords are to regex pattern
- Ignore words - if regex match contains ignore words, it’s ignored

### Findings

- Policy findings or sensitive data findings
- Policy: E.g. public access to s3 bucket
- Sensitive data: credentials, financial etc

## Amazon Inspector

> *Amazon Inspector is an automated security assessment service that helps improve the security and compliance of applications deployed on AWS. Amazon Inspector automatically assesses applications for exposure, vulnerabilities, and deviations from best practices*
>
- Scans EC2 instances & the instance OS
- also containers
- Vulnerabilities and deviations against best practice
- Length - 15min, 1 hour, 8/12 hours or 1 day
- Provides a **report of findings** ordered by priority
- Network Assessment (Agentless)
- Network & Host Assessment (Agent)
- Rules packages determine what is checked
- Network Reachability (no agent required)
- Agent can provided additional os visibility
- Check reachability end to end. EC2, ALB, DX, ELB, ENI, IGW, ACLs, RT’s, SG’s, Subnets, VPCs, VGWs and VPC Peering
- RecognizedPortWithListener, RecognizedPortNoListener, UnRecognizedPortWithListener
- Packages (Host assessments, agent required)
- Common vulnerabilities and exposures (CVE)
- Center for Internet Security (CIS) Benchmarks
- Security best practices for Amazon Inspector

## Amazon GuardDuty

> *Guard Duty is an automatic threat detection service which reviews data from supported services and attempts to identify any events outside of the 'norm' for a given AWS account or Accounts.*
>
- **Continuous** security monitoring service
- Analyses supported Data Sources
- plus AI/ML, plus threat intelligence feeds
- Identifies unexpected and unauthorized activity
- Notify or event-driven protection/remediation
- Supports multiple accounts (MASTER and MEMBER)

### Architecture

![Untitled](img/Untitled%20202.png)


