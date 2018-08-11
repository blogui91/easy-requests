class TraitBuilder {
  constructor (superclass) {
    this.superclass = superclass || class {}
  }

  with (...traits) {
    return traits.reduce((c, trait) => trait(c), this.superclass)
  }
}

export const trait = (superclass) => new TraitBuilder(superclass)
