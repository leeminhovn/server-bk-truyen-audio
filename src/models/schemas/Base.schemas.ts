export class BaseSchema {
  created_at: Date | undefined;
  updated_at: Date | undefined;
  constructor(
    created_at_props: Date | undefined,
    updated_at_props: Date | undefined,
  ) {
    const dateNow = new Date();

    this.created_at = created_at_props || dateNow;
    this.updated_at = updated_at_props || dateNow;
  }
}
