import React, { Component } from "react";
import Web3 from "web3";
import HomePage from "./HomePage.js";
import "./App.css";
import Medium from "../abis/Medium.json";
import TopBar from "./TopBar";
import Blog from "./Blog.js";
import NewBlogModal from "./NewBlogModal.js";
import Loader from "./Loader.js";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { getErrorMsg } from "./common.js";
import { Alert, Snackbar } from "@mui/material";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewBlogModal: false,
      networkId: "",
      account: "",
      medium: null,
      users: {},
      user: null,
      blogIdList: [],
      blogs: {},
      loader: true,
      showUpdateModal: false,
      notificationMsg: "",
      showNotification: false,
      notificationType: "s",
    };
    this.newBlogSubmitClicked = this.newBlogSubmitClicked.bind(this);
    this.showUserBlogs = this.showUserBlogs.bind(this);
    this.addNewBlog = this.addNewBlog.bind(this);
    this.createUser = this.createUser.bind(this);
    this.addBlogInUserList = this.addBlogInUserList.bind(this);
    this.updateBlog = this.updateBlog.bind(this);
    this.blogUpdated = this.blogUpdated.bind(this);
  }

  async componentDidMount() {
    await this.setBlockchain();
    await this.getUserDetail();
    await this.getBlogIds();
    this.getBlogsFromBlogIdList(this.state.blogIdList).then((result) => {
      if (result && result.length) {
        for (let i = 0; i < result.length; i++) {
          let blog = result[i];
          let {
            blockNumber,
            createdBy,
            id,
            title,
            publishedAt,
            lastUpdatedAt,
            content,
          } = blog;
          this.setState({
            blogs: {
              ...this.state.blogs,
              [blog.id]: {
                blockNumber,
                createdBy,
                id,
                title,
                publishedAt,
                lastUpdatedAt,
                content,
              },
            },
          });
        }
      }
      this.state.medium.events.blogPublished((err, data) =>
        this.addNewBlog(data)
      );
      this.state.medium.events.userCreated((err, data) =>
        this.createUser(data)
      );
      this.state.medium.events.userToBlogMappingUpdated((err, data) => {
        this.addBlogInUserList(data);
      });
      this.state.medium.events.blogUpdated((err, data) => {
        this.blogUpdated(data);
      });
      this.setState({
        loader: false,
      });
    });
  }

  updateBlog(data) {
    let { blogId, title, content } = data;
    this.state.medium.methods
      .updateBlog(blogId, title, content)
      .send({ from: this.state.account })
      .then((result) => {
        this.setState({
          showUpdateModal: false,
        });
        this.setState({
          notificationMsg:
            "Blog has updated and stored on block number " + result.blockNumber,
          showNotification: true,
          notificationType: "s",
        });
      })
      .catch((err) => {
        this.setState({
          notificationMsg: getErrorMsg(err.message),
          showNotification: true,
          notificationType: "f",
        });
      });
  }

  blogUpdated(data) {
    let { id, blog } = data.returnValues;
    this.setState({
      blogs: {
        ...this.state.blogs,
        [id]: blog,
      },
      users: {
        ...this.state.users,
        [blog.createdBy.id]: {
          ...this.state.users[blog.createdBy.id],
          [id]: blog,
        },
      },
    });
  }

  createUser(user) {
    let { id, name, email } = user.returnValues;
    this.setState({
      user: { id, name, email },
      notificationType: "s",
      showNotification: true,
      notificationMsg: "You have registered with user id : " + id,
    });
  }

  addBlogInUserList(data) {
    let { userId, blog } = data.returnValues;
    let tempNewBlog = {
      blockNumber: blog.blockNumber,
      createdBy: blog.createdBy,
      id: blog.id,
      title: blog.title,
      publishedAt: blog.publishedAt,
      lastUpdatedAt: blog.lastUpdatedAt,
      content: blog.content,
    };
    if (this.state.users[userId]) {
      this.setState({
        users: {
          ...this.state.users,
          [userId]: {
            ...this.state.users[userId],
            [blog.id]: { ...tempNewBlog },
          },
        },
      });
    } else {
      this.setState({
        users: {
          ...this.state.users,
          [userId]: {
            [blog.id]: { ...tempNewBlog },
          },
        },
      });
    }
  }

  async getUserDetail() {
    let result = await this.state.medium.methods
      .getUser(this.state.account)
      .call();
    console.log("result", result);
    if (result && result.email != "") {
      let { name, email, id } = result;
      this.setState({
        user: {
          name,
          email,
          id,
        },
      });
    }
  }

  async getBlogsFromBlogIdList(idList) {
    let result = await this.state.medium.methods
      .getBlogsByIds(idList)
      .call({ from: this.state.account });
    return result;
  }

  async setBlockchain() {
    if (!window.ethereum) {
      alert("please install metamask first");
      return;
    }
    window.web3 = new Web3(window.ethereum);
    window.web3.eth.handleRevert = true;
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    this.setState({ account: accounts[0] });
    window.ethereum.on("accountsChanged", (accounts) => {
      this.setState({ account: accounts[0] });
      window.location.reload();
    });
    await this.setNetworkData();
    window.ethereum.on("chainChanged", async () => {
      let result = await this.setNetworkData();
      if (result) window.location.reload();
    });
  }

  async setNetworkData() {
    const networkId = await window.web3.eth.net.getId();
    const networkData = '0x3'
    if (networkData) {
      let medium = new window.web3.eth.Contract(
        Medium.abi,
        "0x8a4300979d3f6460e4de39c67eeb90a8a0959e1b"
      );
      this.setState({
        medium: medium,
      });
      return true;
    } else {
      alert(" Medium contract is not deployed on this blockchain");
      return false;
    }
  }

  async getBlogIds() {
    const blogIds = await this.state.medium.methods
      .getAllBlogIds()
      .call({ from: this.state.account });
    if (blogIds)
      this.setState({ blogIdList: [...this.state.blogIdList, ...blogIds] });
  }

  addNewBlog(blog) {
    let {
      blockNumber,
      createdBy,
      id,
      title,
      publishedAt,
      lastUpdatedAt,
      content,
    } = blog.returnValues.thisBlog;
    let tempNewBlog = {
      blockNumber,
      createdBy,
      id,
      title,
      publishedAt,
      lastUpdatedAt,
      content,
    };
    this.setState({
      blogIdList: [...this.state.blogIdList, id],
      blogs: {
        ...this.state.blogs,
        [id]: { ...tempNewBlog },
      },
    });
  }

  async newBlogSubmitClicked(blog) {
    this.state.medium.methods
      .createBlog(blog.name, blog.email, blog.title, blog.content)
      .send({ from: this.state.account })
      .then((result) => {
        this.setState({
          showNewBlogModal: false,
        });
        this.setState({
          notificationMsg:
            "Blog has published on block number " + result.blockNumber,
          showNotification: true,
          notificationType: "s",
        });
      })
      .catch((err) => {
        this.setState({
          notificationMsg: getErrorMsg(err.message),
          showNotification: true,
          notificationType: "e",
        });
      });
  }

  async showUserBlogs(id) {
    if (this.state.users[id] === undefined) {
      if (this.state.user == null) {
        this.setState({
          users: { ...this.state.users, [id]: {} },
        });
      } else {
        let blogIds = await this.state.medium.methods
          .getBlogIdsByUserId(id)
          .call({ from: this.state.account });
        if (!this.state.users[id])
          this.setState({
            users: { ...this.state.users, [id]: {} },
          });
        let newBlogs = {};
        for (let i = 0; i < blogIds.length; i++) {
          const blogId = blogIds[i];
          newBlogs[blogId] = this.state.blogs[blogId];
        }
        this.setState({
          users: {
            ...this.state.users,
            [id]: {
              ...this.state.users[id],
              ...newBlogs,
            },
          },
        });
      }
    }
  }

  render() {
    return (
      <div>
        <Loader loader={this.state.loader}></Loader>
        {this.state.loader === false && (
          <div>
            <TopBar
              handleNewBlog={() =>
                this.setState({
                  showNewBlogModal: true,
                })
              }
              user={this.state.user}
            />
            <Snackbar
              open={this.state.showNotification}
              autoHideDuration={5000}
              onClose={() =>
                this.setState({
                  showNotification: false,
                })
              }
              sx={{ width: "600px" }}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                variant="filled"
                onClose={() =>
                  this.setState({
                    showNotification: false,
                  })
                }
                severity={
                  this.state.notificationType === "s" ? "success" : "error"
                }
                sx={{ width: "100%" }}
              >
                {this.state.notificationMsg}
              </Alert>
            </Snackbar>
            <NewBlogModal
              showModal={this.state.showNewBlogModal}
              {...this.state}
              handleCancel={() => {
                this.setState({
                  showNewBlogModal: false,
                });
              }}
              handleSubmit={this.newBlogSubmitClicked}
            />
            <BrowserRouter>
              <Switch>
                <Route
                  exact
                  path="/blog/:id"
                  render={(props) => (
                    <Blog
                      {...this.state.blogs[props.match.params.id]}
                      loader={this.state.loader}
                      handleEditClicked={() =>
                        this.setState({
                          showUpdateModal: true,
                        })
                      }
                      updateBlog={this.updateBlog}
                      showModal={this.state.showUpdateModal}
                      handleCancel={() =>
                        this.setState({
                          showUpdateModal: false,
                        })
                      }
                    />
                  )}
                ></Route>
                <Route
                  exact
                  path="/user/:id"
                  render={(props) => {
                    this.showUserBlogs(props.match.params.id);
                    return (
                      <HomePage
                        blogs={this.state.users[props.match.params.id]}
                      />
                    );
                  }}
                ></Route>
                <Route path="/">
                  <HomePage blogs={this.state.blogs} />
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
        )}
      </div>
    );
  }
}

export default App;
