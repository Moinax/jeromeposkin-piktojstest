import React, { Component } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import shortid from "shortid";

import "./App.css";

import ImageUploader from "./components/ImageUploader";
import ImageList from "./components/ImageList";
import TextObject from "./components/TextObject";
import ImageObject from "./components/ImageObject";

// Get the previous canvas object from the local storage
const canvasStorage = window.localStorage.getItem("canvas");
const initialObjects = canvasStorage ? JSON.parse(canvasStorage) : {};

class App extends Component {
  state = {
    // Array of images provided by the server during the component mount
    images: [],
    // Canvas objects available in the local storage, if any
    objects: initialObjects,
    // The key of the current selected canvas object
    selectedKey: null
  };
  componentDidMount() {
    // Fetch the images available in the server
    this.fetchImages();
    // Handle keyboard events to be able to delete selected canvas object
    document.addEventListener("keydown", this.onKeyDown);
    // Automatic backup of the canvas in the local storage
    this.saveInterval = setInterval(() => {
      window.localStorage.setItem("canvas", JSON.stringify(this.state.objects));
    }, 10 * 1000);
  }

  componentWillUnmount() {
    // Remove the keyboard listener when unmounting the component
    document.removeEventListener("keydown", this.onKeyDown);
    // Clear the interval to avoid extra backup to the local storage
    clearInterval(this.saveInterval);
  }
  /**
   * Fetch an array of images from the server and add them to the state
   * @returns {Promise<Array>}
   */
  fetchImages = async () => {
    let images = [];
    try {
      const response = await axios.get("/images");
      images = response.data;
    } catch (e) {
      console.error(e);
    }
    this.setState({ images });
  };

  /**
   * Upload a file to the server and add the new file to the state
   */
  uploadFile = async file => {
    try {
      const data = new FormData();
      data.append("upload", file);
      const response = await axios.post("/uploads", data);
      this.setState({ images: [...this.state.images, response.data.file] });
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  /**
   * Add an object to the canvas objects list
   */
  addObjectItem = item => {
    const key = shortid.generate();
    const nextObjects = { ...this.state.objects };
    nextObjects[key] = { ...item, key };
    this.setState({ objects: nextObjects });
  };
  /**
   * Update the position of a canvas object each time it is moved
   */
  updateObjectPosition = (key, x, y) => {
    const nextObjects = { ...this.state.objects };
    nextObjects[key] = {
      ...nextObjects[key],
      x,
      y
    };
    this.setState({ objects: nextObjects });
  };
  /**
   * Remove an object from the canvas
   */
  removeObject = key => {
    const nextObjects = { ...this.state.objects };
    delete nextObjects[key];
    this.setState({ selectedKey: null, objects: nextObjects });
  };
  /**
   * Handle keyboard event and remove the selected object if the "Delete" key is pressed
   */
  onKeyDown = event => {
    if (event.code === "Delete") {
      this.removeObject(this.state.selectedKey);
    }
  };
  /**
   * Add a "text" object to the canvas objects list
   */
  addTextObject = e => {
    e.preventDefault();
    this.addObjectItem({ type: "text", value: "This is a text", x: 0, y: 0 });
  };
  /**
   * Add an "image" object to the canvas objects list
   */
  addImageObject = src => {
    this.addObjectItem({ type: "image", value: src, x: 0, y: 0 });
  };
  /**
   * Store the key of the current selected object
   */
  selectObject = key => {
    this.setState({ selectedKey: key });
  };
  render() {
    const { images, objects, selectedKey } = this.state;
    return (
      <React.Fragment>
        {/*side pane*/}
        <div className="sidepane col-sm-2 col-md-2 col-lg-2">
          <ImageUploader onSubmit={this.uploadFile} />
          <hr />
          <div className="assets">
            <h3>Assets</h3>
            <div className="text">
              <h4>Text</h4>
              <button
                id="addText"
                className="btn btn-default"
                onClick={this.addTextObject}
              >
                Add Text
              </button>
            </div>
            <ImageList images={images} onClick={this.addImageObject} />
          </div>
        </div>
        {/*canvas*/}
        <div className="canvas col-sm-8 col-md-8 col-lg-8">
          <div className="block">
            {/*Add images and texts to here*/}
            {Object.values(objects).map(item => (
              <Draggable
                key={item.key}
                defaultPosition={{ x: item.x, y: item.y }}
                bounds="parent"
                onStop={(e, data) =>
                  this.updateObjectPosition(item.key, data.x, data.y)
                }
                onMouseDown={() => this.selectObject(item.key)}
              >
                <div
                  className={`item${
                    selectedKey === item.key ? " selected" : ""
                  }`}
                >
                  {item.type === "text" && <TextObject text={item.value} />}
                  {item.type === "image" && <ImageObject src={item.value} />}
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
