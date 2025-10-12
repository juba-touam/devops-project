output "rds_primary_endpoint" {
  value = aws_db_instance.primary.address
}


output "rds_reader_endpoints" {
  value = [for r in aws_db_instance.replica : r.address]
}