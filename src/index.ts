import app from './app';
import Logger from './library/Logger';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable no-console */
  Logger.debug(`Server is up and running @ http://localhost:${port}`);
  /* eslint-enable no-console */
});
