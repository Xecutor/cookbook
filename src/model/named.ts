export interface Named {
    name:string
}

export function namedEq(a:Named, b:Named) {
    return a.name == b.name
}