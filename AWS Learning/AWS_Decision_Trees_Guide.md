# 🌲 Master AWS Service Selection & Architecture Decision Trees

> **Source**: Compiled from your comprehensive AWS Learning Notes (Sections 4 – 31).  
> **Purpose**: A definitive, scenario-driven decision guide with **Mermaid Flowcharts**, **Decision Matrices**, and concrete **"If... Then..." Architecture Rules** to determine the exact AWS service for any architectural requirement.

---

## 📑 Table of Contents

1. [Domain 1: Compute & Container Hosting](#domain-1-compute--container-hosting)
2. [Domain 2: Storage & File Systems](#domain-2-storage--file-systems)
3. [Domain 3: Databases & In-Memory Caching](#domain-3-databases--in-memory-caching)
4. [Domain 4: Networking, Routing & Content Delivery](#domain-4-networking-routing--content-delivery)
5. [Domain 5: Messaging, Integration & Event Streaming](#domain-5-messaging-integration--event-streaming)
6. [Domain 6: Security, Encryption & Identity](#domain-6-security-encryption--identity)
7. [Domain 7: Monitoring, Auditing & Observability](#domain-7-monitoring-auditing--observability)
8. [Domain 8: DevOps, Infrastructure as Code & CI/CD](#domain-8-devops-infrastructure-as-code--cicd)
9. [Domain 9: API Management & Edge Computing](#domain-9-api-management--edge-computing)
10. [Domain 10: Big Data, Analytics & Specialized Services](#domain-10-big-data-analytics--specialized-services)

---

## Domain 1: Compute & Container Hosting

### 1.1 Compute Hosting Decision Tree

```mermaid
graph TD
    Start[Need Compute Hosting] --> Dur{Execution Duration & Workload Pattern?}
    
    Dur -->|< 15 Minutes & Event-Driven| Lambda[AWS Lambda<br><i>Serverless Functions</i>]
    Dur -->|Long-Running / Continuous| Container{Containerized Application?}
    
    Container -->|No: Monolith / Legacy / Standard App| Control{Level of Server Control Needed?}
    Control -->|High: Custom OS / Kernel / Hardware| EC2[Amazon EC2<br><i>Virtual Machines</i>]
    Control -->|Low: PaaS / Focus on Code Only| Beanstalk[AWS Elastic Beanstalk<br><i>Platform as a Service</i>]
    
    Container -->|Yes: Docker Containers| Orch{Orchestration Preference?}
    Orch -->|Managed ECS Container Framework| ECSLaunch{Manage Infrastructure/Servers?}
    Orch -->|Kubernetes Standard APIs| EKS[Amazon EKS<br><i>Elastic Kubernetes Service</i>]
    
    ECSLaunch -->|No: Serverless Containers| Fargate[AWS Fargate<br><i>Serverless Container Compute</i>]
    ECSLaunch -->|Yes: Full Cluster & Instance Control| ECS_EC2[Amazon ECS on EC2<br><i>Container Instances</i>]

    Lambda --> L_Check{Need static IP or > 15m runtime?}
    L_Check -->|Yes| Fargate
    L_Check -->|No| Lambda
```

### 1.2 EC2 Purchasing Strategy Decision Tree

```mermaid
graph TD
    EC2_Start[EC2 Instance Purchasing] --> Workload{Workload Characteristics?}
    
    Workload -->|Uninterrupted & Predictable | Term{Commitment Duration?}
    Term -->|1 to 3 Years Commitment| SP[Savings Plans / Reserved Instances<br><i>Up to 72% Discount</i>]
    Term -->|No Commitment / Short term / Spike| OD[On-Demand Instances<br><i>Standard Rate</i>]
    
    Workload -->|Fault-Tolerant / Batch / Stateless| Spot[Spot Instances<br><i>Up to 90% Discount</i>]
    
    Workload -->|Strict Compliance / Licensing / BYOL| Host{Dedicated Hardware Required?}
    Host -->|Physical Server Control / BYOL Core Licensing| DH[Dedicated Hosts<br><i>Physical Hardware Access</i>]
    Host -->|Isolated Hardware for Single Tenant| DI[Dedicated Instances<br><i>Isolated Instance Level</i>]
```

### 1.3 Compute Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Event-driven execution under 15 minutes** | **AWS Lambda** | AWS Fargate | Zero server management; scales from 0 to thousands instantly; pay per millisecond. |
| **Containerized web apps without managing servers** | **AWS Fargate (ECS/EKS)** | AWS App Runner | No EC2 provisioning, patch management, or capacity planning required. |
| **Legacy monolithic app needing full root/OS access** | **Amazon EC2** | AWS Elastic Beanstalk | Full control over OS kernel, system drivers, custom network configurations. |
| **Rapid PaaS deployment of web server + DB** | **AWS Elastic Beanstalk** | AWS App Runner | Automatic provisioning, load balancing, auto-scaling, and environment updates. |
| **HPC / Machine Learning requiring GPUs** | **Amazon EC2 (P/G instances)** | AWS Batch | Direct hardware access to NVIDIA GPUs with custom CUDA drivers. |
| **Fault-tolerant batch jobs at minimal cost** | **EC2 Spot Instances** | AWS Batch on Spot | Up to 90% cheaper than On-Demand; handles 2-minute termination notifications. |

### 1.4 "If... Then..." Compute Rules
- **IF** execution time is $\le 15$ minutes and triggered by events (S3, SQS, API Gateway), **THEN** use **AWS Lambda**.
- **IF** workload requires custom Docker containers but zero EC2 server management, **THEN** use **ECS/EKS on AWS Fargate**.
- **IF** workload requires existing Kubernetes manifests (`kubectl`, Helm), **THEN** choose **Amazon EKS**.
- **IF** workload requires BYOL (Bring Your Own License) tied to physical CPU cores, **THEN** choose **EC2 Dedicated Hosts**.

---

## Domain 2: Storage & File Systems

### 2.1 Primary Storage Selection Decision Tree

```mermaid
graph TD
    Storage[Storage Requirement] --> Type{Access Protocol & Structure?}
    
    Type -->|Block Storage for Single EC2| EBS[Amazon EBS<br><i>Elastic Block Store</i>]
    Type -->|Shared File System across Multiple Instances| SharedFile{Operating System Protocol?}
    Type -->|Object Storage via HTTP API / Web| S3[Amazon S3<br><i>Simple Storage Service</i>]
    Type -->|Ultra-Low Latency Volatile Scratch Storage| InstStore[EC2 Instance Store<br><i>Physical NVMe SSD</i>]

    SharedFile -->|Linux Instances NFSv4| EFS[Amazon EFS<br><i>Elastic File System</i>]
    SharedFile -->|Windows Instances SMB/CIFS| FSxW[Amazon FSx for Windows]
    SharedFile -->|High Performance Compute Lustre| FSxL[Amazon FSx for Lustre]
```

### 2.2 S3 Storage Class Lifecycle Decision Tree

```mermaid
graph TD
    S3_Start[S3 Object Storage] --> Access{Access Pattern & Retrieval Speed?}
    
    Access -->|Frequent Access / Unknown Pattern| Dynamic{Access Pattern Predictable?}
    Dynamic -->|Unpredictable / Automatic Savings| IT[S3 Intelligent-Tiering<br><i>Auto tiering, no retrieval fee</i>]
    Dynamic -->|Active Daily Data| Standard[S3 Standard<br><i>High Availability, Multi-AZ</i>]
    Dynamic -->|Single AZ Low Cost Caching| OneZone[S3 Express One Zone<br><i>Single-digit ms latency</i>]

    Access -->|Infrequent Access < 1x/month| MultiAZ{AZ Redundancy Required?}
    MultiAZ -->|Yes: Multi-AZ| SIA[S3 Standard-IA]
    MultiAZ -->|No: Single AZ cheaper| OIA[S3 One Zone-IA]

    Access -->|Archive Data > 90 Days| ArchSpeed{Retrieval Time Allowed?}
    ArchSpeed -->|Instant Milliseconds| GIR[S3 Glacier Instant Retrieval]
    ArchSpeed -->|Minutes to Hours| GFR[S3 Glacier Flexible Retrieval]
    ArchSpeed -->|Hours to 12h Lowest Cost| GDA[S3 Glacier Deep Archive]
```

### 2.3 Storage Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Persistent OS boot volume for EC2** | **Amazon EBS (gp3)** | EBS (io2) | High performance block store attached via network; supports snapshots. |
| **Shared POSIX storage for auto-scaling Linux servers** | **Amazon EFS** | EBS Multi-Attach | Concurrent read/write across 1000s of EC2 instances across multiple AZs. |
| **Ultra-fast temporary temporary storage (Buffer/Cache)** | **EC2 Instance Store** | EBS (io2 Block Express) | Physically attached to server hardware; maximum IOPS, but data lost on instance stop. |
| **Unstructured data storage (Images, Media, Backups)** | **Amazon S3** | Amazon EFS | Virtually infinite capacity, 99.999999999% (11 9's) durability, lifecycle policies. |
| **Long-term compliance archiving (10+ years)** | **S3 Glacier Deep Archive** | S3 Glacier Flexible | Lowest cost storage in AWS ($\sim \$0.00099$/GB/mo); 12-hour bulk retrieval. |
| **High Performance IOPS block storage for mission-critical DB** | **EBS io2 Block Express** | EBS gp3 | Delivers up to 256,000 IOPS and 4,000 MB/s throughput with sub-ms latency. |

### 2.4 "If... Then..." Storage Rules
- **IF** data is block-level and attached to a single EC2 instance, **THEN** use **EBS**.
- **IF** multiple Linux EC2 instances require concurrent read/write access to a shared directory, **THEN** use **EFS**.
- **IF** maximum IOPS is required and data loss on server stop/termination is acceptable, **THEN** use **EC2 Instance Store**.
- **IF** storing objects with unknown access patterns, **THEN** use **S3 Intelligent-Tiering** to avoid manual lifecycle tuning.

---

## Domain 3: Databases & In-Memory Caching

### 3.1 Database Selection Decision Tree

```mermaid
graph TD
    DB_Start[Database Selection] --> Model{Data Model & Schema Structure?}
    
    Model -->|Relational SQL ACID| Rel{Scale & Managed Level?}
    Rel -->|Serverless / High Scale / PostgreSQL & MySQL| Aurora[Amazon Aurora / Aurora Serverless<br><i>5x MySQL / 3x Postgres performance</i>]
    Rel -->|Standard Relational DB MySQL, Postgres, Oracle, MSSQL| RDS[Amazon RDS<br><i>Managed Relational DB</i>]
    
    Model -->|Key-Value / Document NoSQL| Serverless{Request Pattern & Scale?}
    Serverless -->|Unpredictable / Serverless / Single-digit ms| DDB[Amazon DynamoDB<br><i>Serverless NoSQL Key-Value</i>]
    Serverless -->|MongoDB Compatible Document DB| DocDB[Amazon DocumentDB]
    
    Model -->|In-Memory Cache / Sub-millisecond| Cache{In-Memory Engine?}
    Cache -->|Data Structures, Pub/Sub, Persistence| Redis[ElastiCache for Redis / Valkey]
    Cache -->|Simple Key-Value Multithreaded| Memcached[ElastiCache for Memcached]
    Cache -->|In front of DynamoDB| DAX[DynamoDB Accelerator DAX]

    Model -->|Graph / Social Network Data| Nep[Amazon Neptune]
    Model -->|Petabyte Analytics Data Warehouse| Redshift[Amazon Redshift]
```

### 3.2 Database & Caching Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **High-throughput OLTP app requiring MySQL/Postgres compatibility with instant auto-scaling** | **Amazon Aurora Serverless v2** | Amazon RDS | Auto-scales compute capacity in fine-grained increments; 15 read replicas with $<10$ms replication lag. |
| **Fully managed NoSQL for serverless apps with unpredictable traffic** | **Amazon DynamoDB** | Amazon DocumentDB | On-Demand capacity mode; seamless scaling to millions of requests/sec with predictable single-digit ms latency. |
| **Sub-millisecond read caching for complex data structures (sets, sorted sets)** | **ElastiCache for Redis** | ElastiCache for Memcached | Supports rich data types, replication, multi-AZ failover, and persistence snapshots. |
| **Sub-millisecond read cache dedicated for DynamoDB queries** | **DynamoDB Accelerator (DAX)** | ElastiCache for Redis | Seamless inline microsecond cache; requires zero code changes to DynamoDB API calls. |
| **Complex analytical queries on petabytes of structured historical data** | **Amazon Redshift** | Amazon Athena | Columnar storage, massively parallel processing (MPP) data warehouse. |

### 3.3 "If... Then..." Database Rules
- **IF** workload requires relational ACID compliance with minimum operational overhead and auto-scaling, **THEN** use **Amazon Aurora Serverless**.
- **IF** workload requires key-value lookup with guaranteed single-digit millisecond latency at any scale, **THEN** use **DynamoDB**.
- **IF** application requires in-memory caching with multi-AZ failover and pub/sub capabilities, **THEN** choose **ElastiCache for Redis**.
- **IF** analyzing large S3 data lakes using standard SQL without provisioning servers, **THEN** use **Amazon Athena** instead of Redshift.

---

## Domain 4: Networking, Routing & Content Delivery

### 4.1 Load Balancer & Routing Decision Tree

```mermaid
graph TD
    Net_Start[Traffic Entry & Routing] --> Layer{OSI Layer / Routing Type?}
    
    Layer -->|Layer 7: HTTP/HTTPS Web Routing| ALB[Application Load Balancer ALB<br><i>Path/Host routing, WebSockets, WAF</i>]
    Layer -->|Layer 4: TCP / UDP / High Throughput| NLB[Network Load Balancer NLB<br><i>Ultra-low latency, Static IP, Millions RPS</i>]
    Layer -->|Layer 3: Network Appliance Inline Traffic| GWLB[Gateway Load Balancer GWLB<br><i>Firewall / IDS inspection</i>]
    
    Layer -->|DNS Routing & Health Checks| R53{Route 53 Policy?}
    R53 -->|Active-Passive Failover| R53_Fail[Failover Routing Policy]
    R53 -->|Lowest Latency Region| R53_Lat[Latency-Based Routing Policy]
    R53 -->|User Geographic Location| R53_Geo[Geolocation Routing Policy]
    R53 -->|Split Traffic Percentage| R53_Weight[Weighted Routing Policy]

    Layer -->|Global Edge CDN / Static Asset Caching| CF[Amazon CloudFront<br><i>Content Delivery Network</i>]
```

### 4.2 VPC Connectivity Decision Tree

```mermaid
graph TD
    VPC_Start[VPC Connectivity Need] --> Scope{Destination & Connection Type?}
    
    Scope -->|Outbound Internet from Private Subnet| NAT{NAT Architecture?}
    NAT -->|Fully Managed Auto-scaling| NATGW[NAT Gateway<br><i>Managed, High Availability</i>]
    NAT -->|Low Cost / Small Scale| NATInst[NAT Instance<br><i>Self-managed EC2</i>]
    
    Scope -->|Private Connection to AWS Services S3/DynamoDB| VPE{VPC Endpoint Type?}
    VPE -->|S3 & DynamoDB Only Free| GWEP[Gateway Endpoint<br><i>Route Table Entry</i>]
    VPE -->|Other AWS Services / PrivateLink| IFEP[Interface Endpoint<br><i>ENI with Private IP</i>]

    Scope -->|Connect 2 VPCs Directly| Peering[VPC Peering<br><i>Non-transitive private routing</i>]
    Scope -->|Connect 10+ VPCs + On-Premises Hub| TGW[AWS Transit Gateway<br><i>Transitive Hub-and-Spoke</i>]
    
    Scope -->|On-Premises Hybrid Connectivity| Hybrid{Speed & Reliability?}
    Hybrid -->|Encrypted over Public Internet| VPN[AWS Site-to-Site VPN]
    Hybrid -->|Dedicated Private Fiber Line| DX[AWS Direct Connect]
```

### 4.3 Networking Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **HTTP/HTTPS load balancing with URL path-based routing (`/api` vs `/static`)** | **Application Load Balancer (ALB)** | Network Load Balancer | Native Layer 7 features: host/path routing, OIDC auth, HTTP/2, WAF integration. |
| **Extreme high-throughput TCP/UDP traffic requiring static Elastic IPs** | **Network Load Balancer (NLB)** | ALB | Layer 4 traffic handling millions of requests/sec with sub-millisecond latency. |
| **Private S3 access from private subnet without passing over public Internet** | **VPC Gateway Endpoint** | VPC Interface Endpoint | Free to use; attached directly to VPC Route Tables for S3 and DynamoDB. |
| **Hub-and-spoke network routing across dozens of VPCs and AWS accounts** | **AWS Transit Gateway** | VPC Peering | Supports transitive routing; eliminates complex mesh of individual VPC peering connections. |
| **Dedicated 1 Gbps / 10 Gbps private connection from corporate data center to AWS** | **AWS Direct Connect** | AWS Site-to-Site VPN | Consistent network performance, reduced bandwidth costs, bypasses public internet. |

### 4.4 "If... Then..." Networking Rules
- **IF** routing HTTP/HTTPS traffic based on request headers or path, **THEN** use **ALB**.
- **IF** service requires extreme performance, static IP addresses, or non-HTTP TCP/UDP protocols, **THEN** use **NLB**.
- **IF** connecting private subnets to AWS S3/DynamoDB, **THEN** use **Gateway Endpoints** (free, route table based).
- **IF** connecting more than 5-10 VPCs in a transitive topology, **THEN** use **AWS Transit Gateway** instead of VPC Peering.

---

## Domain 5: Messaging, Integration & Event Streaming

### 5.1 Integration & Messaging Decision Tree

```mermaid
graph TD
    Msg_Start[Integration Requirement] --> Pattern{Communication Pattern?}
    
    Pattern -->|Point-to-Point Decoupling Queue| SQS{Ordering & Strictness?}
    SQS -->|Best-effort ordering, max throughput| SQS_Std[SQS Standard Queue]
    SQS -->|Strict FIFO ordering & exact once| SQS_FIFO[SQS FIFO Queue]
    
    Pattern -->|1-to-Many Fan-Out Push Notifications| SNS[Amazon SNS Topic<br><i>Pub/Sub Messaging</i>]
    
    Pattern -->|Real-time Big Data Streaming & Replay| Kin{Streaming Target & Processing?}
    Kin -->|Custom Processing & Multi-day Replay| KDS[Kinesis Data Streams]
    Kin -->|Near Real-time Ingestion to S3/Redshift| KDF[Kinesis Data Firehose]
    
    Pattern -->|Complex Multi-Step Workflow Orchestration| SF[AWS Step Functions<br><i>State Machine Orchestration</i>]
    Pattern -->|Event-driven SaaS & AWS Service Event Bus| EB[Amazon EventBridge<br><i>Event Bus</i>]
```

### 5.2 Messaging & Workflow Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Decouple microservices using a buffer queue** | **Amazon SQS (Standard)** | Amazon SQS FIFO | Unlimited throughput, at-least-once delivery, message retention up to 14 days. |
| **Ensure financial transactions are processed in exact chronological order** | **Amazon SQS (FIFO)** | Kinesis Data Streams | Guarantees First-In-First-Out ordering and exactly-once processing (300 msgs/sec without batching). |
| **Broadcast a single event to SQS, Lambda, and Email simultaneously** | **Amazon SNS (Fan-out pattern)** | Amazon EventBridge | Push-based pub/sub topic that forwards messages to multiple endpoints concurrently. |
| **Real-time clickstream data ingestion with multi-consumer replay window** | **Kinesis Data Streams** | Kinesis Data Firehose | Low-latency stream processing with 1-365 days message replay capabilities. |
| **Continuous load of stream data into S3/Redshift without writing code** | **Kinesis Data Firehose** | Kinesis Data Streams | Fully managed serverless ingestion engine; automatically batches, converts (Parquet), and loads data. |
| **Orchestrate long-running multi-step serverless workflows with error handling** | **AWS Step Functions** | AWS Lambda (custom code) | Visual state machine with built-in retry logic, branch execution, and execution history. |

### 5.3 "If... Then..." Messaging Rules
- **IF** decoupling microservices with point-to-point asynchronous polling, **THEN** use **Amazon SQS**.
- **IF** broadcasting an event to multiple subscribers instantly via push, **THEN** use **Amazon SNS**.
- **IF** ingestion requires real-time data streaming with data replay capability, **THEN** use **Kinesis Data Streams**.
- **IF** orchestrating complex multi-step workflows with branch logic and retries, **THEN** use **AWS Step Functions**.

---

## Domain 6: Security, Encryption & Identity

### 6.1 Authentication & Secrets Decision Tree

```mermaid
graph TD
    Sec_Start[Security & Identity Need] --> Category{Requirement Category?}
    
    Category -->|User Authentication & Directory| Cog{Target User Base?}
    Cog -->|Customer Web/Mobile App Users| CUP[Cognito User Pools<br><i>User Directory, Sign-up, JWT</i>]
    Cog -->|Exchange OAuth for AWS Temporary Credentials| CIP[Cognito Identity Pools<br><i>Federated Identity Credentials</i>]
    
    Category -->|Secrets & Parameter Storage| SecStore{Needs Auto-Rotation & Cross-Account?}
    SecStore -->|Yes: DB Passwords, OAuth Keys| SecMgr[AWS Secrets Manager<br><i>Supports KMS & Auto-Rotation</i>]
    SecStore -->|No: Standard Configuration Parameters| SSM[SSM Parameter Store<br><i>Hierarchical, Free Standard Tier</i>]

    Category -->|Encryption Key Management| KMS{Key Owner & Multi-Region?}
    KMS -->|AWS Managed / Customer Managed KMS| KMS_Key[AWS KMS<br><i>Envelope Encryption</i>]
    KMS -->|Dedicated Hardware Security Module| HSM[AWS CloudHSM<br><i>FIPS 140-2 Level 3</i>]
```

### 6.2 Security & Encryption Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Customer sign-up, sign-in, MFA, and JWT token issuance for web app** | **Cognito User Pools (CUP)** | IAM Identity Center | Managed user directory supporting OAuth 2.0, SAML, and social identity providers (Google/FB). |
| **Grant temporary AWS IAM permissions to anonymous/federated app users** | **Cognito Identity Pools** | AWS STS AssumeRole | Exchanges CUP or third-party JWTs for short-lived temporary AWS credentials. |
| **Store database credentials requiring automatic 30-day password rotation** | **AWS Secrets Manager** | SSM Parameter Store | Native integration with AWS Lambda to automatically rotate RDS/Aurora passwords. |
| **Store application configuration strings and license keys at zero cost** | **SSM Parameter Store** | AWS Secrets Manager | Free standard tier; hierarchical parameter tree (`/config/dev/db_url`); KMS encryption support. |
| **Envelope encryption for S3 objects and EBS volumes** | **AWS KMS** | AWS CloudHSM | Fully integrated managed encryption service utilizing KMS Keys and Data Keys. |

### 6.3 "If... Then..." Security Rules
- **IF** managing user registration, logins, and MFA for a customer-facing app, **THEN** use **Cognito User Pools**.
- **IF** storing sensitive database credentials that require automatic rotation, **THEN** use **AWS Secrets Manager**.
- **IF** storing standard application parameters without auto-rotation requirements, **THEN** use **SSM Parameter Store**.
- **IF** compliance requires dedicated single-tenant FIPS 140-2 Level 3 hardware security modules, **THEN** use **AWS CloudHSM** instead of KMS.

---

## Domain 7: Monitoring, Auditing & Observability

### 7.1 Monitoring & Observability Decision Tree

```mermaid
graph TD
    Obs_Start[Observability Goal] --> Goal{Primary Data Type & Objective?}
    
    Goal -->|Performance Metrics, Logs & Alarms| CW{CloudWatch Component?}
    CW -->|Infrastructure & App Metrics| CWM[CloudWatch Metrics]
    CW -->|Centralized Application Logs| CWL[CloudWatch Logs]
    CW -->|Threshold Notifications / Auto-scaling| CWA[CloudWatch Alarms]
    
    Goal -->|Distributed Tracing & Latency Bottlenecks| XRay[AWS X-Ray<br><i>Trace Requests across Microservices</i>]
    
    Goal -->|AWS Account API Audit & User Governance| CT{Audit Objective?}
    CT -->|Track API calls, management & data events| CT_Trail[AWS CloudTrail<br><i>Who did what and when</i>]
    CT -->|Detect anomalous API activity| CT_Ins[CloudTrail Insights]
```

### 7.2 Observability Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Monitor EC2 CPU utilization and trigger Auto Scaling** | **CloudWatch Metrics & Alarms** | EventBridge | Real-time metric collection and alarm threshold evaluation every 1 to 60 seconds. |
| **Troubleshoot latency spikes across a microservice chain (API Gateway $\rightarrow$ Lambda $\rightarrow$ DynamoDB)** | **AWS X-Ray** | CloudWatch ServiceLens | Generates visual end-to-end trace maps showing precise timing for each subsegment call. |
| **Investigate who deleted an S3 bucket or modified a Security Group rule** | **AWS CloudTrail** | CloudWatch Logs | Immutable log audit record of every API call made in the AWS account by user/role/IP. |
| **Detect unexpected API call spikes or unusual security configurations** | **CloudTrail Insights** | CloudWatch Anomaly Detection | Machine learning baseline analysis of CloudTrail management events to surface anomalies. |

### 7.3 "If... Then..." Observability Rules
- **IF** collecting performance metrics, logs, or setting up operational alerts, **THEN** use **AWS CloudWatch**.
- **IF** debugging distributed request paths and pinpointing latency bottlenecks across microservices, **THEN** use **AWS X-Ray**.
- **IF** performing security audits to verify who executed a specific AWS API call, **THEN** use **AWS CloudTrail**.

---

## Domain 8: DevOps, Infrastructure as Code & CI/CD

### 8.1 IaC & Deployment Strategy Decision Tree

```mermaid
graph TD
    Dev_Start[DevOps & IaC Goal] --> Tool{Task Type?}
    
    Tool -->|Infrastructure as Code IaC| IaCType{Language & Framework?}
    IaCType -->|Declarative JSON/YAML Templates| CFN[AWS CloudFormation]
    IaCType -->|Imperative TypeScript/Python/Java Code| CDK[AWS CDK<br><i>Cloud Development Kit</i>]
    IaCType -->|Serverless App Focus SAM| SAM[AWS SAM<br><i>Serverless Application Model</i>]
    
    Tool -->|CI/CD Automation Pipeline| CodeSuite{Pipeline Phase?}
    CodeSuite -->|Source Control Git| CC[AWS CodeCommit]
    CodeSuite -->|Build & Test Engine| CB[AWS CodeBuild]
    CodeSuite -->|Deployment Orchestration| CD[AWS CodeDeploy]
    CodeSuite -->|Workflow Pipeline Automation| CP[AWS CodePipeline]
```

### 8.2 CodeDeploy Deployment Strategies Decision Matrix

| Deployment Strategy | Downtime | Rollback Speed | EC2 Capacity Required | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **All-at-Once** | **Yes** | Slow | 100% | Fast deployment in non-production / dev environments. |
| **In-Place (Rolling)** | **No** | Medium | 100% | Production deployments without creating new instance capacity. |
| **Blue / Green** | **Zero** | **Instant (DNS/ELB Swap)** | **200% (Double)** | Mission-critical production applications requiring zero downtime. |
| **Canary** | **Zero** | Instant | 100% - 200% | Testing new releases against a small percentage ($5\%-10\%$) of real traffic. |

### 8.3 "If... Then..." DevOps Rules
- **IF** defining infrastructure using standard programming languages (TypeScript, Python), **THEN** use **AWS CDK**.
- **IF** deploying serverless applications (Lambda + API Gateway + DynamoDB), **THEN** use **AWS SAM**.
- **IF** deployment requires zero downtime and instant rollback capability, **THEN** choose **Blue/Green Deployment** via CodeDeploy.

---

## Domain 9: API Management & Edge Computing

### 9.1 API Gateway & Edge Compute Decision Tree

```mermaid
graph TD
    API_Start[API & Edge Request] --> Type{Traffic Type & Edge Logic?}
    
    Type -->|RESTful APIs / HTTP Endpoints| Gateway{API Feature Requirements?}
    Gateway -->|Cost-Optimized / Low Latency HTTP| HTTPAPI[API Gateway HTTP API<br><i>Up to 71% cheaper, faster</i>]
    Gateway -->|Advanced: Usage Plans, API Keys, WAF| RESTAPI[API Gateway REST API<br><i>Full feature set</i>]
    Gateway -->|Real-Time Stateful Bi-Directional| WSAPI[API Gateway WebSocket API]

    Type -->|Edge Compute Execution| EdgeType{Execution Complexity & Memory?}
    EdgeType -->|Lightweight Header Rewrites / Redirects| CFF[CloudFront Functions<br><i>JavaScript, sub-ms runtime</i>]
    EdgeType -->|Full Execution / External Network Calls| L_Edge[Lambda@Edge<br><i>Node.js/Python, up to 10s execution</i>]
```

### 9.2 "If... Then..." API Rules
- **IF** creating standard HTTP APIs without complex API management features, **THEN** choose **HTTP API** for maximum performance and $70\%$ lower cost.
- **IF** requirement demands API keys, usage plans, request validation, or direct AWS service integrations, **THEN** use **REST API**.
- **IF** executing simple header manipulation or URL rewrites at Edge locations in $< 1$ millisecond, **THEN** use **CloudFront Functions** instead of Lambda@Edge.

---

## Domain 10: Big Data, Analytics & Specialized Services

### 10.1 Analytics & Big Data Decision Tree

```mermaid
graph TD
    Data_Start[Analytics Request] --> QueryType{Data Engine & Query Type?}
    
    QueryType -->|Serverless SQL Queries directly on S3 Data Lake| Athena[Amazon Athena<br><i>Pay per TB scanned</i>]
    QueryType -->|Enterprise Data Warehouse MPP SQL| Redshift[Amazon Redshift<br><i>Petabyte Scale OLAP</i>]
    QueryType -->|Big Data Processing Hadoop/Spark/Hive| EMR[Amazon EMR<br><i>Elastic MapReduce</i>]
    QueryType -->|ETL Jobs & Data Cataloging| Glue[AWS Glue<br><i>Serverless Spark ETL</i>]
    QueryType -->|Search & Log Analytics Engine| OpenSearch[Amazon OpenSearch Service]
    QueryType -->|Asynchronous Email Sending| SES[Amazon SES<br><i>Simple Email Service</i>]
```

### 10.2 Analytics Decision Matrix

| Requirement / Scenario | Primary Service | Alternative Service | Key Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Ad-hoc SQL queries on JSON/Parquet files stored in Amazon S3** | **Amazon Athena** | Amazon Redshift | Serverless engine; no database to provision; pay only per TB scanned. |
| **Automated ETL pipeline to clean and catalog raw S3 data** | **AWS Glue** | Amazon EMR | Serverless Spark execution environment with built-in Glue Data Catalog. |
| **Complex full-text search engine with visualization dashboards** | **Amazon OpenSearch** | CloudWatch Logs Insights | Native Elasticsearch alternative for indexing and querying unstructured text data. |
| **Transactional transactional email sending at scale** | **Amazon SES** | Amazon SNS | Built specifically for inbound/outbound transactional and marketing emails. |

---

## 📌 Summary Architecture Cheat Sheet

| Business / Tech Goal | Selected AWS Service | Primary Reason |
| :--- | :--- | :--- |
| **Event-driven microservice execution** | **AWS Lambda** | Zero server administration, auto-scaling execution under 15m. |
| **Microsecond read performance for DB** | **ElastiCache (Redis)** | In-memory key-value cache engine. |
| **Global CDN for web apps with DDoS protection** | **CloudFront + AWS Shield** | Edge location caching and origin shielding. |
| **Decouple microservices asynchronously** | **Amazon SQS** | High-throughput distributed message queue. |
| **Audit user actions for security compliance** | **AWS CloudTrail** | Immutable API logging across the AWS account. |
| **Automated password rotation for databases** | **AWS Secrets Manager** | Native Lambda integration for seamless secret rotation. |
