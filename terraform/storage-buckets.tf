resource "google_storage_bucket" "fn_source_bucket" {
  name                        = var.project_name
  location                    = var.default_region
  uniform_bucket_level_access = true
  force_destroy = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 2
    }
  }
}