"use client";

import { useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

interface FirebaseAuthUIProps {
  uiConfig: firebaseui.auth.Config;
  firebaseAuth: any;
}

export default function FirebaseAuthUI({
  uiConfig,
  firebaseAuth,
}: FirebaseAuthUIProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get or create a FirebaseUI instance.
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);

    if (uiConfig.signInFlow === "popup") {
      firebaseUiWidget.reset();
    }

    // We track the auth state to reset firebaseUi if the user signs out.
    const unregisterAuthObserver = firebaseAuth.onAuthStateChanged(
      (user: any) => {
        if (!user && elementRef.current) {
          firebaseUiWidget.reset();
        }
      }
    );

    // Render the firebaseUi Widget.
    if (elementRef.current) {
      firebaseUiWidget.start(elementRef.current, uiConfig);
    }

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [firebaseAuth, uiConfig]);

  return <div ref={elementRef} />;
}
