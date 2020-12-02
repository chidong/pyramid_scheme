import React, { useContext, useState } from "react";
import AuthUserContext from "./context";
import { FirebaseContext } from "../Firebase";

const needsEmailVerification = (authUser: any) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map((provider: any) => provider.providerId)
    .includes("password");

const withEmailVerification = (Component: React.FunctionComponent) => {
  const WithEmailVerification = (props: any) => {
    const [isSent, setIsSent] = useState(false);
    const firebase = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);

    const onSendEmailVerification = () => {
      firebase?.doSendEmailVerification().then(() => setIsSent(true));
    };

    return needsEmailVerification(authUser) ? (
      <div>
        {isSent ? (
          <p>
            E-Mail confirmation sent: Check you E-Mails (Spam folder included)
            for a confirmation E-Mail. Refresh this page once you confirmed your
            E-Mail.
          </p>
        ) : (
          <p>
            Verify your E-Mail: Check you E-Mails (Spam folder included) for a
            confirmation E-Mail or send another confirmation E-Mail.
          </p>
        )}

        <button
          type="button"
          onClick={onSendEmailVerification}
          disabled={isSent}
        >
          Send confirmation E-Mail
        </button>
      </div>
    ) : (
      <Component {...props} />
    );
  };
  return WithEmailVerification;
};

export default withEmailVerification;
