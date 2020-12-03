import React, { useState, useEffect, useContext } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { FirebaseContext } from "../Firebase";
import { AuthUser } from "../Session/withAuthentication";

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
  uid: string;
  createdAt: Date;
  editedAt?: Date;
}

const Messages: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [text, setText] = useState("");
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    setLoading(true);

    firebase
      ?.messages()
      .orderByChild("createdAt")
      .on("value", (snapshot: any) => {
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
      firebase?.messages().off();
    };
  }, [firebase]);

  const onCreateMessage = (event: React.FormEvent, authUser: AuthUser) => {
    firebase?.messages().push({
      text: text,
      userId: authUser.uid,
      createdAt: firebase.serverValue.TIMESTAMP,
    });

    setText("");

    event.preventDefault();
  };

  const onRemoveMessage = (uid: string) => {
    firebase?.message(uid).remove();
  };

  const onEditMessage = (message: Message, text: string) => {
    firebase?.message(message.uid).set({
      ...message,
      text,
      editedAt: firebase.serverValue.TIMESTAMP,
      uid: null,
    });
  };

  return (
    <div>
      {loading && <div>Loading ...</div>}

      {messages ? (
        <MessageList
          authUser={authUser}
          messages={messages}
          onRemoveMessage={onRemoveMessage}
          onEditMessage={onEditMessage}
        />
      ) : (
        <div>There are no messages ...</div>
      )}

      <form onSubmit={(event) => onCreateMessage(event, authUser!)}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const MessageList = (props: any) => (
  <ul>
    {props.messages.map((message: any) => (
      <MessageItem
        key={message.uid}
        authUser={props.authUser}
        message={message}
        onRemoveMessage={props.onRemoveMessage}
        onEditMessage={props.onEditMessage}
      />
    ))}
  </ul>
);

const MessageItem = (props: any) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(props.message.text);

  const onToggleEditMode = () => {
    setEditMode((editMode) => !editMode);
    setEditText(props.message.text);
  };

  const onSaveEditText = () => {
    props.onEditMessage(props.message, editText);
    setEditMode(false);
  };

  return (
    <li>
      {editMode ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.currentTarget.value)}
        />
      ) : (
        <span>
          <strong>{props.message.userId}</strong> {props.message.text}
          {props.message.editedAt && <span>(Edited)</span>}
        </span>
      )}
      {props.authUser.uid === props.message.userId && (
        <>
          {editMode ? (
            <span>
              <button onClick={onSaveEditText}>Save</button>
              <button onClick={onToggleEditMode}>Reset</button>
            </span>
          ) : (
            <button onClick={onToggleEditMode}>Edit</button>
          )}
          {!editMode && (
            <button
              type="button"
              onClick={() => props.onRemoveMessage(props.message.uid)}
            >
              Delete
            </button>
          )}
        </>
      )}
    </li>
  );
};

const condition = (authUser: AuthUser | null) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Home);
