module "vpc_a" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.1"

  name            = "vpc_a"
  cidr            = var.vpc_a_cidr
  azs             = var.azs
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false # 1 seul par AZ
  enable_dns_hostnames = true  #autorise les instances avec IP publiques à avoir un nom dns public
  enable_dns_support   = true  #active le service DNS interne Amazon

  tags = {
    Environment = "dev"
    Owner       = "jubat"
  }
}