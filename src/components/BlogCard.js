import React, { Component } from "react";
import { Card, CardContent, CardHeader, Link, Typography } from "@mui/material";
import { BootstrapTooltip, getDateMonth } from "./common";

export class BlogCard extends Component {
  styles = { blogCard: { borderColor: "red" } };

  render() {
    return (
      <div>
        <Link href={"/blog/" + this.props.id} underline="none">
          <BootstrapTooltip title="Exapnd this blog">
            <Card
              onClick={() => {
                window.location.href = "/blog/" + this.props.id;
              }}
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
                subheader={getDateMonth(this.props.publishedAt)}
              />
              <CardContent>
                <Typography variant="body1" color="text.primary">
                  {this.props.content}
                </Typography>
              </CardContent>
            </Card>
          </BootstrapTooltip>
        </Link>
      </div>
    );
  }
}
