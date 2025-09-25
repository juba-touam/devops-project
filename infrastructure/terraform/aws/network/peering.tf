resource "aws_vpc_peering_connection" "peer_a_b" {
  vpc_id      = module.vpc_a.vpc_id
  peer_vpc_id = module.vpc_b.vpc_id
  auto_accept = true

  tags = {
    Name = "vpc-a-to-vpc-b"
  }
}
