// Load the correct configuration file according to the 'NODE_ENV' variable
const environment = process.env.NODE_ENV || 'development';
const config = await import(`./env/${environment}.js`);
export default config.default;
