'use strict';

module.exports = (router, restypieOptions = {}) => {
  if (!router) {
    throw new Error(`router is required`);
  }
  return Object.assign({}, restypieOptions, {
    route(method, path, handlers) {
      router[method](path, ...handlers);
    },
    createBundleHandler(url) {
      return function *(next) {
        if (this.request.body) this.req.body = this.request.body;
        this.req.params = this.params; // Copy params so that we don't have to parse them
        this.req.query = this.query;
        this.state.bundle = new Restypie.Bundle({ req: this.req, res: this.res, url });
        yield next;
      };
    },
    createHandler(handler) {
      return function *(next) {
        yield handler(this.state.bundle);
        yield next;
      };
    }
  });
};