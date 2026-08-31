export default {
  multipass: true,
  js2svg: {
    pretty: false,
    indent: 0,
  },
  plugins: [
    {
      name: "preset-default",
      params: {
        floatPrecision: 5,
        overrides: {
          cleanupIds: false,
          removeHiddenElems: false,
          removeUselessDefs: false,
        },
      },
    },
  ],
};
