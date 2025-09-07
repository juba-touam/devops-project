#subnet utilisé
resource "aws_db_subnet_group" "rds" {
  name       = "app-rds-subnets"
  subnet_ids = module.vpc_a.private_subnets
}

#secret manager
data "aws_secretsmanager_secret" "rds_master" {
  name = "rds-master-password1"
}

data "aws_secretsmanager_secret_version" "rds_master" {
  secret_id = data.aws_secretsmanager_secret.rds_master.id
}

locals {
  rds_master_password = jsondecode(data.aws_secretsmanager_secret_version.rds_master.secret_string)["password"]
}
#Primary RDS
resource "aws_db_instance" "primary" {
  identifier        = "app-pg"
  engine            = "postgres"
  instance_class    = "db.t4g.micro"
  allocated_storage = 20
  skip_final_snapshot = true
  username                    = "postgres"

  password = local.rds_master_password

  multi_az               = true
  publicly_accessible    = false
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  backup_retention_period = 7
}

#Read replicas
resource "aws_db_instance" "replica" {
  count               = var.replica_count
  identifier          = "app-pg-replica-${count.index}"
  replicate_source_db = aws_db_instance.primary.arn # <= ARN requis
  instance_class      = "db.t4g.medium"

  publicly_accessible = false
  multi_az            = false
  skip_final_snapshot = true

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}


resource "aws_db_snapshot" "pre_deploy" {
  db_instance_identifier = aws_db_instance.primary.identifier
  db_snapshot_identifier = "app-predeploy"
  depends_on = [aws_db_instance.primary]
  tags                   = { Purpose = "pre-deploy" }
}