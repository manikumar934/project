terraform {
  backend "s3" {
    bucket         = "bakery-terraform-state-sonali24"
    key            = "bakery/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "bakery-terraform-locks"
    encrypt        = true
  }
}
