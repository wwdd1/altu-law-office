locals {
  contact_send_message = {
    name       = "${var.serverless_fn_defaults.name_prefix}-contact-send-message"
    desciption = "Contact send message"
    source_dir = "../serverless/ContactSendMessage"
  }
}

locals {
  role_cloud_run_invoker     = "roles/cloudfunctions.invoker"
  role_secret_manager_access = "roles/secretmanager.secretAccessor"
}

# Function: ContactSendMessage

# Zip the source
data "archive_file" "contact_send_message_source" {
  type        = "zip"
  source_dir  = local.contact_send_message.source_dir
  output_path = "${path.module}/${local.contact_send_message.name}.zip"
  excludes    = ["node_modules"]
}

# Upload the source
resource "google_storage_bucket_object" "contact_send_message_source" {
  name   = "${local.contact_send_message.name}-${data.archive_file.contact_send_message_source.output_base64sha256}.zip"
  bucket = google_storage_bucket.fn_source_bucket.name
  source = data.archive_file.contact_send_message_source.output_path
}

resource "google_secret_manager_secret_iam_member" "accessor_mail_svc_secret_vars" {
  for_each = tomap({
    "MAIL_SERVICE_CLIENT_ID" : var.MAIL_SERVICE_CLIENT_ID,
    "MAIL_SERVICE_CLIENT_SECRET" : var.MAIL_SERVICE_CLIENT_SECRET,
    "MAIL_SERVICE_ACCESS_TOKEN" : var.MAIL_SERVICE_ACCESS_TOKEN
    "MAIL_SERVICE_REFRESH_TOKEN" : var.MAIL_SERVICE_REFRESH_TOKEN,
  })
  project   = var.project_name
  secret_id = each.value
  role      = local.role_secret_manager_access
  member    = "serviceAccount:${google_service_account.fn_service_account.email}"
}

# Create/update the function
resource "google_cloudfunctions_function" "contact_send_message" {
  depends_on = [ google_secret_manager_secret_iam_member.accessor_mail_svc_secret_vars ]
  name        = local.contact_send_message.name
  description = local.contact_send_message.desciption
  runtime     = var.serverless_fn_defaults.runtime

  region  = var.default_region
  project = var.project_name

  available_memory_mb          = 512
  source_archive_bucket        = google_storage_bucket.fn_source_bucket.name
  source_archive_object        = "${local.contact_send_message.name}-${data.archive_file.contact_send_message_source.output_base64sha256}.zip"
  trigger_http                 = true
  https_trigger_security_level = "SECURE_ALWAYS"
  timeout                      = var.serverless_fn_defaults.timeout
  entry_point                  = var.serverless_fn_defaults.entry_point
  service_account_email        = google_service_account.fn_service_account.email

  environment_variables = {
    "MAIL_SERVICE_HOST"             = var.MAIL_SERVICE_HOST
    "MAIL_SERVICE_PORT"             = var.MAIL_SERVICE_PORT
    "MAIL_SERVICE_SENDER_ADDRESS"   = var.MAIL_SERVICE_SENDER_ADDRESS
    "MAIL_SERVICE_RECEIVER_ADDRESS" = var.MAIL_SERVICE_RECEIVER_ADDRESS
    "MAIL_SERVICE_TOKEN_EXPIRY"     = var.MAIL_SERVICE_TOKEN_EXPIRY
    "PROJECT"                       = var.project_name
  }

  secret_environment_variables {
    key     = "MAIL_SERVICE_CLIENT_ID"
    secret  = var.MAIL_SERVICE_CLIENT_ID
    version = "latest"
  }

  secret_environment_variables {
    key     = "MAIL_SERVICE_CLIENT_SECRET"
    secret  = var.MAIL_SERVICE_CLIENT_SECRET
    version = "latest"
  }

  secret_environment_variables {
    key     = "MAIL_SERVICE_ACCESS_TOKEN"
    secret  = var.MAIL_SERVICE_ACCESS_TOKEN
    version = "latest"
  }

  secret_environment_variables {
    key     = "MAIL_SERVICE_REFRESH_TOKEN"
    secret  = var.MAIL_SERVICE_REFRESH_TOKEN
    version = "latest"
  }
}

# Gateway authorization
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.contact_send_message.project
  region         = google_cloudfunctions_function.contact_send_message.region
  cloud_function = google_cloudfunctions_function.contact_send_message.name

  role   = local.role_cloud_run_invoker
  member = "serviceAccount:${google_service_account.gw_service_account.email}"
}
