#  Infrastructure as Code (CloudFormation)

## Physical & Logical Resources

> *CloudFormation defines logical resources within templates (using YAML or JSON). The logical resource defines the WHAT, and leaves the HOW up to the CFN product. A CFN stack creates a physical resource for every logical resource - updating or deleting them as a template changes.*
>
- CF Template - YAML or JSON
- Contains logical resources - the *WHAT*
- Templates are used to create **stacks**
- Can create one or multiple
- Stacks create **physical resources** from the logical
- If a stacks template is change physical resources are changed
- If a stack is deleted, normally, the physical resources are deleted

![Untitled](img/Untitled%20203.png)

![Untitled](img/Untitled%20204.png)

## Template and Pseudo Parameters

> *Template and Pseudo Parameters are two methods to provide input to a template, which can influence what resources are provisioned, and the configuration of those resources.*
>
- Template parameters accept input - console/CLI/API
- When a stack is created or updated
- Can be referenced from within Logical Resources
- Influence physical resources and/or configuration
- Can be configured with **Defaults, AllowedValues, Min and Max length & AllowedPatterns, NoEcho & Type**

### Template Parameters

![Untitled](img/Untitled%20205.png)

### Pseudo Parameters

- **`AWS::Region` matches region template is used in**

![Untitled](img/Untitled%20206.png)

## Intrinsic Functions

> *AWS CloudFormation provides several built-in functions that help you manage your stacks. Use intrinsic functions in your templates to assign values to properties that are not available until runtime.*
>
- `Ref` and `Fn::GetAtt`
- `Fn::Join` and `Fn::Split`
- `Fn::GetAZs` and `Fn::Select`
- Commonly used together
- Conditions (`Fn:: IF, And, Equals, Not, Or`)
- `Fn::Base64` and `Fn::Sub`
- `Fn::Cidr`
- Later
- `Fn::ImportValue`
- `Fn::FindInMap`
- `Fn::Transform`

### `Ref` and `Fn::GetAtt`

![Untitled](img/Untitled%20207.png)

## `Fn::GetAZs` and `Fn::Select`

![Untitled](img/Untitled%20208.png)

### `Fn::Join` and `Fn::Split`

![Untitled](img/Untitled%20209.png)

### `Fn::Base64` and `Fn::Sub`

![Untitled](img/Untitled%20210.png)

### `FN::Cidr`

![Untitled](img/Untitled%20211.png)

## `Mappings`

> *The optional `Mappings` section matches a key to a corresponding set of named values. For example, if you want to set values based on a region, you can create a mapping that uses the region name as a key and contains the values you want to specify for each specific region. You use the `Fn::FindInMap` intrinsic function to retrieve values in a map.*
>
- Templates can contain a **Mappings** object
- which can contain **many mappings**
- which map **keys to values**, allowing lookup
- Can have one **key**, or **Top & Second level**
- Mappings use the `!FindInMap` intrinsic function
- Common use - retrieve AMI for given region & architecture
- **Improve template portability** ❗

![Untitled](img/Untitled%20212.png)

## `Outputs`

> *The optional `Outputs`section declares output values that you can import into other stacks (to create cross-stack references), return in response (to describe stack calls), or view on the AWS CloudFormation console. For example, you can output the S3 bucket name for a stack to make the bucket easier to find.*
>
- Templates can have an **optional** Outputs section
- Values can be declared in this section
- Visible as outputs when using the CLI
- visible as outputs in the console UI
- accessible from a parent stack when using **nesting** ❗
- can be exported, allowing **cross-stack references** ❗

![Untitled](img/Untitled%20213.png)

## `Conditions`

> *The optional `Conditions` section contains statements that define the circumstances under which entities are created or configured. You might use conditions when you want to reuse a template that can create resources in different contexts, such as a test environment versus a production environment. In your template, you can add an `EnvironmentType` input parameter, which accepts either **`prod`** or **`test`** as inputs. Conditions are evaluated based on predefined pseudo parameters or input parameter values that you specify when you create or update a stack. Within each condition, you can reference another condition, a parameter value, or a mapping. After you define all your conditions, you can associate them with resources and resource properties in the `Resources` and `Outputs` sections of a template*
>
- Created in the optional `Conditions` section of a template
- Conditions are evaluated to **TRUE** or **FALSE**
- processed **before** resources are created ❗
- Use the other intrinsic functions `AND, EQUALS, IF, NOT, OR`
- associated with logical resources to control if they are created or not
- e.g. ONEAZ, TWOAZ, THREEAZ - how many AZs to create resources in
- e.g. PROD, DEV - control the size of instances created in a stack

![Untitled](img/Untitled%20214.png)

## `DependsOn`

> *With the `DependsOn` attribute you can specify that the creation of a specific resource follows another. When you add a `DependsOn` attribute to a resource, that resource is created only after the creation of the resource specified in the`DependsOn` attribute*
>
- CloudFormation tries to be efficient
- does thing in **parallel** (create, update & delete)
- tries to determine a **dependency order** (VPC → SUBNET → EC2)
- **references** or **functions** create these
- `DependsOn` lets you explicitly define these
- If resources B and C depends on A
- both wait for A to complete before starting

![Untitled](img/Untitled%20215.png)

## `WaitCondition`, `CreationPolicy` and cfn-signal

> *CreationPolicy, WaitConditions and cfn-signal can all be used together to prevent the status if a resource from reaching create complete until AWS CloudFormation receives a specified number of success signals or the timeout period is exceeded.The cfn-signal helper script signals AWS CloudFormation to indicate whether Amazon EC2 instances have been successfully created or updated.*
>

### CF Provisioning

- Logical resources in the template
- used to create stack
- creates physical resources in AWS
- Logical Resource CREATE_COMPLETE = All ok? ❓

### CF Signal

- Configure CF to hold
- Wait for X number of **success** signals
- Wait for **Timeout H:M:S** for those signals (**12 hour max**)
- If success signals received - CREATE_COMPLETE
- If **failure** signal received - **creation fails**
- If **timeout** is reached - **creation fails**
- **CreationPolicy** or **WaitCondition**

### CF `CreationPolicy`

![Untitled](img/Untitled%20216.png)

### CF `WaitCondition`

![Untitled](img/Untitled%20217.png)

## Nested Stacks

> *Nested stacks allow for a hierarchy of related templates to be combined to form a single product*
>
>
> *A root stack can contain and create nested stacks .. each of which can be passed parameters and provide back outputs.*
>
> *Nested stacks should be used when the resources being provisioned share a lifecycle and are related.*
>

### Key Concepts

- Overcome the **500 resource limit** of one stack
- Modular templates - code resuse
- Make the installation process process easier
- nested stacks created by the root stack
- ❗**Use only when everything is lifecycle linked!** ❗

### A Stack

- **Resources in a single stack share a lifecycle**
- Stack resource limits 500
- Can’t easily reuse resources, e.g. a VPC
- Can’t easily reference other stacks

### Nested Stacks

![Untitled](img/Untitled%20218.png)

## Cross-Stack References

> *Cross stack references allow one stack to reference another*
>
>
> *Outputs in one stack reference logical resources or attributes in that stack*
>
> *They can be exported, and then using the !ImportValue intrinsic function, referenced from another stack.*
>

💡 **Nested Stacks allow you to reuse templates - Cross-Stack References allow you to reuse actual physical resources**


- Outputs are normally not visible from other stacks
- Nesten stacks can reference them
- **Outputs can be exported - making them visible from other stacks**
- Exports must have a **unique name in the region**
- `Fn::ImportValue` can be used instead of `Ref`

### Architecture

![Untitled](img/Untitled%20219.png)

## StackSets

> *StackSets are a feature of CloudFormation allowing infrastructure to be deployed and managed across multiple regions and multiple accounts from a single location.*
>
>
> *Additionally it adds a dynamic architecture - allowing automatic operations based on accounts being added or removed from the scope of a StackSet.*
>
- Deploy CFN stacks across **many accounts and regions**
- StackSets are **containers** in an admin account
- contain **stack instances** - which **reference stacks**
- **Stack instances** & **stacks** are in ‘target accounts’
- Each stack = 1 region in 1 account
- 🚨 Security = **self-managed or service-managed** 🚨

### Key Concepts

- **Term:** Concurrent Accounts
- **Term:** Failure Tolerance
- **Term:** Retain Stacks
- **Scenario:** Enable AWS Config
- **Scenario:** AWS Config Rules - MFA, EIPS, EBS Encryption
- **Scenario:** Create IAM Roles for cross-account access

### Architecture

![Untitled](img/Untitled%20220.png)

## `DeletionPolicy`

> *With the DeletionPolicy attribute you can preserve or (in some cases) backup a resource when its stack is deleted. You specify a DeletionPolicy attribute for each resource that you want to control. If a resource has no DeletionPolicy attribute, AWS CloudFormation deletes the resource by default.*
>
- If you **delete** a logical resource from a template
- by default, the physical resource is deleted
- This can cause data loss
- With deletion policy, you can define on each resource
- **Delete** (Default)
- **Retain**
- (if supported) **Snapshot**
- **Supported resources for snapshot:** EBS Volume, ElastiCache, Neptune, RDS, Redshift
- Snapshots continue past Stack lifetime - you have to clean up
- **ONLY APPLIES TO DELETE - NOT REPLACE**

### Visual

![Untitled](img/Untitled%20221.png)

## Stack Roles

> *Stack roles allow an IAM role to be passed into the stack via PassRole*
>
>
> *A stack uses this role, rather than the identity interacting with the stack to create, update and delete AWS resources.*
>
> *It allows role separation and is a powerful security feature.*
>
- When you create a stack CFN creates physical resources
- CFN uses the **permissions** of the **logged in identity**
- Which means **you need permissions for AWS**
- CFN can **assume a role** to **gain the permissions**
- This lets you implement role reparation
- The identity creating the stack **doesn’t need resource permissions** - only **PassRole**

![Untitled](img/Untitled%20222.png)

## CloudFormationInit (CFN-INIT)

> *CloudFormationInit and cfn-init are tools which allow a desired state configuration management system to be implemented within CloudFormation*
>
>
> *Use the AWS::CloudFormation::Init type to include metadata on an Amazon EC2 instance for the cfn-init helper script. If your template calls the cfn-init script, the script looks for resource metadata rooted in the AWS::CloudFormation::Init metadata key. cfn-init supports all metadata types for Linux systems & It supports some metadata types for Windows*
>
- Simple configuration management system
- Configuration directives stored in template
- **`AWS::CloudFormation::Init`** part of logical resource
- Procedural - **HOW** (User Data)
- vs Desired State - **WHAT (cfn-init)**
- **cfn-init** helper scripts - installed on EC2 OS

![Untitled](img/Untitled%20223.png)

## cfn-hup

> *The cfn-hup helper is a daemon that detects changes in resource metadata and runs user-specified actions when a change is detected. This allows you to make configuration updates on your running Amazon EC2 instances through the UpdateStack API action.*
>
- **cfn-init** is run once as part of bootstrapping (user data)
- if CloudFormation::Init is updated, it isn’t rerun
- **cfn-hup** helper is a daemon which can be installed
- it detects changes in **resource metadata**
- running configurable actions when a change is detected
- UpdateStack → updated config on EC2 instances

![Untitled](img/Untitled%20224.png)

## ChangeSets

> *When you need to update a stack, understanding how your changes will affect running resources before you implement them can help you update stacks with confidence. Change sets allow you to preview how proposed changes to a stack might impact your running resources, for example, whether your changes will delete or replace any critical resources, AWS CloudFormation makes the changes to your stack only when you decide to execute the change set, allowing you to decide whether to proceed with your proposed changes or explore other changes by creating another change set.*
>
- Template → Stack → Physical Resources (CREATE)
- Stack (Delete) → (Delete) Physical Resources
- v2 Template → Existing Stack → Resources **Change**
- ⚠️No interruption, ⚠️ some interruption, 🚨 Replacement 🚨
- ChangeSets let you preview changes (**A Change Set**)
- multiple different versions (lots of change sets)
- Chosen changes can be applied by **executing the change set**

![Untitled](img/Untitled%20225.png)

## Custom Resources

> *Custom resources enable you to write custom provisioning logic in templates that AWS CloudFormation runs anytime you create, update (if you changed the custom resource), or delete stacks*
>
- Logical resources in a template - **WHAT** you want
- CFN uses them to **CREATE, UPDATE and DELETE** physical resources
- CloudFormation doesn’t support everything
- ❗Custom Resources let **CFN integrate** with anything it **doesn’t yet**, or **doesn’t natively** support ❗
- ❗Passes data to something, gets data back from something❗

![Untitled](img/Untitled%20226.png)


