export class BaseSchema {
  created_at: Date | undefined;
  updated_at: Date | undefined;
  constructor() {
    const dateNow = new Date();
    this.created_at = dateNow;
    this.updated_at = dateNow;
  }
}
