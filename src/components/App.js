import React, { Component } from "react";
import Web3 from "web3";
import HomePage from "./HomePage.js";
import "./App.css";
import Medium from "../abis/Medium.json";
import TopBar from "./TopBar";
import Blog from "./Blog.js";
import UpdateBlogModal from "./UpdateBlogModal.js";
import NewBlogModal from "./NewBlogModal.js";
import { BlogCard } from "./BlogCard.js";
import Loader from "./Loader.js";
import { Route, Router, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { serializeError } from "eth-rpc-errors";

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
    };
    this.newBlogSubmitClicked = this.newBlogSubmitClicked.bind(this);
    this.showUserBlogs = this.showUserBlogs.bind(this);
  }

  async componentDidMount() {
    await this.setBlockchain();
    await this.getUserDetail();
    await this.getBlogIds();
    this.getBlogsFromBlogIdList(this.state.blogIdList).then((result) => {
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
      this.setState({
        loader: false,
      });
    });
  }

  async getUserDetail() {
    let result = await this.state.medium.methods
      .getUser(this.state.account)
      .call();
    let { name, email, id } = result;
    if (email !== "")
      this.setState({
        user: {
          name,
          email,
          id,
        },
      });
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
    const networkData = Medium.networks[networkId];
    if (networkData) {
      let medium = new window.web3.eth.Contract(
        Medium.abi,
        networkData.address,
        { handleRevert: true }
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
    console.log(this.state.medium.methods);
    const blogIds = await this.state.medium.methods
      .getAllBlogIds()
      .call({ from: this.state.account });
    this.setState({ blogIdList: [...this.state.blogIdList, ...blogIds] });
    console.log(blogIds);
  }

  async newBlogSubmitClicked(blog) {
    this.setState({
      loader: true,
    });
    this.state.medium.methods
      .createBlog(blog.name, blog.email, blog.title, blog.content)
      .send({ from: this.state.account, handleRevert: true }, (err, hash) => {
        console.log(this.state.medium.options.handleRevert);
        console.log(err, hash, "--------");
      });
  }

  async showUserBlogs(id) {
    if (this.state.users[id] == undefined) {
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
        {this.state.loader == false && (
          <div>
            <TopBar
              handleNewBlog={() =>
                this.setState({
                  showNewBlogModal: true,
                })
              }
              user={this.state.user}
            />
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
            <Loader loader={this.state.loader}></Loader>
            <BrowserRouter>
              <Switch>
                <Route
                  exact
                  path="/blog/:id"
                  render={(props) => (
                    <Blog
                      {...this.state.blogs[props.match.params.id]}
                      loader={this.state.loader}
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
