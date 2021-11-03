import React, { Component } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogTitle,
  TextField,
  Container,
} from "@mui/material";

export default class NewBlogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      title: "",
      content: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    this.props.handleSubmit({ ...this.state });
  }

  render() {
    return (
      <div>
        <Dialog
          maxWidth="md"
          fullWidth={true}
          scroll="paper"
          open={this.props.showModal}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          {!this.props.user && (
            <DialogActions>
              <TextField
                error={this.state.name == "" && this.state.name != undefined}
                name="name"
                label="Name"
                onChange={this.handleChange}
                value={this.state.name}
                helperText="Can't be blank"
                color="secondary"
                fullWidth
                style={{
                  margin: "10px",
                }}
              />
              <TextField
                error={this.state.email == ""}
                name="email"
                label="Email"
                onChange={this.handleChange}
                value={this.state.email}
                helperText="Can't be blank"
                color="secondary"
                fullWidth
                style={{
                  margin: "10px",
                }}
              />
            </DialogActions>
          )}
          <DialogTitle id="scroll-dialog-title">
            <TextField
              fullWidth={true}
              error={this.state.title == "" && this.state.title != undefined}
              name="title"
              required
              multiline
              label="Title"
              helperText="Can't be blank"
              onChange={this.handleChange}
              color="secondary"
              value={this.state.title}
            />
          </DialogTitle>
          <DialogContent id="scroll-dialog-description">
            <TextField
              error={
                this.state.content == "" && this.state.content != undefined
              }
              fullWidth={true}
              name="content"
              required
              multiline
              maxRows={10}
              label="Content"
              helperText="Can't be blank"
              onChange={this.handleChange}
              color="secondary"
              value={this.state.content}
            />
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              style={{
                backgroundColor: "white",
                border: "2px solid",
                borderColor: "#A059B0",
                margin: "10px",
                color: "red",
              }}
              onClick={this.props.handleCancel}
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              disabled={this.state.disableSubmitButton}
              fullWidth
              style={{
                backgroundColor: "white",
                border: "2px solid",
                borderColor: "#A059B0",
                margin: "10px",
                color: "green",
              }}
            >
              <DoneIcon />
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
