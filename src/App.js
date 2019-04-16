import React, { Component } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import shortid from "shortid";

import "./App.css";

import ImageUploader from "./components/ImageUploader";
import ImageList from "./components/ImageList";
import TextObject from "./components/TextObject";
import ImageObject from "./components/ImageObject";

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

const canvasStorage = window.localStorage.getItem('canvas');
const initialObjects = canvasStorage ? JSON.parse(canvasStorage) : {};

class App extends Component {
  state = {
    images: [],
    objects: initialObjects,
    selectedKey: null
  };
  componentDidMount() {
    fetchImages().then(images => {
      this.setState({ images });
    });
    document.addEventListener("keydown", this.onKeyDown);
    this.saveInterval = setInterval(() => {
      window.localStorage.setItem("canvas", JSON.stringify(this.state.objects));
    }, 10 * 1000);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
    clearInterval(this.saveInterval);
  }

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
  addObjectItem = item => {
    const key = shortid.generate();
    const nextObjects = { ...this.state.objects };
    nextObjects[key] = { ...item, key };
    this.setState({ objects: nextObjects });
  };
  updateObjectPosition = (key, x, y) => {
    const nextObjects = { ...this.state.objects };
    nextObjects[key] = {
      ...nextObjects[key],
      x,
      y
    };
    this.setState({ objects: nextObjects });
  };
  removeObject = key => {
    const nextObjects = { ...this.state.objects };
    delete nextObjects[key];
    this.setState({ selectedKey: null, objects: nextObjects });
  };
  onKeyDown = event => {
    if (event.code === "Delete") {
      this.removeObject(this.state.selectedKey);
    }
  };
  addTextObject = e => {
    e.preventDefault();
    this.addObjectItem({ type: "text", value: "This is a text", x: 0, y: 0 });
  };
  addImageObject = src => {
    this.addObjectItem({ type: "image", value: src, x: 0, y: 0 });
  };
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
