terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket  = "devops-tf-backend-jb"
    key     = "landing-zone/data/terraform.tfstate"
    region  = "eu-north-1"
    encrypt = true
  }
}


provider "aws" {
  region = var.aws_region
}

data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "devops-tf-backend-jb"
    key    = "landing-zone/terraform.tfstate"
    region = "eu-north-1"
  }
}
