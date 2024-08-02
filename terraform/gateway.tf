locals {
  gw_spec = base64encode(<<-EOF
      swagger: "2.0"
      info:
        title: Altu GW
        description: API description in Markdown.
        version: 1.0.0
      schemes:
        - https
      paths:
        /contact-send-message:
          post:
            summary: Sends email.
            description: Sends email using configured provider.
            operationId: contactSendMessage
            x-google-backend:
              address: "${google_cloudfunctions_function.contact_send_message.https_trigger_url}"
            security:
              - api_key_in_header: []
            consumes:
              - application/json
            produces:
              - application/json
            parameters:
              - in: body
                name: message
                required: true
                schema:
                  $ref: '#/definitions/Message'
            responses:
              200:
                description: OK
              400:
                description: Bad request. Check body.
              401:
                description: Unauthorized. Check messaging service token validity.
              403:
                description: Forbidden. Check error message.
      securityDefinitions:
        api_key_in_header:
          type: "apiKey"
          name: "x-api-key"
          in: "header"
      definitions:
        Sender:
          properties:
            name:
              type: string
            email:
              type: string
            phoneNumber:
              type: string
        Message:
          properties:
            receiverId:
              type: string
            sender:
              $ref: '#/definitions/Sender'
      EOF
  )
}

resource "google_api_gateway_api" "api" {
  provider = google-beta
  project  = var.project_name
  api_id   = "altu-gw-api"
}

resource "google_api_gateway_api_config" "api_cfg" {
  provider      = google-beta
  project       = var.project_name
  api           = google_api_gateway_api.api.api_id
  api_config_id = "altu-gw-config-${sha1(local.gw_spec)}"

  openapi_documents {
    document {
      path     = "spec.yml" # an arbitrary name
      contents = local.gw_spec
    }
  }

  gateway_config {
    backend_config {
      google_service_account = google_service_account.gw_service_account.email
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "api_gw" {
  provider   = google-beta
  project    = var.project_name
  region     = var.gw_default_region
  gateway_id = "altu-gw"
  api_config = google_api_gateway_api_config.api_cfg.id
}

output "gw_url" {
  value = google_api_gateway_gateway.api_gw.default_hostname
}
