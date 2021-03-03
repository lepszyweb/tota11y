module.exports = () => {
  return {
    postcssPlugin: 'veryimportant',
    Declaration (decl) {
      decl.important = true
    }
  }
}
module.exports.postcss = true
