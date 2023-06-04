import "firebase/compat/firestore";
import "firebase/compat/auth";

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
