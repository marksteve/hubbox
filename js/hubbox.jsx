/** @jsx React.DOM */

var User = React.createClass({
  render: function() {
    var user = this.props.data;
    return (
      <div className="user">
        <div className="user-name">
          <a href={user.html_url}>
            <img src={user.avatar_url} />
            {user.name} ({user.login})
          </a>
        </div>
        <div className="user-info">
          <span className="user-followers">
            <span className="oi" data-glyph="people"></span>
            {user.followers} followers
          </span>
          <span className="user-following">
            <span className="oi" data-glyph="people"></span>
            {user.following} following
          </span>
          <span className="user-company">
            <span className="oi" data-glyph="briefcase"></span>
            {user.company}
          </span>
          <span className="user-location">
            <span className="oi" data-glyph="location"></span>
            {user.location}
          </span>
          <span className="user-blog">
            <span className="oi" data-glyph="link-intact"></span>
            <a href={user.blog}>{user.blog}</a>
          </span>
        </div>
      </div>
    );
  }
});

var Repo = React.createClass({
  render: function() {
    var repo = this.props.data;
    var classes = {
      "repo": true,
    };
    classes["lang-" + (repo.language || "unknown").toLowerCase()] = true;
    var className = React.addons.classSet(classes);
    var fork = repo.fork ? (
      <span className="oi" data-glyph="fork"></span>
    ) : "";
    return (
      <div className={className}>
        <h3>
          <a href={repo.html_url}>{repo.name}</a> {fork}
        </h3>
        <small className="repo-lang">{repo.language || ""}</small>
        <p className="repo-desc">{repo.description}</p>
        <div className="repo-stats">
          <small>
            <span className="oi" data-glyph="star"></span>
            {repo.stargazers_count}
          </small>
          <small>
            <span className="oi" data-glyph="eye"></span>
            {repo.watchers_count}
          </small>
          <small>
            <span className="oi" data-glyph="fork"></span>
            {repo.forks_count}
          </small>
          <small>
            <span className="oi" data-glyph="warning"></span>
            {repo.open_issues_count}
          </small>
        </div>
      </div>
    );
  }
});

var Repos = React.createClass({
  getInitialState: function() {
    return {
      repos: []
    };
  },
  componentDidUpdate: function() {
    this.msnry && this.msnry.destroy();
    this.msnry = new Masonry(
      this.getDOMNode(),
      {
        columnWidth: 50,
        itemSelector: ".repo"
      }
    );
  },
  render: function() {
    var repoNodes = [];
    this.state.repos.forEach(function(repo) {
      repoNodes.push(
        <Repo key={repo.full_name} data={repo} />
      );
    });
    return <div>{repoNodes}</div>;
  }
});

hubbox.callAPI = function(path, callback, params) {
  var script = document.createElement("script");
  script.src = "https://api.github.com" + path +
    "?callback=" + callback +
    "&access_token=" + hubbox.config.githubAccessToken +
    (params || "");
  document.head.appendChild(script);
};

hubbox.renderUser = function(resp) {
  hubbox.user = React.renderComponent(
    <User data={resp.data} />,
    document.getElementById("user")
  );
};

hubbox.repos = React.renderComponent(
  <Repos />,
  document.getElementById("repos")
);

hubbox.setRepos = function(resp) {
  hubbox.repos.setState({
    repos: resp.data
  });
};

hubbox.callAPI(
  "/users/" + hubbox.config.user,
  "hubbox.renderUser"
);

hubbox.callAPI(
  "/users/" + hubbox.config.user + "/repos",
  "hubbox.setRepos",
  "&per_page=100&sort=pushed"
);
