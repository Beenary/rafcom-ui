"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmActionAlertProps {
  /** Main alert banner title. */
  alertTitle: string
  /** Supporting text shown in the alert banner. */
  alertDescription: string
  /** Dialog title shown in the confirmation modal. */
  dialogTitle?: string
  /** Dialog body text shown in the confirmation modal. */
  dialogDescription?: string
  /** Label for the button that opens the dialog. Defaults to "Confirm". */
  triggerLabel?: string
  /** Label for the cancel button inside the dialog. Defaults to "Cancel". */
  cancelLabel?: string
  /** Label for the confirm button inside the dialog. Defaults to "Confirm". */
  confirmLabel?: string
  /** Called when the user confirms the action. */
  onConfirm?: () => void
  /** When true, all interactive elements are disabled. */
  isLoading?: boolean
  /**
   * Replaces the built-in AlertDialog trigger with a custom element.
   * Use when you need a different confirmation pattern (e.g. a drawer or sheet).
   */
  customAction?: React.ReactNode
}

export function ConfirmActionAlert({
  alertTitle,
  alertDescription,
  dialogTitle,
  dialogDescription,
  triggerLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onConfirm,
  isLoading = false,
  customAction,
}: ConfirmActionAlertProps) {
  return (
    <Alert>
      <AlertTitle className="text-sm">{alertTitle}</AlertTitle>
      <AlertDescription>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground max-w-sm">
            {alertDescription}
          </div>
          <div className="ml-auto">
            {customAction ?? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={isLoading}>
                    {triggerLabel}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
                      {confirmLabel}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
