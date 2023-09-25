import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { map } from "rxjs";
import { UserBinModel } from "../models/user-bin.model";

@Injectable({
  providedIn: 'root'
})
export class BinService {
  private basePath = '/users';
  uid: string | null | undefined = null;

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.uid = sessionStorage.getItem('uid');
}

  // Users
  getUserBins() {
    return this.db.list(`${this.basePath}/${this.uid}/bins`)
    .snapshotChanges().pipe(map(items => items.map(item =>
      Object.assign({key: Object.keys(item.payload.val() as object)[0],
        code: item.payload.key,},Object.values(item.payload.val() as object)[0]))));
  }

  getUserBin(code: string) {
    return this.db.list(`${this.basePath}/${this.uid}/bins/${code}`);
  }

  addUserBins(code: string, userBin: UserBinModel) {
    return this.db.list(`${this.basePath}/${this.uid}/bins/${code}`)?.push(userBin);
  }

  updateUserBin(key: string, code: string, userBin: UserBinModel){
    return this.db.object(`${this.basePath}/${this.uid}/bins/${code}/${key}`).update(userBin);
  }

  deleteUserBin(key: string, code: string) {
    this.db.object(`${this.basePath}/${this.uid}/bins/${code}/${key}`).remove();
  }

  // Bins
  getBin(code: string) {
    return this.db.list(`/bins/${code}`);
  }

  addBin(code: string) {
    return this.db.list(`/bins/${code}`)?.set(code,{percentage: 0});
   // return this.db.list(`/bins/${code}`)?.push({percentage: 0});
  }
}
