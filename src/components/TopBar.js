import React, { Component } from "react";
import { Container, Toolbar, Button, AppBar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { BootstrapTooltip } from "./common";

export default class TopBar extends Component {
  render() {
    return (
      <div>
        <AppBar
          position="fixed"
          style={{ background: "white", boxShadow: "none" }}
        >
          <Toolbar>
            <Container
              style={{
                margin: "20px",
                marginLeft: "200px",
                alignItems: "center",
                border: "5px solid",
                minWidth: "700px",
              }}
            >
              <Button
                onClick={this.props.handleNewBlog}
                style={{
                  minWidth: "400px",
                  borderColor: "blue",
                  border: "5px solid",
                  marginRight: "30px",
                }}
              >
                <NoteAddIcon />
                Create New Blog
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                style={{
                  minWidth: "250px",
                  borderColor: "blue",
                  border: "5px solid",
                  marginRight: "30px",
                }}
              >
                <HomeIcon /> Home
              </Button>
              <BootstrapTooltip
                title={
                  this.props.user == null
                    ? "your account is not registred yet"
                    : "see your blogs"
                }
              >
                <span>
                  <Button
                    disabled={this.props.user == null}
                    onClick={() => {
                      window.location.href = "/user/" + this.props.user.id;
                    }}
                    style={{
                      minWidth: "400px",
                      borderColor: "blue",
                      border: "5px solid",
                    }}
                  >
                    <AccountCircleIcon />
                    My Blogs
                  </Button>
                </span>
              </BootstrapTooltip>
            </Container>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Toolbar />
      </div>
    );
  }
}
