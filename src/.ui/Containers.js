import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class ContainerIdDetector extends React.Component {
  constructor() {
    super();
    this.state = { containerId: "" };
  }

  componentDidMount() {
    this.setState({
      containerId: ReactDOM.findDOMNode(this).parentNode.getAttribute("id")
    });
  }

  render() {
    if (!this.state.containerId) {
      return <span />;
    } else {
      return React.cloneElement(React.Children.only(this.props.children), {
        [this.props.property]: this.state.containerId
      });
    }
  }
}

ContainerIdDetector.propTypes = {
  property: PropTypes.string.isRequired
};

// Takes an optional property name `property` and returns a function. This returned function takes a component class and returns a new one
// that, when rendered, automatically receives the ID of its parent DOM node on the property identified by `property`.
// ES7 @withContainerId() => this.props.containerId
export function withContainerId(property = "containerId") {
  return Component => props => (
    <ContainerIdDetector property={property}>
      <Component {...props} />
    </ContainerIdDetector>
  );
}
