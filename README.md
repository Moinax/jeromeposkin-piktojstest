## Take Home Test from Piktochart [Javascript]

This is a test done for job at Piktochart

### Instructions

You are required to implement a single page application that allows user to add text and image into canvas.

### Features

Below are the basic features for the application:

* user can see the existing images from folder images to the images list
* user can upload image to folder images and directly added to images list
* user can add image / text from the menu to the canvas
* user can move and delete the image / text inside the canvas
* the created objects on canvas can be saved and repopulated on refresh browser

You may refer to Piktochart Editor page of how this test should look like.

### Development

To run the project in development

1. Run the server provided by Piktochart
2. Run the application locally

    ```bash
    npm i
    npm run start
    ```

In development, we use a `proxy` in `package.json` to avoid CORS errors.

### Production

To run the project in production

1. Build the application

    ```bash
    npm i
    npm run build
    ```

2. Copy the content of the `build` directory in the 
`root` directory of the server
3. Run the server provided by Piktochart

In production, the `index.html` file will override the default one provided by PiktoChart
so no `proxy` will be necessary as the files are served by the same server.
