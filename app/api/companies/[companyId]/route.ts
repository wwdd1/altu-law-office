import { NextRequest, NextResponse } from "next/server"
import db from "../../db.json" assert { type: 'json' }

async function getCompanyById(id: string) {
  const [found] = db.Company
    .filter(company => company.id === id)
    .map(company => {
      const companyObject = {
        ...company,
        contact_id: null,
        contact: db.Contact.find(contact => company.contact_id === contact.id)
      }
      return companyObject
    })
  return found
}

type RequestPayload = {
  params: {
    companyId: string
  }
}
export async function GET (req: NextRequest, { params }: RequestPayload) {
  console.log('params.companyId ', params.companyId)
  if (!params.companyId) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'Id not defined.'
    })
  }
  const company = await getCompanyById(params.companyId)
  if (!company) {
    return new NextResponse(null, {
      status: 404,
      statusText: 'Company not found.'
    })
  }
  const res = new NextResponse(JSON.stringify(company), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return res
}
