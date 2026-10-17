<h1 align="center">
  <br>
  <a href="https://yum-food.herokuapp.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Egyptian_food_Koshary.jpg/220px-Egyptian_food_Koshary.jpg" alt="yum-food" width="200"></a>
  <br>
  Yum Foods
  <br>
</h1>
 
<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

## Key Features

- Orders
  - Instantly see all orders.
  - Filter orders
  - Make multiple orders at once
  - Edit previous order before admin sees it
- Cart
  - Save item for later purchase
  - Enable use even when logged out
- Menu
  - Add review for a menu
  - Filter menu
- CI/CD integrated
  - Duly tested endpoints and models
  - Fully set up dev ops
- Interactive Design
  - Engaging UI
  - Interactive and responsive UI
  - Enhanced UX

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) v15+ (which comes with [npm](http://npmjs.com)) installed on your computer. Also create an account with cloudinary and any mongodb provider, then add required credentials to the .env file created from the command below.From your command line:

```bash
# Clone this repository
$ git clone https://github.com/chyke007/Yum-food.git

# Go into the repository
$ cd Yum-food

# Copy environment variable
$ cp .env.example .env && cp frontend/.env.example frontend/.env

# Install dependencies
$ npm install

# Seed default users and build frontend
npm run heroku-postbuild

# Run the app
$ npm start
```

## Credits

This application uses the following open source packages:

- [Tailwind](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [ExpressJs](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://www.mongodb.com/)
- [Redux](https://redux.js.org/)
- [Jest](https://jestjs.io/)
- [Coveralls](https://coveralls.io/)
- [Travisci](https://travis-ci.org/)
