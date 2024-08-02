import Image from "next/image"
import Link from "next/link"
import classNames from "classnames"

import Button from "app/ui/components/core/button"

type ItemProps = {
  className?: string
  imageUri: string
  fullname: string
  jobTitle: string
  description: string
  routeKey: string
}
export default function TeamMemberItem({
  className,
  imageUri,
  fullname,
  jobTitle,
  description,
  routeKey,
}: ItemProps) {
  return (
    <li className={classNames(['mx-16', className])}>
      <div className="h-[420px] relative overflow-clip">
        <Image
          className="absolute object-cover grayscale max-w-full"
          src={imageUri}
          alt={fullname}
          fill
        ></Image>
      </div>
      <div className="py-6 border-b border-gray-var-2">
        <h5 className="inline font-bold text-2xl">{fullname}</h5>
        <span className="mx-2 font-thin text-2xl">-</span>
        <h6 className="inline font-thin text-2xl">{jobTitle}</h6>
      </div>
      <div className="py-6 text-text-primary font-light border-b border-gray-var-2">
        { description }
      </div>
      <div className="py-6 flex xs:flex-wrap text-center gap-4">
        <Link href={`/contact/${routeKey}`} className="flex-1 xs:flex-0">
          <Button className="w-full" label="View background"></Button>
        </Link>
        <Link href={`/contact/${routeKey}`} className="flex-1 xs:flex-0">
          <Button className="w-full" label="Send a message"></Button>
        </Link>
      </div>
    </li>
  )
}
