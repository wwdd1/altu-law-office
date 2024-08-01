import { NextRequest, NextResponse } from "next/server"
import {
  createFiltersFromQueryParams,
  findMemberByFilters,
} from '@/api/(services)/member'

type RequestPayload = {
  params: {
    companyId: string
  }
}
export async function GET (req: NextRequest, { params }: RequestPayload) {
  const { companyId } = params
  if (!companyId) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'companyId not defined.'
    })
  }
  const filters = createFiltersFromQueryParams(req.nextUrl.searchParams)
  if (Object.keys(filters).length === 0) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'You have to pass one or more supported filters.'
    })
  }
  const member = await findMemberByFilters(companyId, filters)
  if (!member) {
    return new NextResponse(null, {
      status: 404,
      statusText: 'Team member not found.'
    })
  }
  const res = new NextResponse(JSON.stringify(member), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return res
}
