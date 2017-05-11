# Blue Plus Button

## Introduction

The purpose of this project is to provide a simple React / Redux application
illustrating the full suite of CRUD (Create Read Update and Delete) operations.

Also provided is rough step-by-step instructions on the building of this
project.

## Installation

The system requirements are:

* Node.js <https://nodejs.org/en/>
* Yarn <https://github.com/yarnpkg/yarn>

Download and expand into a directory. From within that direction run:

`yarn install`

## Usage

To run the boilerplate, run the following from the installation directory
and open web browser to <http://localhost:3000>.

`yarn start`

## Step-By-Step Instructions

**Create React App**

This example uses the Create React App generator to provide the React
development environment; follow instructions to create the project.

<https://github.com/facebookincubator/create-react-app>

**Strip Down Generated Application**

Next we will want to strip down the generated application to a barebones
React application, i.e.,

* Delete `src/logo.svg`
* Remove contents of `src/App.css` and `src/index.css`.
* Update `src/App.js` to be as follows:

```
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>Hello World</div>
    );
  }
}
export default App;
```

## License

This project is licensed under the MIT License.
