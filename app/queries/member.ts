import { TeamMemberDto } from "@/lib/dtos"

export function getMembers({
  companyId,
}: {
  companyId: string
}) {
  return {
    queryKey: ['members'],
    queryFn: async (): Promise<TeamMemberDto[]> => {
      const apiUri= `/api/companies/${companyId}/members`
      const response = await fetch(apiUri)
      return response.json()
    }
  }
}