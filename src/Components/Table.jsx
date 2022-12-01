import React, { Component } from "react";
import Swal from "sweetalert2";
import http from "./services/httpService";
import config from "./Config.json";
import { toast } from "react-toastify";
import { getPosts } from "./services/postServices";

export default class Table extends Component {
  state = {
    posts: [],
  };
  async componentDidMount() {
    try {
      const { data: posts } = await getPosts();
      console.log(posts);
      this.setState({ posts });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("not found");
      else console.log("Unexpected error: " + ex);
    }
  }
  handleAdd = async (e) => {
    e.preventDefault();
    const obj = { title: "Tested", body: "Testing..." };
    const { data: post, status } = await http.post(config.apiEndpoint, obj);
    if (status === 201) {
      Swal.fire({
        title: "Success!",
        text: "Successfully Stored.",
        icon: "success",
        confirmButtonText: "OK",
      });
      const posts = [post, ...this.state.posts];
      this.setState({ posts });
    }
  };
  handleUpdate = async (post) => {
    const originalPosts = this.state.posts;

    post.title = "updated";
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });

    try {
      await http.put(`${config.apiEndpoint}/${post.id}`, post);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast("This post is already deleted!");
        this.setState({ posts: originalPosts });
      }
    }
  };
  handleDelete = async (post) => {
    const originalPosts = this.state.posts;
    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });
    try {
      await http.delete(`${config.apiEndpoint}/${post.id}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast("This post has already been deleted.");
      this.setState({ posts: originalPosts });
    }
  };
  render() {
    return (
      <>
        <div className="modal" id="postModel" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleAdd}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      aria-describedby="title"
                    />
                    <div id="title" className="form-text">
                      We'll never share your email with anyone else.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="body" className="form-label">
                      Body
                    </label>
                    <input type="text" className="form-control" id="body" />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row py-4">
            <div className="col-12 py-4 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#postModel"
              >
                Add
              </button>
            </div>
            <div className="col-md-4">
              <div className="list-group">
                <button
                  type="button"
                  className="list-group-item list-group-item-action active"
                  aria-current="true"
                >
                  ALL
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                >
                  A second button item
                  <span className="badge bg-primary rounded-pill">14</span>
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                >
                  A third button item
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                >
                  A fourth button item
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  disabled
                >
                  A disabled button item
                </button>
              </div>
            </div>
            <div className="col-md-8">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Body</th>
                    <th scope="col">Update</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.posts &&
                    this.state.posts.map((post) => {
                      return (
                        <tr key={post.id}>
                          <th scope="row">{post.id}</th>
                          <td>{post.title}</td>
                          <td>{post.body}</td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() => this.handleUpdate(post)}
                            >
                              Update
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => this.handleDelete(post)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
