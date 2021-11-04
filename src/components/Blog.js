import React, { Component } from "react";
import { Card, CardContent, Button, Typography, Link } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getDateMonth } from "./common";
import UpdateBlogModal from "./UpdateBlogModal";

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateModal: false,
    };
  }

  render() {
    return (
      <div>
        <UpdateBlogModal {...this.props}></UpdateBlogModal>
        <Card
          style={{
            backgroundColor: "#F2E1F9",
            boxShadow: "none",
            border: "15px solid",
            marginLeft: "40px",
            marginRight: "40px",

            borderColor: "white",
            "&:hover": {
              backgroundColor: "blue !important",
            },
          }}
        >
          <CardContent>
            <Typography variant="h1" style={{ textAlign: "center" }}>
              {this.props.title}
            </Typography>
            <Typography
              variant="h4"
              style={{
                textAlign: "center",
              }}
            >
              <span
                style={{
                  textAlign: "center",
                }}
              >
                <Link
                  href={"/user/" + this.props.createdBy.id}
                  underline="hover"
                >
                  By :- {this.props.createdBy.name}
                </Link>
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                float: "left",
                padding: "20px",
                display: "inline",
                color: "#726D6D",
              }}
            >
              Published At :- {getDateMonth(this.props.publishedAt)}
            </Typography>
            <Typography
              variant="h5"
              style={{
                float: "right",
                padding: "20px",
                color: "#726D6D",
              }}
            >
              Last Updated At :- {getDateMonth(this.props.lastUpdatedAt)}
            </Typography>
            <br />
            <br />
            <br />
            <h3
              style={{
                margin: "30px",
                padding: "15px",
                backgroundColor: "#FBDBD2",
                fontFamily: "serif",
                color: "black",
              }}
            >
              {this.props.content}
            </h3>

            <Button
              onClick={this.props.handleEditClicked}
              size="large"
              style={{
                margin: "0 auto",
                minWidth: "800px",
                display: "flex",
                color: "white",
                backgroundColor: "green",
              }}
            >
              <EditIcon />
              Edit This Blog
            </Button>
            <br />
            <h5
              style={{
                textAlign: "center",
              }}
            >
              Latest updated data of this blog contain in block number{" "}
              {this.props.blockNumber}
            </h5>
          </CardContent>
        </Card>
      </div>
    );
  }
}
