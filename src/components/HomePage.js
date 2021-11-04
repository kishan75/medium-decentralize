import React, { Component } from "react";
import { Grid, Box } from "@mui/material";
import { BlogCard } from "./BlogCard";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        {this.props.blogs && (
          <Box m={3}>
            <Grid container spacing={3}>
              {Object.values(this.props.blogs).map((blog) => {
                return (
                  <Grid item xs={4} key={blog.id}>
                    <BlogCard {...blog}></BlogCard>
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
