export const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    req.validated = parsed;
    next();
  } catch (error) {
    next(error);
  }
};
