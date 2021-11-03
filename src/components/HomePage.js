import React, { Component } from "react";
import { Container, Grid, Box } from "@mui/material";
import { BlogCard } from "./BlogCard";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.blogs && (
          <Box m={3}>
            <Grid container spacing={3}>
              {Object.values(this.props.blogs).map((blog) => {
                return (
                  <Grid item xs={4} key={blog.id}>
                    <BlogCard
                      {...blog}
                      cardClicked={(blog) => {
                        window.location.href = "/blog/" + blog.id;
                      }}
                    ></BlogCard>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </div>
    );
  }
}
