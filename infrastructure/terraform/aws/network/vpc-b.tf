module "vpc_b" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.1"

  name            = "vpc_b"
  cidr            = var.vpc_b_cidr
  azs             = var.azs
  private_subnets = ["10.1.101.0/24", "10.1.102.0/24"]

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment = "dev"
    Owner       = "jubat"
  }
}