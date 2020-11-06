# TON Blockchain Explorer

## Development
To develop or build this project, **yarn** is required. You can install yarn by using `npm install -g yarn`.

The TON Blockchain Explorer was developed using NuxtJS - https://nuxtjs.org/

To set up the project for development you can clone this repository using `git clone <repo-url>` and navigate your terminal into the project directory. Then run the following commands:
```
# Install all required dependecies
$ yarn

# Run the project locally on your system
$ yarn dev
```
Now you can visit `http://localhost:3000` to view the project and develop with hot reload and instant style changes. For more info on how to develop using NuxtJS visit: https://nuxtjs.org/docs/2.x/get-started/installation


## Build for Production
To get this project up and running on your production server you can use one of these two methods:
### Method 1:
```
# Make sure you have yarn installed on your server. You can check it by using
$ yarn -v

# Clone your repo on your server using git
$ git clone <repo-url>
$ cd <repo-name>

# Install all required dependecies
$ yarn

# Build the App using
$ yarn generate
```
If there are no errors generating the app you should see a `dist` folder inside your project root directory.
Now you can point your web-server to the generated `dist` folder using **apache** or the following nginx config:
```
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
}
```
---

### Method 2:
```
# Install all required dependecies
$ yarn

# Build the App using
$ yarn generate
```
If there are no errors generating the app you should see a `dist` folder inside your project root directory.
Now you can copy the content of the generated `dist` folder to your web-server and use **apache** or the following nginx config to point into the directory you uploaded the files to:
```
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
}
```
