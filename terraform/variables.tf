variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "project" {
  description = "Project name prefix"
  default     = "bakery"
}

variable "domain_name" {
  description = "Root domain name"
  default     = "sonali24.online"
}

variable "db_username" {
  description = "RDS master username"
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "RDS master password"
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  default     = "bakery"
}

variable "frontend_image" {
  description = "Frontend ECR image URI"
}

variable "backend_image" {
  description = "Backend ECR image URI"
}
