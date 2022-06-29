/*
===============================================================================
IMPORTS
===============================================================================
*/
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;

const logger = require('morgan');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// prismic imports
const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');

const UAParser = require('ua-parser-js');

/*
===============================================================================
MIDFDLEWARES CONFIG
===============================================================================
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}
app.use(express.static(path.join(__dirname, 'dist')));

/*
===============================================================================
PRISMIC CONFIG
===============================================================================
*/
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req,
  });
};

/*
===============================================================================
PRISMIC LINK RESOLVER
===============================================================================
*/
const handleLinkResolver = (doc) => {
  // if (doc.type === "product") {
  //   return `/detail/${doc.slug}`;
  // }
  // if (doc.type === "collections") {
  //   return "/collections";
  // }
  // if (doc.type === "about") {
  //   return "/about";
  // }

  return '/';
};

/*
===============================================================================
PRISMIC MIDDLEWARE
===============================================================================
*/
app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent']);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === 'mobile';
  res.locals.isTablet = ua.device.type === 'tablet';

  res.locals.Link = handleLinkResolver;

  res.locals.Numbers = (index) => {
    return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '';
  };

  res.locals.PrismicDOM = PrismicDOM;

  next();
});

/*
===============================================================================
SET VIEW ENGINE
===============================================================================
*/
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

/*
===============================================================================
DEFAULT REQUEST HANDLER
===============================================================================
*/
const handleRequest = async (api) => {
  const home = await api.getSingle('home');
  const meta = await api.getSingle('metadata');
  const preloader = await api.getSingle('preloader');

  const assets = [];

  // home.data.gallery.forEach((item) => {
  //   assets.push(item.image.url);
  // });
  home.data.body.forEach((section) => {
    if (section.slice_type === 'gallery') {
      section.items.forEach((item) => {
        assets.push(item.galleryimage.url);
      });
    }
  });

  return {
    assets,
    home,
    meta,
    preloader,
  };
};

/*
===============================================================================
ROUTES
===============================================================================
*/
// homepage
app.get('/', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  res.render('pages/home', {
    ...defaults,
  });
});

/*
===============================================================================
START THE EXPRESS SERVER
===============================================================================
*/
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
