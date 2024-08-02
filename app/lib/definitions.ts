import type { ChangeEvent } from "react";

export enum Severity {
  INFO = 'severity-info',
  ERROR_LOW = 'severity-error-low',
  ERROR_HIGH = 'severity-error-high'
}

export interface SidebarMenuItem {
  key: string;
  text: string;
  route: string;
}

export type InputPropTypes<T> = {
  name: string;
  value?: string;
  onChange?: (e: ChangeEvent<T>) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  minLength?: number;
}

export type FormState = {
  severity: Severity | null;
  messages: string[]
}

export type AnimationTarget = 'header' | 'subheader' | 'tile' | 'card'
export type AnimationTargetProps = {
  animationTarget?: AnimationTarget;
}


