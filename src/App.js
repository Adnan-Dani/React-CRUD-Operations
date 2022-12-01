import Layout from './Layout/Layout';
import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default class App extends Component {


  render() {
    return (
      <>
        <ToastContainer />
        <Layout />
      </>
    )
  }
}
