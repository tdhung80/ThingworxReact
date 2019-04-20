import React from "react";

export const Context = React.createContext();

export class ViewContext extends React.Component {
  state = {
    //login: { username: "bells" }
  };

  /*
  <Context.Consumer>
    {context => (
      <React.Fragment>
      </React.Fragment>
    )}
  </Context.Consumer>  
  */
  render() {
    return (
      <Context.Provider value={{ ...this.state }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const AppContext = {
  login: { username: "bells" }
};
