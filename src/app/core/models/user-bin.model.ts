export class UserBinModel {
  public name: string;
  public binHeight: number | null;
  public description: string | null;

  constructor(
    name: string,
    binHeight: number | null,
    description: string | null,
    )
  {
    this.name = name;
    this.binHeight = binHeight;
    this.description = description;
  }
}
