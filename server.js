const express = require('express');

const app = express();

app.get('/build/*.js', (req, res, next) => {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'application/javascript');
  next();
});

app.use('/plugins', express.static(`${__dirname}/assets/plugins`));
app.use('/pages', express.static(`${__dirname}/pages`));
app.use('/img', express.static(`${__dirname}/assets/img`));
app.use('/ico', express.static(`${__dirname}/assets/ico`));
app.use('/files', express.static(`${__dirname}/assets/files`));
app.use('/css', express.static(`${__dirname}/assets/css`));
app.use('/build', express.static(`${__dirname}/build`));

// redirect to https
function enforceHttps(req, res, next) {
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV === 'production'
  ) {
    res.redirect(301, `https://${req.get('host')}${req.url}`);
  } else {
    next();
  }
}

app.use(enforceHttps);

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

app.listen(process.env.PORT || 8000);
