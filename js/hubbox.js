/** @jsx React.DOM */

var Repo = React.createClass({
  render: function() {
    var repo = this.props.data;
    return (
      <li>
        {repo.name}
      </li>
    );
  }
});

var Repos = React.createClass({
  getInitialState: function() {
    return {
      repos: []
    };
  },
  render: function() {
    var repoNodes = [];
    this.state.repos.forEach(function(repo) {
      repoNodes.push(
        <Repo data={repo} />
      );
    });
    return <ul>{repoNodes}</ul>;
  }
});

hubbox.repos = React.renderComponent(
  <Repos />,
  document.getElementById("repos")
);

hubbox.callAPI = function(path, callback, params) {
  var script = document.createElement("script");
  script.src = "https://api.github.com" +
    path + "?callback=" +
    (callback || "hubbox.init") +
    "&access_token=" +
    hubbox.config.githubAccessToken +
    (params || "");
  document.head.appendChild(script);
};

hubbox.init = function(resp) {
  hubbox.repos.setState({
    repos: resp.data
  });
};

hubbox.callAPI(
  "/users/" + hubbox.config.user + "/repos",
  "hubbox.init",
  "&per_page=100&sort=pushed"
);
