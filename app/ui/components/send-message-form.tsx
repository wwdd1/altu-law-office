'use client'

import { useFormState } from "react-dom";
import classNames from "classnames"

import Input from "app/ui/components/core/input"
import Button from "app/ui/components/core/button"
import TextArea from "app/ui/components/core/textarea"

import { FormState, Severity } from "app/lib/definitions"
import { actionContactSendMessage } from "app/actions/contact-send-message/index"
import { Translations } from "app/ui/components/hoc/withTranslations/types"
import withTranslations from "app/ui/components/hoc/withTranslations/client"
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
} & Translations
function SendMessageForm({ className, t }: Props) {
  const [state, formAction] = useFormState<FormState, FormData>(actionContactSendMessage, {
    severity: null,
    messages: [],
  })

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form action={formAction} ref={formRef} className={classNames([className])}>
          {
            state?.messages.length ? 
              <div className={classNames('py-4 px-2', {
                'bg-alert-info': state.severity === Severity.INFO,
                'bg-alert-error-low': state.severity === Severity.ERROR_LOW,
                'bg-alert-error-high': state.severity === Severity.ERROR_HIGH
              })}>
                <ul className="text-bold list-disc ps-6">
                  {
                    state?.messages.map((msgKey) => (
                      <li
                        className="mb-2 last:mb-0"
                        key={msgKey}
                      >
                        { t(`contact-form.${msgKey}`) }
                      </li>
                    ))
                  }
                </ul>
              </div>
            : ''
          }
      <div className="flex xs:flex-wrap gap-4 mt-4">
        <Input
          name="name"
          className="flex-1 xs:min-w-[120px]"
          placeholder={t('contact-form.name.label')}
          type="text"
          minLength={3}
          maxLength={80}
        ></Input>
        <Input
          name="email"
          className="flex-1 xs:min-w-[120px]"
          placeholder={t('contact-form.email.label')}
          type="email"
          maxLength={300}
        ></Input>
      </div>
      <div className="my-4">
        <TextArea
          name="message"
          placeholder={t('contact-form.message.label')}
          rows={5}
          minLength={50}
          maxLength={300}
        ></TextArea>
      </div>
      <div className="text-right xs:text-center">
        <Button
          type="submit"
          label={t('send')}
          disabledLabel={t('sending')}
          className="px-20 xs:w-full"
        ></Button>
      </div>
    </form>
  )
}

export default withTranslations(SendMessageForm)
