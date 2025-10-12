output "redis_endpoint" {
  value = aws_elasticache_cluster.redis.cache_nodes[0].address
}

variable "aws_region" {
  default = "eu-north-1"
}