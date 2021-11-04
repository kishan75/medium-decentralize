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
} from "@mui/material";

export default class UpdateBlogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      content: this.props.content,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit() {
    this.props.updateBlog({
      blogId: this.props.id,
      ...this.state,
    });
  }

  render() {
    return (
      <div key={JSON.stringify(this.props)}>
        <Dialog
          maxWidth="md"
          fullWidth={true}
          scroll="paper"
          open={this.props.showModal}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            <TextField
              fullWidth={true}
              name="title"
              required
              multiline
              label="Title"
              onChange={this.handleChange}
              color="secondary"
              value={this.state.title}
            />
          </DialogTitle>
          <DialogContent id="scroll-dialog-description" dividers>
            <TextField
              fullWidth={true}
              name="content"
              required
              multiline
              maxRows={15}
              label="Content"
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
              onClick={() => {
                this.setState({
                  title: this.props.title,
                  content: this.props.content,
                });
                this.props.handleCancel();
              }}
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
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
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
