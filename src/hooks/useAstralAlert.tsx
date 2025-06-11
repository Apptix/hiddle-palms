import * as React from "react";

import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

import { toast as sonnerToast } from "sonner";

type TAstralAlertType = "success" | "error" | "warning" | "info" | "default";

interface IAstralAlertOptions {
  title?: string
  description?: string
  duration?: number
}

export function useAstralAlert() {
  const showAstralAlert = ( type: TAstralAlertType, options: IAstralAlertOptions ) => {
    const { title, description, duration = 5000 } = options;

    let Icon;

    switch ( type ) {
      case "success":
        Icon = CheckCircle;
        break;
      case "error":
        Icon = AlertCircle;
        break;
      case "warning":
        Icon = AlertTriangle;
        break;
      case "info":
        Icon = Info;
        break;
      default:
        Icon = Info;
    }

    const background =
      type === "success" ? "rgba(34, 197, 94)" :
        type === "error" ? "rgba(239, 68, 68)" :
          type === "warning" ? "rgba(234, 179, 8)" :
            type === "info" ? "rgba(59, 130, 246)" :
              "linear-gradient(rgba(59, 130, 246)";

    sonnerToast( title || type.toUpperCase(), {
      description,
      duration,
      icon: <Icon className="h-5 w-5" />,
      style: {
        background
      }
    });
  };

  return {
    success: ( options: IAstralAlertOptions ) => showAstralAlert( "success", options ),
    error: ( options: IAstralAlertOptions ) => showAstralAlert( "error", options ),
    warning: ( options: IAstralAlertOptions ) => showAstralAlert( "warning", options ),
    info: ( options: IAstralAlertOptions ) => showAstralAlert( "info", options ),
    default: ( options: IAstralAlertOptions ) => showAstralAlert( "default", options )
  };
}