#  Simple Storage Service S3

## S3 Security

> *S3 is private **by default***
>

### S3 Bucket Policies

- A form of **resource policy** ❗
- Like identity policies, but attached to a bucket
- Resource perspective permissions
- ALLOW/DENY same or **different** accounts
- ALLOW/DENY **anonymous** principals

![Untitled](img/Untitled%2012.png)


### Access Control Lists (ACLs)

- ACLs on objects and bucket
- A subresource
- **LEGACY!**❗
- Inflexible and simple permissions

### Block Public Access

- Fail safe

### Summary

- Identity: Controlling different resources
- Identity: You have a preference for IAM
- Identity: Same account
- Bucket: Just controlling S3
- Bucket: Anonymous or Cross-Account
- ACLs: **Never** - unless you must

## S3 Static Hosting

### Static Website Hosting

- Normal access is via **AWS APIs**
- This feature allows access via HTTP - e.g. Blogs
- **Index** and **Error** documents are set
- **Website Endpoint** is created
- Custom Domain via **R53** - Bucket name matters!
- **Offloading:** Large data files such as pictures can be saved in a static S3 bucket to offload the page being accessed
- **Out-of-band pages:** During maintenance of a server, configure DNS to point at an error HTML page hosted at static S3.

![Untitled](img/Untitled%2013.png)

### S3 Pricing

- Per GB month charge ❗
- Every GB in is free ❗
- Every GB out of S3 is charged ❗
- GET, PUT, POST etc pricing per 1000 requests  ❗

## Object Versioning & MFA Delete

> **Once enabled, you can never disable it again! Can be suspended and reenabled.
Versioning lets you store multiple versions of objects within a bucket. Operations which would modify objects generate a new version.**

*Almost guaranteed to feature on the exam* ❗
>
- Without versioning each object is identified by their key
- With versioning disabled on an object, the id of the object is set to null
- If an object is requested without specifying the id, you always retrieve the latest object
- If we delete an object without specifying id, the objects is not actually deleted but it adds a delete marker.
- Delete markers can be deleted
- To fully delete you must provide the id of the object you delete
- **OBJECT VERSIONING CANNOT BE SWITCHED OFF**
- Space is consumed by all versions
- You are billed for all versions

### MFA Delete (Multi-Factor Authentication)

- Enabled in **versioning configuration**
- MFA is required to change bucket **versioning state**
- MFA is required to **delete versions**
- Serial number (MFA) + Code passed with API CALLS

## S3 Performance Optimization

### Single PUT Upload

- Single data stream to S3
- Stream fails - upload fails
- Requires full start
- Speed & reliability = limit of 1 stream
- Any upload to to 5 GB

### Multipart Upload

- Data is broken up
- **Min data size 100 MB**
- 10 000 max parts, 5MB → 5GB ❗
- Parts can fail, and be restarted
- Transfer rate = speed of all parts

### S3 Accelerated Transfer (Off)

- Uses the network of edge locations
- Default turned off
- Some restrictions to enable it
- Transfers data via the AWS network - more efficient than public internet
- Lower, consistent latency
- The worse the initial connection, the bigger the gain of uses accelerated transfer

## Key Management Service (KMS)

> **Regional & Public Service
Create, Store and Manage Keys
Symmetric and Asymmetric Keys
Cryptographic operations (encrypt, decrypt &…)
Keys never leave KMS - Provides FIPS 140-2 (L2)**
>

### KMS Keys

- Consider it a container
- **Logical -** ID, date, policy, desc & state
- … backed by **physical** key material
- Generated or imported
- KMS Keys can be used for up to 4KB of data
- **Everything on disk is encrypted, never in plaintext form** ❗
- **May be in plaintext in memory** ❗

### KMS and KMS Keys

> **CMK - Customer Managed Keys**
>

![Untitled](img/Untitled%2014.png)

### Data Encryption Keys (DEKs)

- **GenerateDataKey - works on > 4KB**
1. Plaintext Version → Lock (Encrypt data)
2. Ciphertext Version → Unlock (Decrypt data)
3. Encrypt data using plaintext key
4. Discard plaintext version
5. Store encrypted key with data

### Key Concepts

- KMS Keys are isolated to a region and lever leave
- Multi-region keys exist
- AWS Owned & Customer Owned
- Customer Owned: AWS Managed og *Customer Managed KEYS*
- Customer Managed keys are more configurable
- KMS Keys support rotation
- Backing Key (and previous backing keys)
- Aliases

### Key Policies and Security

- Key Policies (Resource)
- Every KEY has one
- Key Policies + IAM Policies
- Key Policies + Grants

```json
{
"Sid": "Enable IAM User Permissions",
"Effect": "Allow",
"Principal": {"AWS": "arn:aws:iam:1122334455:root"},
"Action": "kms:*",
"Recource": "*"
}

{
"Version": "2012-10-17",
"Statement": {
"Effect":"Allow",
"Action": [
"kms:Encrypt",
"kms:Decrypt"
]
"Resource": [
"arn:aws:kms:*:1122334455:key/*"
]
}
}
```

## S3 Encryption

> Buckets aren’t encrypted. **Objects are!**
>
- **Client**-Side Encryption
- Encrypted by client before upload
- Keys, process, tooling
- **Server**-Side Encryption
- Objects themselves aren’t encrypted. Reaches S3 in plaintext, and is then encrypted.

### Server-Side Encryption (SSE-C , SSE-S3 and SSE-KMS)

- Server-Side Encryption with Customer-Provided Keys **(SSE-C)**
- Customer is responsible for keys used to encrypt/decrypt
- S3 manages the actual encryption - no CPU requirement on client, but still need to manage the actual keys ❗
- When uploading an object, provide **object and key** ❗
- Encrypted objects is stored on S3
- To decrypt you must provide a key to decrypt and specify the object you wish to retrieve
- Server-Side Encryption with Amazon S3-Managed Keys **(SSE-S3) [AES256]**
- AWS Manages encryption & keys
- S3 creates a root key
- Creates a key thats unique for every object
- This key encrypts plaintext object, then root key is used to encrypt that key
- Original unencrypted version of this key is discarded
- *?Root key decrypts unique key, that is again used to decrypt object?*
- Cons:
- No access to keys
- No control over rotation of keys
- No role separation
- Server-Side Encryption with KMS KEYS Stored in AWS KMS **(SSE-KMS)**
- Root key is handled by KMS
- The KMS key is used to generate a unique key for every object that is encrypted using SSE-KMS
- You are not restricted to use the KMS Key provided på AWS. You can use your own customer-managed KMS key.
- You can control permissions and rotation
- **Role separation!** S3 admin with full access can’t see the unencrypted version of objects - need access to the KMS key

![Untitled](img/Untitled%2015.png)

| Method | Key Management | Encryption Processing | Extras |
|  |  |  |  |
| Client-Side | You | You |  |
| SSE-C | You | S3 |  |
| SSE-S3 | S3 | S3 |  |
| SSE-KMS | S3 & KMS | S3 | Rotation Control
Role Separation |

![Untitled](img/Untitled%2016.png)

### Bucket Default Encryption

- PUT operation when uploading
- header
- x-amz-server-side-encryption : “AES256” eller “aws:kms”
- How you specify to use S3 encryption
- AES-256: SSE-S3
- aws:kms : SSE-KMS
- Can set a default for a bucket when you don’t specify this header
- Can also restrict what encryption is possible on a bucket

## S3 Object Storage Classes

### S3 Standard

![Untitled](img/Untitled%2017.png)

### S3 Standard-IA (Infrequent Access)

> Cheaper!
But, retrieval fee. Overall cost increases with frequent access.
>

![Untitled](img/Untitled%2018.png)

### S3 One Zone-IA

![Untitled](img/Untitled%2019.png)

### S3 Glacier Instant

> Like S3 Standard-IA… cheaper storage, more expensive retrieval, longer minimum
>

![Untitled](img/Untitled%2020.png)

### S3 Glacier Flexible

> *Cold objects*
Objects cannot be made publicly accessible. Any Access of data requires a retrieval process.
>

![Untitled](img/Untitled%2021.png)

### S3 Glacier Deep Archive

> Cheapest alternative. LONG time to retrieve - hours to days.
>

![Untitled](img/Untitled%2022.png)

### S3 Intelligent-Tiering

![Untitled](img/Untitled%2023.png)

## S3 Lifecycle Configuration

> Automatically transition or expire objects in a bucket. Optimize costs.
>
- A lifecycle configuration is a **set of rules**
- Rules consist of **actions**
- on a **bucket** or **groups of objects**
- Transition actions
- e.g. to S3 Glacier
- Expiration actions
- Delete object(s) after a certain time

### Transitions

> Sort of waterfall between the S3 Storage Classes
>

![Untitled](img/Untitled%2024.png)

## S3 Replication

- **CRR: Cross-Region Replication**
- Replicate buckets across regions
- **Same-Region Replication:**
- Replicate buckets within the same region
- Only differ by whether they are in the same or different account
- For different accounts:
- Role is not trusted by default since its configured by another account
- Add bucket policy to allow role

![Untitled](img/Untitled%2025.png)


### S3 Replication Options

- **All objects** or a **subset**
- **Storage Class** - default is to maintain
- **Ownership** - default is the source account
- Can override such that destination account is the owner
- **RTC: Replication Time Control**
- Make sure that buckets are in sync
- 15 minutes

### S3 Replication Considerations

- **Not retroactive!** Versioning needs to be ON
- **One-way replication:** Source to destination
- Objects added to destination wont be added to source
- Unencrypted, SSE-S3 & SSE-KMS (with extra config)
- Not SSE-C! ❗
- Source bucket owner needs permissions to objects
- No system events, Glacier or Glacier Deep Archive
- Lifecycle actions wont be replicated at destination
- Can’t replicate any objects within Glacier+
- NO DELETES
- Delete markers are not replicated
- Not enabled by default

### Why use replication?

> SSR: Same Region Replication
CRR: Cross Region
>
- SSR - Log Aggregation
- SSR - Prod and Test Sync
- SSR - Resilience with strict sovereignty
- CRR - Global Resilience Improvements
- CRR - Latency Reduction

## S3 Presigned URLs

> *Give another person or application access to a object in a bucket using your credentials in a safe way!*
>
- Expire at a certain time
- Person using URL is acting as the person who created the presigned URL
- PUT, GET
- Offload media to S3
- You can create a URL for an object you have **no access to**
- Few use cases, but possible
- When using the URL, the permissions match the **identity which generated**
- Access denied could mean the generating ID **never had access**, or **doesn’t now**
- **Don’t generate with a role**! URL stops working when the temporary credentials expire.

![Untitled](img/Untitled%2026.png)

![Untitled](img/Untitled%2027.png)

![Untitled](img/Untitled%2028.png)

## S3 Select and Glacier Select

> *Ways to retrieve parts of objects rather than the object.
SQL-Like statement*
>
- S3 can store objects up to 5 TB
- You often want to retrieve the entire objects
- S3/Glacier select let you use SQL-Like statements
- select part of the object, pre-filtered by S3
- CSV, JSON, Parquet, BSZIP2 compression for CSV and JSON

### Architecture

![Untitled](img/Untitled%2029.png)

## S3 Events

> *Receive notifications when certain events happen in your bucket*
>

### S3 Notifications

- Notification generated when events occur in a bucket
- can be delivered to SNS, SQS and Lambda functions
- Object Created (Put, Post, copy, CompleteMultiPartUpload)
- Object Delete (*, Delete, DelteMarkedCreated)
- Object Restore (Post(Initiated), Completed)
- Replication
- **Use EventBridge as default!**
- Newer and adds support for more services and events

![Untitled](img/Untitled%2030.png)

## S3 Access Logs

> *Provides detailed records for the requests that are made to a bucket*
>

![Untitled](img/Untitled%2031.png)

## S3 Object Lock

> *You can use S3 Object Lock to store objects using a write-once-read-many (WORM) model. It can help you prevent objects from being deleted or overwritten for a fixed amount of time or indefinitely. You can use S3 Object Lock to meet regulatory requirements that require WORM storage, or add an extra layer of protection against object changes and deletion.*
>
- Object Lock enabled on “new” buckets* (Support for existing)
- Write-Once-Read-Many (**WORM) - No delete, No owerwrite**
- Requires **versioning - individual versions** are locked
- 1 - **Retention** Period
- 2 - **Legal Hold**
- **Both, One** or **the other**, or **none**
- A bucket can have **default object lock settings**

### Retention

- Specify **DAYS & YEARS -** A Retention Period
- **COMPLIANCE** - **Cant be adjusted, deleted, overwritten**
- even by account root user
- **until retention expires**
- Use due to compliance
- **GOVERNANCE** - special **permissions** can be granted allowing lock settings to be adjusted
- **s3:ByPassGovernanceRetention**
- x-ams-bypass-governance-retention:true (console default)

### Legal Hold

- Set on an **object version - ON or OFF**
- No retention
- **NO DELETES** or changes until removed
- s3:PutObjectLegalHold is required to add or remove
- Prevent accidental deletion of object version

![Untitled](img/Untitled%2032.png)


