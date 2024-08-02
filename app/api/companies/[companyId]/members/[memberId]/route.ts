import { NextRequest, NextResponse } from "next/server"
import db from "../../../../db.json" assert { type: 'json' }

async function getCompanyMemberById({ companyId, memberId }: { companyId: string, memberId: string }) {
  const company = db.Company.find(company => company.id === companyId)
  const [member] = db.Member
    .filter(member => member.id === memberId)
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
  return member
}

type RequestPayload = {
  params: {
    companyId: string
    memberId: string
  }
}
export async function GET (req: NextRequest, { params }: RequestPayload) {
  if (!params.companyId) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'companyId not defined.'
    })
  }

  if (!params.memberId) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'memberId not defined.'
    })
  }
  const member = await getCompanyMemberById(params)
  if (!member) {
    return new NextResponse(null, {
      status: 404,
      statusText: 'Member not found.'
    })
  }
  const res = new NextResponse(JSON.stringify(member), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return res
}
