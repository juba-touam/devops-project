resource "aws_elasticache_subnet_group" "redis" {
  name       = "app-redis-subnets"
  subnet_ids = data.terraform_remote_state.network.outputs.vpc_b_private_subnets
}

resource "aws_security_group" "redis_sg" {
  name = "redis_sg"
  vpc_id = data.terraform_remote_state.network.outputs.vpc_b_id

  ingress {
    from_port = 6379
    to_port = 6379
    protocol = "tcp"
    security_groups = [data.terraform_remote_state.network.outputs.app_sg_id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id = "app-redis"
  engine = "redis"
  engine_version = "7.0"
  node_type = "cache.t4g.micro"
  num_cache_nodes = 1
  port = 6379

  subnet_group_name = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis_sg.id]


  snapshot_retention_limit = 7
  apply_immediately = true

  tags = {
    Environement ="dev"
    Owner= "jubat"
  }
}