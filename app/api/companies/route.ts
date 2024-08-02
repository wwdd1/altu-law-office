import { type NextRequest, NextResponse } from "next/server"
import db from "../db.json" assert { type: 'json' }

async function getCompanyData() {
  return db.Company.map(company => {
    const companyObject = {
      ...company,
      contact_id: null,
      contact: db.Contact.find(contact => company.contact_id === contact.id)
    }
    return companyObject
  })
}

export async function GET (req: NextRequest) {
  const companies = await getCompanyData()
  const res = new NextResponse(JSON.stringify(companies), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return res
}
