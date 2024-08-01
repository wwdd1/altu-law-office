import { NextRequest, NextResponse } from "next/server"
import db from "../../../db.json" assert { type: 'json' }

async function getCompanyMembers(id: string) {
  const company = db.Company.find(company => company.id === id)
  return db.Member
    .filter(member => member.company_id === id)
    .map(member => {
      const contact = db.Contact.find(contact => contact.id === member.contact_id)
      return {
        ...member,
        contact,
        contact_id: null,
        company,
        company_id: null,
      }
    })
}

type RequestPayload = {
  params: {
    companyId: string
  }
}
export async function GET (req: NextRequest, { params }: RequestPayload) {
  console.log('company request')
  if (!params.companyId) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'companyId not defined.'
    })
  }
  const members = await getCompanyMembers(params.companyId)
  const res = new NextResponse(JSON.stringify(members), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return res
}
