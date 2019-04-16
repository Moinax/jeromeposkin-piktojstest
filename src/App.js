import React, { Component } from "react";
import axios from "axios";

import "./App.css";

import ImageList from "./components/ImageList";

async function fetchImages() {
  let images = [];
  try {
    const response = await axios.get("/images");
    images = response.data;
  } catch (e) {
    console.error(e);
  }
  return images;
}
class App extends Component {
  state = {
    images: []
  };
  componentDidMount() {
    fetchImages().then(images => {
      this.setState({ images });
    });
  }
  render() {
    const { images } = this.state;
    return (
      <React.Fragment>
        {/*side pane*/}
        <div className="sidepane col-sm-2 col-md-2 col-lg-2">
          <div className="form">
            <h3>Form</h3>
            <input
              type="file"
              className="form-control"
              placeholder="Upload Your Images"
              name="upload"
            />
            <button id="submit" className="btn btn-default">
              upload
            </button>
            {/*Upload Form here*/}
          </div>
          <hr />
          <div className="assets">
            <h3>Assets</h3>
            <div className="text">
              <h4>Text</h4>
              <button id="addText" className="btn btn-default">
                Add Text
              </button>
            </div>
            <ImageList images={images} />
          </div>
        </div>
        {/*canvas*/}
        <div className="canvas col-sm-8 col-md-8 col-lg-8">
          <div className="block">{/*Add images and texts to here*/}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
