/**
 * Type TFormResourceType is the key to accessing corresponding form or group of forms.
 * TFormResourceType: Name of the resource using the form.
 */
export type TFormResourceType = "document-viewer" |
"permit-form" |
"license-form";

/**
 * TFormType: Type of form.
 */
export type TFormType = "create" | "edit" | "draft";

/**
 * @IGlobalFormManagerState
 *
 * TODO:
 *  * Describing use of each key in IGlobalFormManagerState
 *  * Strictly enforce the type of payload and prefilledPayload
 * Enforce the typing once we start creating the forms.
 */
export interface IGlobalFormManagerState {
  formVisible?: boolean;
  showInstructions?: boolean;
  formType?: TFormType;
  formResourceType?: TFormResourceType;
  extraProps?: any;
  payload?: Record<string, any>;
  prefillPayload?: Record<string, any>;
  activePanelIndex?: number,
};
