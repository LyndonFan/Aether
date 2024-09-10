# Accounts - Identity and Access Management (IAM) Basics

## Account and IAM **Basics**

💡 **AWS Account:** Container for **identities** (users) and **resources.**

Account **root user** has full control over all of the AWS account and any resources created within in. The root user can’t be restricted.

IAM **User Groups** and **Roles** can also be created and given full or limited permissions. All identities start with no permissions.

May be good practice to create multiple AWS Accounts for different uses (prod, dev, test).


- Every AWS account comes with its own running copy of IAM, which is a database.
- IAM is a globally resilient service, so any data is always secure across all AWS regions. (Exam Q)
- The IAM in each of your accounts is your own dedicated instance of IAM, separate from other accounts.
- IAM
- User
- IDs which represent humans or apps that need access to your account
- Group
- Collection of related users, e.g. dev team, finance or HR
- Role
- Can be used by **AWS Services**, or for granting **external access** to your account
- Used when the number of things is uncertain.
- IAM Policy
- Allow or deny access to AWS services when and only when they’re attached to IAM users, groups or roles.
- IAM three main jobs
- **Manage identities** - *An ID Provider (IDP)*
- Create, modify and delete IDs such as users and roles
- **Authenticate identities**
- Prove you are who you claim to be - generally username and passwords
- **Authorize**
- Allow or deny access to resources
- IAM is provided for free
- No cost for users, groups and roles. Limits for number of each.
- IAM is global service.
- Allow or deny its ids on its AWS account
- No direct control on external accounts or users - only control local ids in your account
- **Identity federation and MFA**
- Use Facebook, Twitter, Google etc. to access AWS resources

## IAM Access Keys

- Long-term credentials
- Don’t update manually
- IAM User don’t need username and password - for CLI access key is enough
- IAM User can have up to two access keys
- Can be created, deleted, made inactive or made active

### Access Keys consist of two parts

- Both are provided when created an access key
- These are only provided once - no ability to get access to the keys again. Need to be stored safely.
- Both parts are used when accessing AWS via CLI
- Access keys need to be deleted and recreated if they are leaked
- Possible to have two sets of keys such that you can create a new one, update all applications using the keys and then delete the old set

**Access Key ID:** ABABABABABABABA

**Secret Access Key:** oierWRhoefWORIOF/DFLWAnljef


