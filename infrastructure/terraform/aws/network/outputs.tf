# VPC A
output "vpc_a_id" {
  description = "ID du VPC A"
  value       = module.vpc_a.vpc_id
}

output "vpc_a_public_subnets" {
  description = "Subnets publics du VPC A"
  value       = module.vpc_a.public_subnets
}

output "vpc_a_private_subnets" {
  description = "Subnets privés du VPC A"
  value       = module.vpc_a.private_subnets
}

# VPC B
output "vpc_b_id" {
  description = "ID du VPC B"
  value       = module.vpc_b.vpc_id
}

output "vpc_b_private_subnets" {
  description = "Subnets privés du VPC B"
  value       = module.vpc_b.private_subnets
}

# VPC Peering

output "vpc_peering_connection_id" {
  description = "ID de la connexion de peering entre VPC-A et VPC-B"
  value       = aws_vpc_peering_connection.peer_a_b.id
}


# Groupes de sécurité
output "web_sg_id" {
  description = "Security group ID pour la couche Web"
  value       = aws_security_group.web_sg.id
}

output "app_sg_id" {
  description = "Security group ID pour la couche App"
  value       = aws_security_group.app_sg.id
}

output "db_sg_id" {
  description = "Security group ID pour la couche DB"
  value       = aws_security_group.db_sg.id
}
