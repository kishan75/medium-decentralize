import React, { Component } from "react";
import Modal from "@mui/material/Modal";
import LinearProgress from "@mui/material/LinearProgress";

export default class Loader extends Component {
  render() {
    return (
      <div>
        <Modal open={this.props.loader}>
          <LinearProgress />
        </Modal>
      </div>
    );
  }
}
