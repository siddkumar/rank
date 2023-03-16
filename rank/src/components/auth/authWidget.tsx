import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { auth } from "firebaseui";
import { getAuth } from "firebase/auth";
import { CreateUser } from "../../services/userService";

interface Profile {
  email: string;
  family_name: string;
  given_name: string;
  granted_scopes: any;
  id: string;
  locale: any;
  name: string;
  picture: any;
  verified_email: boolean;
}

interface AdditionalUserInfo {
  isNewUser: boolean;
  providerId: string;
  profile: Profile;
}

export interface AuthResult {
  user: any;
  credential: any;
  operationType: string;
  additionalUserInfo: AdditionalUserInfo;
}

export interface AuthWidgetProps {
  redirectUrl?: string | null;
}

function AuthWidget(props: AuthWidgetProps) {
  var ui = new auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (
        authResult: AuthResult,
        redirectUrl: string
      ) {
        if (authResult.additionalUserInfo.isNewUser) {
          const email =
            authResult.additionalUserInfo.profile.email ??
            getAuth().currentUser?.email;
          CreateUser(email);
        }
        return true;
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: props.redirectUrl ?? "/mystuff",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };

  ui.start("#firebaseui-auth-container", uiConfig);
}

export default AuthWidget;
