let id = 0;

export class User {
  constructor() {
    this.id = 0;
    this.name = "";
    this.displayName = "";
  }

  create() {
    return new User();
  }

  load(dto) {}
}
