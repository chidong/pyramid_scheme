import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { withFirebase } from "../Firebase";

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <Messages />
  </div>
);

interface Message {
  userId: string;
  text: string;
}

const MessagesBase: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setLoading(true);

    props.firebase.messages().on("value", (snapshot: any) => {
      // convert messages list from snapshot
      const messageObject = snapshot.val();
      if (messageObject) {
        const messageList = Object.keys(messageObject).map((key) => ({
          ...messageObject[key],
          uid: key,
        }));
        setMessages(messageList);
        setLoading(false);
      } else {
        setLoading(false);
        setMessages(null);
      }
    });

    return () => {
      props.firebase.messages().off();
    };
  }, [props.firebase]);

  const onCreateMessage = (event: React.FormEvent, authUser: any) => {
    props.firebase.messages().push({
      text: text,
      userId: authUser.uid,
    });

    setText("");

    event.preventDefault();
  };

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div>
          {loading && <div>Loading ...</div>}
          {messages ? (
            <MessageList messages={messages} />
          ) : (
            <div>There are no messages ...</div>
          )}

          <form onSubmit={(event) => onCreateMessage(event, authUser)}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const MessageList = (props: any) => (
  <ul>
    {props.messages.map((message: any) => (
      <MessageItem key={message.uid} message={message} />
    ))}
  </ul>
);

const MessageItem = (props: any) => (
  <li>
    <strong>{props.message.userId}</strong> {props.message.text}
  </li>
);

const Messages = withFirebase(MessagesBase);

const condition = (authUser: any) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Home);
