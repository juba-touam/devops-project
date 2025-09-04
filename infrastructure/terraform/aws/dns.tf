resource "aws_route53_zone" "internal" {
  name = "internal.jubat.local"
  comment = "Zone DNS privée pour les services internes"

  vpc {
    vpc_id = module.vpc_a.vpc_id
  }

  tags = {
    Environment = "dev"
    Owner       = "jubat"
  }
}

resource "aws_route53_zone_association" "vpc_b" {
  zone_id = aws_route53_zone.internal.zone_id
  vpc_id  = module.vpc_b.vpc_id
}