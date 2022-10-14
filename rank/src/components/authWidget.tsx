import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth } from 'firebaseui';
import { getAuth } from 'firebase/auth';


export interface AuthWidgetProps {
    redirectUrl?: string | null
}

function AuthWidget(props: AuthWidgetProps) {

    var ui = new  auth.AuthUI(firebase.auth());

    var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult: any, redirectUrl:string) {
            return true;
          },
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: props.redirectUrl ?? "/mystuff",
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
      };

    ui.start('#firebaseui-auth-container', uiConfig);
}

export default AuthWidget;
