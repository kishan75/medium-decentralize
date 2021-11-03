import React, { Component } from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { BootstrapTooltip, getDateMonth } from "./common";

export class BlogCard extends Component {
  constructor(props) {
    super(props);
  }

  styles = { blogCard: { borderColor: "red" } };

  render() {
    return (
      <div>
        <BootstrapTooltip title="Exapnd this blog">
          <Card
            onClick={() => this.props.cardClicked(this.props)}
            style={{
              backgroundColor: "#F2E1F9",
              boxShadow: "none",
              border: "4px solid",
              borderColor: "#24046B",
              "&:hover": {
                backgroundColor: "blue !important",
              },
            }}
          >
            <CardHeader
              title={this.props.title}
              subheader={getDateMonth(
                new Date(parseInt(this.props.publishedAt._hex, 16))
              )}
            />
            <CardContent>
              <Typography variant="body1" color="text.primary">
                {this.props.content}
              </Typography>
            </CardContent>
          </Card>
        </BootstrapTooltip>
      </div>
    );
  }
}
