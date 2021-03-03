module.exports = () => {
  return {
    postcssPlugin: 'veryimportant',
    Decl (decl) {
      decl.important = true
    }
  }
}
module.exports.postcss = true
