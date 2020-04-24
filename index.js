import React, { useState, useEffect } from "react";
import { render } from "react-dom";

import "./style.css";

/*
"I broke my Ajax form" Exercise

OBJECTIVES:
1) Show a banner notification when the app is offline.

Needed details:
- "window.navigator.onLine" returns TRUE if you are online and FALSE if you are offline.
- Call handleOfflineStatusChange(status) with "offline" or "online" when you detect a change.
- if you choose to subscribe to an event in an effect, you need to unsubscribe during the cleanup stage.

useEffect(() => {
  // effect in here
  
  return () => {
      cleanup code here
  };
});

2) Populate the Category dropdown from "categories" array found in the fetchUser ajax call. Then ensure that the "Support" option is selected by default when the page loads.

3) Fill out the form. Then click "Reset Form". You'd expect all of the fields except for name and category to be blank. That isn't happening. Fix it.

*/

/*
TODO: recommend they disable hot reload on typing for effects... IF they are doing state updates from effect...
*/

/*
OBJECTIVES:
1) Show a banner notification when the app is offline.

Needed details:
- "window.navigator.onLine" returns TRUE if you are online and FALSE if you are offline.
- Call handleOfflineStatusChange(status) with "offline" or "online" when you detect a change.
- if you choose to subscribe to an event in an effect, you need to unsubscribe during the cleanup stage.

useEffect(() => {
  // effect in here
  
  return () => {
      cleanup code here
  };
});


Hints:
- test offline/online mode with the network panel in devtools
- window.addEventListener('online',  callbackFn);
- window.removeEventListener('online', callbackFn);
- There's an 'online' and 'offline' event.


2) Populate the Category dropdown from "categories" array found in the fetchUser ajax call (ajax call). Then ensure that the "Support" option is selected by default when the page loads.

Hints:
- Save the "categories" array from the response to state in React
- Use that state to generate the options for the dropdown


3) Fill out the form. Then click "Reset Form". You'd expect all of the fields except for name and category to be blank. That isn't happening. Fix it.

Hints:
- Follow the logic after you click "reset form". Console.log state along the way. See where state goes wrong.
- This may have to do with stale state.

*/

var initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  msg: "",
  category: "",
  errors: [],
  hasLoaded: false
};

function App() {
  var [state, setState] = useState(initialState);

  console.log("render");

  useEffect(fetchUserData, []);

  useEffect(() => {
    // effect runs after every render

    return () => {
      // cleanup that happens before effect is run the next time
      // useful for removing subscriptions, or event listeners.
    };
  });

  function handleOfflineStatusChange(status) {
    if (status === "online") {
      setState({
        ...state,
        msg: ""
      });
    } else {
      setState({
        ...state,
        msg: "Oh NO. The app is offline!"
      });
    }
  }

  function fetchUserData() {
    fetch(
      "https://n89i8xbcal.execute-api.us-west-2.amazonaws.com/prod/react-intro-forms"
    )
      .then(res => {
        return res.json();
      })
      .then(jsonRes => {
        var savedName = jsonRes.name;
        setTimeout(() => {
          setState(prevState => {
            return {
              ...state,
              name: savedName,
              hasLoaded: true
            };
          });
        }, 1000);
      });
  }

  function handleFormChange(e) {
    var newValue = e.target.value;
    var name = e.target.name;

    setState({
      ...state,
      [name]: newValue
    });
  }

  function handleFormSubmit() {
    fetch(
      "https://n89i8xbcal.execute-api.us-west-2.amazonaws.com/prod/react-intro-forms",
      {
        method: "post",
        body: JSON.stringify(state)
      }
    )
      .then(res => {
        return res.json();
      })
      .then(jsonRes => {
        console.log("jsonRes submit", jsonRes);

        if (jsonRes.success) {
          setState({ ...state, msg: jsonRes.msg });
        } else {
          setState({ ...state, errors: jsonRes.errors });
        }
      });
  }

  function handleFormReset() {
    setState({ ...state, ...initialState });
    fetchUserData();
  }

  if (!state.hasLoaded) return "Loading...";

  var errs = state.errors.map(item => {
    return <div className="error">{item.msg}</div>;
  });

  return (
    <>
      {state.msg && <div className="error">{state.msg}</div>}
      {errs}
      <fieldset>
        <label>Your Name</label>
        <br />
        <input
          value={state.name}
          name="name"
          placeholder="Alex Trebeck"
          onChange={handleFormChange}
        />
      </fieldset>
      <fieldset>
        <label>Your Email</label>
        <br />
        <input
          value={state.email}
          onChange={handleFormChange}
          name="email"
          placeholder="alex@gmail.com"
        />
      </fieldset>
      <fieldset>
        <label>Your Category</label>
        <br />
        <select
          name="category"
          value={state.category}
          onChange={handleFormChange}
        >
          <option>__REPLACE ME</option>
        </select>
      </fieldset>
      <fieldset>
        <label>Your Subject</label>
        <br />
        <input
          name="subject"
          value={state.subject}
          onChange={handleFormChange}
          placeholder="Whatever Topic you want"
          style={{ width: 250 }}
        />
      </fieldset>
      <fieldset>
        <label>Your Message</label>
        <br />
        <textarea
          name="message"
          value={state.message}
          onChange={handleFormChange}
          placeholder="Enter your message here"
          rows="10"
          cols="60"
        />
      </fieldset>
      <button className="button" onClick={handleFormSubmit}>
        Submit
      </button>
      <button className="button" onClick={handleFormReset}>
        Reset Form
      </button>
    </>
  );
}

render(<App />, document.getElementById("root"));


