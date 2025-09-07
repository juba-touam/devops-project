variable "aws_region" {
  default = "eu-north-1"
}

variable "vpc_a_cidr" {
  default = "10.0.0.0/16"
}

variable "vpc_b_cidr" {
  default = "10.1.0.0/16"
}

variable "azs" {
  default = ["eu-north-1a", "eu-north-1b", "eu-north-1c"]
}

variable "replica_count" {
  type    = number
  default = 1

}