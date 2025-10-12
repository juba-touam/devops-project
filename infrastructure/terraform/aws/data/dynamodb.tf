resource "aws_dynamodb_table" "dynamodb" {
  name = "Dynamo_table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "User_Id"

  attribute {
    name = "User_Id"
    type = "S"
  }
  attribute {
    name = "Created_at"
    type = "S"
  }
  global_secondary_index {
    hash_key        = "Created_at"
    name            = "Index"
    projection_type = "ALL"
  }
  point_in_time_recovery {
    enabled = true
  }
  tags = {
    Environement = "dev"
    Owner ="jubat"
  }
}
