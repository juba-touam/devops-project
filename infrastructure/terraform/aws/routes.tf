resource "aws_route" "a_to_b" {
  route_table_id              = module.vpc_a.private_route_table_ids[0]
  destination_cidr_block      = "10.1.0.0/16"
  vpc_peering_connection_id   = aws_vpc_peering_connection.peer_a_b.id
}

resource "aws_route" "b_to_a" {
  route_table_id              = module.vpc_b.private_route_table_ids[0]
  destination_cidr_block      = "10.0.0.0/16"
  vpc_peering_connection_id   = aws_vpc_peering_connection.peer_a_b.id
}