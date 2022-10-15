import React, { useState } from "react";
import "firebaseui/dist/firebaseui.css";
import "../../styles/myStuff.css";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ExistingTemplateStub } from "../../components/templates/templates";
import { TemplatesList } from "../../components/templates/templatesList";

function MyStuff() {
  const auth = getAuth();
  const [existingUser, setUser] = useState<User | null>(null);
  const [stubs, setStubs] = useState<ExistingTemplateStub[]>([]);
  const [hasRequestedTemplates, setHasRequestedTemplates] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user && !existingUser) {
      setUser(user);
    }
  });

  function renderMyStuff() {
    if (!hasRequestedTemplates && stubs.length == 0 && existingUser) {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      setHasRequestedTemplates(true);
      fetch(
        "http://127.0.0.1:8080/templates?email=" + existingUser?.email,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          var response = data as ExistingTemplateStub[];
          var stublist: ExistingTemplateStub[] = [];
          response.map((template, _t) => {
            stublist.push({ id: template.id, name: template.name });
          });
          setStubs(stublist);
        });
    }

    return (
      <>
        <div className="myStuffContainer">
          <div className="stuff-subtitle">
            Your Templates
            <TemplatesList stubs={stubs} />
          </div>
          <div className="stuff-subtitle">Your Ranks</div>
        </div>
        <button className="button-styles" onClick={() => auth.signOut()}>
          Sign Out
        </button>
      </>
    );
  }

  function renderPleaseSignIn() {
    return (
      <>
        <div className="main-subtitle">
          This page is where you can see your saved rankings and templates, but
          you must sign in to do so.
        </div>
        <a className="button-styles" href={"/"}>
          Sign In
        </a>
      </>
    );
  }

  return (
    <>
      <div className="home-page-layout">
        <div className="main-title">
          Welcome {existingUser?.displayName ?? existingUser?.email} !
        </div>
        {existingUser ? renderMyStuff() : renderPleaseSignIn()}
      </div>
    </>
  );
}

export default MyStuff;
