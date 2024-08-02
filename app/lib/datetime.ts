import { TFunction } from "i18next"

export function getDayRange({ dayIndexes, t }: { dayIndexes: number[], t: TFunction<"", undefined> }): string {
  const [first] = dayIndexes
  const last = dayIndexes[dayIndexes.length - 1]

  if (last - first === dayIndexes.length - 1) {
    const startDay = t(`_days.${dayIndexes[0]}`)
    const endDay = t(`_days.${dayIndexes[dayIndexes.length - 1]}`)
    return `${startDay}-${endDay}`
  }
  return dayIndexes.map(i => t(`_days.${i}`)).reduce((acc, curr, i) => {
    acc += curr
    if (i < dayIndexes.length - 1) {
      acc += ','
    }
    return acc
  }, '')
}

export function formatWorkHours(
  { startDateStr, endDateStr }: { startDateStr: string, endDateStr: string },
): string {
  return '08:00-19:00'
}
