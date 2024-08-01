import { NextRequest, NextResponse } from "next/server"
import { ContactDto } from "@/lib/dtos"
import db from "../../../db.json" assert { type: 'json' }

function getContactByCompanyId({ companyId }: { companyId: string }): ContactDto | null {
  const company = db.Company.find((company) => company.id === companyId)
  if (!company) {
    console.error(new Error('Company not found with id: ' + companyId))
    return null
  }

  return db.Contact.find(contact => contact.id === company.contact_id) as ContactDto
}

type RequestPayload = {
  params: {
    companyId: string
  }
}
export async function GET (req: NextRequest, { params }: RequestPayload) {
  console.log('params.companyId ', params.companyId)
  const { companyId } = params
  if (!companyId) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'Id not defined.'
    })
  }
  const contact = await getContactByCompanyId({ companyId })
  if (!contact) {
    return new NextResponse(null, {
      status: 404,
      statusText: 'Contact not found for corresponding company.'
    })
  }
  const res = new NextResponse(JSON.stringify(contact), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return res
}
