import db from "../db.json" assert { type: 'json' }

export const ALLOWED_FIELDS = ['client_route_id'] as const
export type MemberFilterKeys = typeof ALLOWED_FIELDS[number]
export type MemberFilters = Partial<Record<MemberFilterKeys, string>>

export function createFiltersFromQueryParams(searchParams: URLSearchParams): MemberFilters {
  const filters: MemberFilters = {}
  if (!searchParams) {
    return filters
  }
  const filtersIterator = searchParams.entries()
  let cursor = filtersIterator.next()
  while (!cursor.done) {
    const [key, value] = cursor.value
    if (ALLOWED_FIELDS.includes(key as MemberFilterKeys)) {
      filters[key as MemberFilterKeys] = value
    }
    cursor = filtersIterator.next()
  }
  return filters
}

function memberFilterPredicate(filters: MemberFilters) {
  const filterEntries = Object.entries(filters)
  if (filterEntries.length === 0) {
    return
  }
  return (member: any) => {
    for (const [key, value] of filterEntries) {
      console.log('pred:', { key, value })
      if (member[key] !== value) {
        return false
      }
    }
    return true
  }
}

export async function findMemberByFilters(companyId: string, filters: MemberFilters) {
  const applicableMemberFindPredicate = memberFilterPredicate(filters)
  if (!applicableMemberFindPredicate) {
    return
  }
  const company = db.Company.find((company) => company.id === companyId)
  if (!company) {
    return
  }
  const member = db.Member.find(applicableMemberFindPredicate)
  if (!member) {
    return
  }
  const contact = db.Contact.find((contact) => contact.id === member.contact_id)
  return {
    ...member,
    company,
    contact: contact || null,
  }
}
