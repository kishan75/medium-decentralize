const { assert } = require("chai");

const Medium = artifacts.require("./Medium.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Medium", ([deployer, author, tipper]) => {
  let medium;
  let accounts;

  before(async () => {
    medium = await Medium.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await medium.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    // it('has a name', async () => {
    //   const name = await medium.name()
    //   assert.equal(name, 'Medium')
    // })
  });

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log(" these are accounts  ");
    console.log(accounts);
  });

  describe("blogs", async () => {
    let result;
    it("creates blogs", async () => {
      const name = "Ravindra";
      const email = "Ravindtrababu@gmail.com";
      const title = "how to write smart contract";
      const content = "you will know the things";
      result = await medium.createBlog(name, email, title, content);
      assert.equal(result.logs[0].args["name"], name);
      assert.equal(result.logs[0].args["email"], email);
      assert.equal(result.logs[1].args["thisBlog"]["title"], title);
      assert.equal(result.logs[1].args["thisBlog"]["content"], content);
      console.log(result.logs[0].args, result.logs[1].args);
    });

    it("update blogs", (done) => {
      const title = "to update";
      const content = "updated content";
      setTimeout(async () => {
        result = await medium.updateBlog(
          result.logs[1].args["thisBlog"].id,
          title,
          content
        );
        console.log(result.logs[0]);
        done();
      }, 5000);
    });

    // it("creates blogs", async () => {
    //   let address = accounts[0];
    //   result = await medium.createBlog(
    //     "",
    //     "",
    //     "testing 2",
    //     "test 2 description"
    //   );
    //   console.log(result);
    // });

    // it("get a blogs", async () => {
    //   result = await medium.getBlogs();
    //   console.log(result);
    // });

    it("get All blogs", async () => {
      let idList = await medium.getAllBlogIds();
      let blogList = await medium.getBlogsByIds(idList);
      console.log(blogList);
    });
  });
});
