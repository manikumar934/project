# 🏪 Sri Lakshmi Rama Sweets and Bakery

A beginner-friendly, production-style 3-tier bakery web application deployed on AWS using ECS Fargate, RDS MySQL, ALB, Route 53, and GitHub Actions CI/CD.

**Live URL:** https://sonali24.online  
**Established:** 1993 | **Contact:** 8522933933

---

## 🏗️ Architecture Overview

```
Internet
   │
   ▼
Route 53 (sonali24.online)
   │
   ▼
Application Load Balancer (HTTPS 443)
   │
   ├── /* ──────────────► Frontend ECS Fargate (React + Nginx) [Private Subnet]
   │
   └── /api/* ──────────► Backend ECS Fargate (Node.js) [Private Subnet]
                                    │
                                    ▼
                          Amazon RDS MySQL [Private Subnet]
```

**Key Points:**
- Frontend and Backend run as separate ECS Fargate tasks in **private subnets**
- Only the ALB is public-facing
- Backend is never directly exposed to the internet
- ALB routes `/api/*` to backend, everything else to frontend
- HTTPS enforced via ACM certificate

---

## 📁 Project Structure

```
project/
├── terraform/          # All AWS infrastructure as code
│   ├── backend.tf      # S3 remote state + DynamoDB locking
│   ├── provider.tf     # AWS provider config
│   ├── variables.tf    # Input variables
│   ├── outputs.tf      # Output values
│   ├── main.tf         # ECR repositories
│   ├── vpc.tf          # VPC, subnets, IGW, NAT, route tables
│   ├── security.tf     # Security groups
│   ├── alb.tf          # Application Load Balancer
│   ├── ecs.tf          # ECS cluster, task definitions, services
│   ├── rds.tf          # RDS MySQL instance
│   ├── route53.tf      # DNS records
│   ├── acm.tf          # SSL certificate
│   └── iam.tf          # IAM roles (ECS + GitHub OIDC)
│
├── frontend/           # React.js application
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── App.js
│       ├── CartContext.js
│       ├── components/
│       │   ├── Navbar.js
│       │   └── ProductCard.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Menu.js
│       │   ├── Cart.js
│       │   ├── OrderSummary.js
│       │   └── Signup.js
│       └── data/
│           └── products.js
│
├── backend/            # Node.js + Express API
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js       # App entry + DB init + seeding
│   ├── db.js           # MySQL connection pool
│   └── routes/
│       ├── users.js
│       ├── categories.js
│       ├── products.js
│       └── orders.js
│
├── .github/
│   └── workflows/
│       ├── terraform.yml   # Terraform plan/apply
│       └── deploy.yml      # Docker build + ECS deploy
│
└── README.md
```

---

## 🗄️ Database Schema

```sql
users        → id, name, phone (unique), address, created_at
categories   → id, name, slug
products     → id, category_id, name, price, image_url
orders       → id, user_id, total, status, created_at
order_items  → id, order_id, product_id, quantity, price
```

---

## 🔌 API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /health               | Health check          |
| POST   | /api/users/signup     | Register a customer   |
| GET    | /api/categories       | List all categories   |
| GET    | /api/products         | List all products     |
| GET    | /api/products?category=sweets | Filter by category |
| POST   | /api/orders           | Place an order        |
| GET    | /api/orders/:userId   | Get user order history|

### Example Responses

**POST /api/users/signup**
```json
// Request
{ "name": "Ravi Kumar", "phone": "9876543210", "address": "123 MG Road, Hyderabad" }
// Response
{ "message": "Signup successful", "userId": 1 }
```

**GET /api/products?category=sweets**
```json
[
  { "id": 1, "name": "Kaju Katli", "price": "120.00", "category_name": "Sweets" },
  { "id": 2, "name": "Gulab Jamun", "price": "60.00", "category_name": "Sweets" }
]
```

**POST /api/orders**
```json
// Request
{ "userId": 1, "items": [{ "productId": 1, "quantity": 2, "price": 120 }] }
// Response
{ "message": "Order placed", "orderId": 1, "total": 240 }
```

---

## 🚀 Step-by-Step Deployment Guide

### Prerequisites
- AWS Account with admin access
- AWS CLI installed and configured
- Terraform >= 1.5.0
- Docker Desktop
- Node.js 18+
- GitHub account

---

### Step 1: Bootstrap Terraform Remote State

Run these commands **once** before using Terraform:

```bash
# Create S3 bucket for state
aws s3 mb s3://bakery-terraform-state-sonali24 --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket bakery-terraform-state-sonali24 \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name bakery-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

### Step 2: Configure Terraform Variables

Create `terraform/terraform.tfvars`:

```hcl
aws_region     = "us-east-1"
project        = "bakery"
domain_name    = "sonali24.online"
db_username    = "admin"
db_password    = "YourStrongPassword123!"
db_name        = "bakery"
frontend_image = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/bakery-frontend:latest"
backend_image  = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/bakery-backend:latest"
```

> ⚠️ Never commit `terraform.tfvars` to Git. Add it to `.gitignore`.

---

### Step 3: Deploy Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply
```

After apply, note the outputs:
```bash
terraform output alb_dns_name
terraform output frontend_ecr_url
terraform output backend_ecr_url
```

---

### Step 4: Update Domain Nameservers

After Route 53 hosted zone is created, get the nameservers:

```bash
aws route53 list-hosted-zones-by-name --dns-name sonali24.online
```

Go to your domain registrar (where you bought sonali24.online) and update the nameservers to the 4 NS records shown in Route 53.

> ⏳ DNS propagation takes 10–48 hours.

---

### Step 5: Build and Push Docker Images

```bash
# Get your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1

# Login to ECR
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push frontend
cd frontend
docker build -t bakery-frontend .
docker tag bakery-frontend:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/bakery-frontend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/bakery-frontend:latest

# Build and push backend
cd ../backend
docker build -t bakery-backend .
docker tag bakery-backend:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/bakery-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/bakery-backend:latest
```

---

### Step 6: Force ECS Redeployment

```bash
aws ecs update-service --cluster bakery-cluster --service bakery-frontend --force-new-deployment --region us-east-1
aws ecs update-service --cluster bakery-cluster --service bakery-backend --force-new-deployment --region us-east-1
```

---

### Step 7: Set Up GitHub Actions OIDC

1. Push your code to GitHub
2. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
3. Add these secrets:

| Secret Name      | Value                          |
|------------------|--------------------------------|
| `AWS_ACCOUNT_ID` | Your 12-digit AWS account ID   |
| `DB_PASSWORD`    | Your RDS database password     |

4. Update `terraform/iam.tf` — replace `YOUR_GITHUB_ORG/YOUR_REPO` with your actual GitHub username/repo name, then re-run `terraform apply`.

---

### Step 8: Run GitHub Actions

Push any change to `main` branch:
- Changes in `terraform/` → triggers `terraform.yml`
- Changes in `frontend/` or `backend/` → triggers `deploy.yml`

---

## 💻 Local Development

### Run Backend Locally

```bash
cd backend
cp .env.example .env
# Edit .env with your local MySQL credentials
npm install
npm run dev
# API available at http://localhost:5000
```

### Run Frontend Locally

```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm install
npm start
# App available at http://localhost:3000
```

### Run with Docker Compose (optional)

```bash
# Create docker-compose.yml at project root for local testing
docker-compose up --build
```

---

## 🖥️ UI Structure

```
Home Page
├── Hero Banner (Bakery name, Est. 1993, Phone, CTA button)
├── Categories Section (5 category cards with icons)
├── Products Section (tabbed by category, 5 items each with emoji, name, price, Add to Cart)
└── Signup Form (Name, Phone, Address)

Menu Page
└── All products with category filter tabs

Cart Page
├── Cart items (emoji, name, qty controls, subtotal)
└── Total + Proceed to Order button

Order Summary Page
├── Delivery address display
├── Order items list
└── Confirm & Place Order button

Signup Page
└── Standalone signup form
```

---

## 🔒 Security Design

| Layer | Protection |
|-------|-----------|
| ALB | HTTPS only, HTTP redirects to HTTPS |
| Frontend SG | Only accepts traffic from ALB |
| Backend SG | Only accepts traffic from Frontend SG |
| RDS SG | Only accepts MySQL from Backend SG |
| ECS Tasks | Run in private subnets, no public IPs |
| GitHub CI/CD | OIDC (no long-lived AWS keys in secrets) |
| ACM | TLS 1.3 certificate for sonali24.online |

---

## 💰 Estimated Monthly Cost (us-east-1)

| Service | Spec | ~Cost |
|---------|------|-------|
| ECS Fargate (2 tasks) | 0.25 vCPU, 0.5 GB each | ~$8 |
| RDS MySQL | db.t3.micro, 20 GB | ~$15 |
| ALB | 1 instance | ~$18 |
| NAT Gateway | 1 instance | ~$35 |
| Route 53 | 1 hosted zone | ~$0.50 |
| **Total** | | **~$77/month** |

> 💡 To reduce cost during learning: stop RDS and scale ECS to 0 when not in use.

---

## 🧹 Cleanup

To destroy all AWS resources:

```bash
cd terraform
terraform destroy
```

Then delete the S3 bucket and DynamoDB table manually:

```bash
aws s3 rb s3://bakery-terraform-state-sonali24 --force
aws dynamodb delete-table --table-name bakery-terraform-locks --region us-east-1
```
