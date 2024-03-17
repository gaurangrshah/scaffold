import { createContext, useContext } from "react";

export const GoogleTagManagerContext = createContext<
  | {
      // cookies: Consent | undefined;
      consentCookie: string;
      tags: NecessaryTrackingTagsTupleArrays;
    }
  | undefined
>(undefined);

export const GoogleTagManagerDispatch = createContext<{
  handleConsentUpdate: (
    // category: string,
    consentUpdate: Partial<Consent["primary" | "secondary"]>
  ) => void;
  sendGTMEvent: (event: string, data: Record<string, string>) => void;
}>({
  handleConsentUpdate: () => {},
  sendGTMEvent: () => {},
});

export function useGTM() {
  const context = useContext(GoogleTagManagerContext);
  if (context === undefined) {
    throw new Error(
      "useGoogleTagManager must be used within a GoogleTagManagerProvider"
    );
  }
  return context;
}

export function useGTMDispatch() {
  const context = useContext(GoogleTagManagerDispatch);
  if (context === undefined) {
    throw new Error(
      "useGoogleTagManagerDispatch must be used within a GoogleTagManagerProvider"
    );
  }
  return context;
}