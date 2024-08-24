export interface ContactDto {
  id: string
  workhour_start: string | Date
  workhour_end: string | Date
  workdays: string
  phone_number: string
  email: string
  address_line_1: string
  address_line_2: string
  map_coordinates: string
  map_directions_url: string
}

export interface CompanyDto {
  id: string
  name: string
  contact_id: string
  contact: ContactDto
}

export interface TeamMemberDto {
  id: string
  client_route_id: string,
  job_position: string
  job_prefix: string
  firstname: string
  lastname: string
  image_uri: string
  about_short: string
  company_id: string
  company: CompanyDto
  contact_id: string
  contact: ContactDto
  birthdate: Date
}
