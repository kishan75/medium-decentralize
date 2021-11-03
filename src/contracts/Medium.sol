pragma experimental ABIEncoderV2;

contract Medium {
  struct UserDetail {
    address id;
    string name;
    string email;
  }

  struct Blog {
    uint256 blockNumber;
    UserDetail createdBy;
    bytes32 id; //generate id from hash of publishedat;
    string title;
    uint256 publishedAt;
    uint256 lastUpdatedAt;
    string content;
  }

  mapping(address => bytes32[]) private userToBlogMapping;
  mapping(bytes32 => Blog) private blogs;
  bytes32[] private blogIds;
  mapping(address => UserDetail) private users;

  event userCreated(address id, string name, string email);
  event blogPublished(Blog thisBlog);
  event userToBlogMappingUpdated(address userId, Blog blog);
  event blogUpdated(bytes32 id, Blog blog);

  function getUser(address id) public view returns (UserDetail memory) {
    return users[id];
  }

  // create user
  function createUser(string memory name, string memory email) private {
    require(
      bytes(name).length > 0,
      "Name can not be blank during user creation"
    );
    require(
      bytes(email).length > 0,
      "Email can not be blank during user creation"
    );
    require(msg.sender != address(0 * 0), "user address should be exist");

    UserDetail memory user = UserDetail(msg.sender, name, email);
    users[msg.sender] = user;
    emit userCreated(
      users[msg.sender].id,
      users[msg.sender].name,
      users[msg.sender].email
    );
  }

  // create blog
  function createBlog(
    string memory name,
    string memory email,
    string memory title,
    string memory content
  ) public {
    UserDetail memory user = getUser(msg.sender);
    if (user.id != msg.sender) {
      createUser(name, email);
      user = getUser(msg.sender);
    }

    require(bytes(title).length > 0, "Blog title can not be blank");
    require(bytes(content).length > 0, "Blog content can not be blank");

    uint256 currentTime = block.timestamp;
    bytes32 id = keccak256(abi.encodePacked(currentTime, user.id));
    Blog memory blog = Blog(
      block.number,
      user,
      id,
      title,
      currentTime,
      currentTime,
      content
    );

    blogs[blog.id] = blog;
    blogIds.push(blog.id);
    emit blogPublished(blogs[blog.id]);
    userToBlogMapping[user.id].push(blog.id);
    emit userToBlogMappingUpdated(user.id, blogs[blog.id]);
  }

  // update blog
  function updateBlog(
    bytes32 blogId,
    string memory title,
    string memory content
  ) public {
    require(blogId != bytes32(0), "Blog id can not be blank");
    require(bytes(title).length > 0, "Blog title can not be blank");
    require(bytes(content).length > 0, "Blog content can not be blank");
    require(
      msg.sender == blogs[blogId].createdBy.id,
      "Only author can update his/her blog"
    );

    blogs[blogId].title = title;
    blogs[blogId].content = content;
    blogs[blogId].lastUpdatedAt = block.timestamp;
    blogs[blogId].blockNumber = block.number;

    emit blogUpdated(blogId, blogs[blogId]);
  }

  //get blog by user
  function getBlogIdsByUserId(address userId)
    public
    view
    returns (bytes32[] memory)
  {
    return userToBlogMapping[userId];
  }

  //get all blog
  function getAllBlogIds() public view returns (bytes32[] memory) {
    return blogIds;
  }

  //get blogs by thier ids
  function getBlogsByIds(bytes32[] memory idList)
    public
    view
    returns (Blog[] memory)
  {
    Blog[] memory blogList = new Blog[](idList.length);
    for (uint256 i = 0; i < idList.length; i++) {
      blogList[i] = blogs[idList[i]];
    }
    return blogList;
  }
}
