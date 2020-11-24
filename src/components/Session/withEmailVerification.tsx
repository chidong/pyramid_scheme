import React, { useState } from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const needsEmailVerification = (authUser: any) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map((provider: any) => provider.providerId)
    .includes("password");

const withEmailVerification = (Component: React.FunctionComponent) => {
  const WithEmailVerification = (props: any) => {
    const [isSent, setIsSent] = useState(false);

    const onSendEmailVerification = () => {
      props.firebase.doSendEmailVerification().then(() => setIsSent(true));
    };

    return (
      <AuthUserContext.Consumer>
        {(authUser) =>
          needsEmailVerification(authUser) ? (
            <div>
              {isSent ? (
                <p>
                  E-Mail confirmation sent: Check you E-Mails (Spam folder
                  included) for a confirmation E-Mail. Refresh this page once
                  you confirmed your E-Mail.
                </p>
              ) : (
                <p>
                  Verify your E-Mail: Check you E-Mails (Spam folder included)
                  for a confirmation E-Mail or send another confirmation E-Mail.
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
          )
        }
      </AuthUserContext.Consumer>
    );
  };
  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
