class TraitBuilder {
  constructor (superclass) {
    this.superclass = superclass || class {}
  }

  use (...traits) {
    return traits.reduce((c, trait) => trait(c), this.superclass)
  }
}

export const Trait = (superclass) => new TraitBuilder(superclass)
