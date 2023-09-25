import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BinModel } from 'src/app/core/models/bin.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { BinService } from 'src/app/core/services/bin.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  lixeiras = new Observable<BinModel[]>;
  dataMap: { [key: string]: any } = {};
  userBins: any[] = [];
  porcentagem: { [key: string]: any } = {};
  isLoading: boolean = false

  constructor(
    public authService: AuthService,
    private binService: BinService,
    private router: Router
  ) {
    this.getUserBins();
  }

  getUserBins(){
    this.isLoading = true
    this.binService.getUserBins().subscribe(userBins => {
      this.userBins = userBins;
        userBins.forEach(userBin => {
          if(userBin.code != null) {
            this.binService.getBin(userBin.code).snapshotChanges()
            .subscribe((datas) =>
                datas.map(data => {
                  let bin = Object.assign(userBin, data.payload.val());
                  this.dataMap[userBin.code] = bin;
                  this.porcentagem[userBin.code!] =
                    bin.distance > bin.binHeight || bin.timestamp == null
                    ? 0
                    :  bin.distance <= 0
                      ? 100
                      : 100 - (bin.distance / bin.binHeight * 100)
                })
              );
          }
        });
        this.isLoading = false
    });
  }

  signOut() {
    this.authService.signOut();
  }

  delete(key: string, code: string) {
    this.binService.deleteUserBin(key, code);
  }

  goTo(url: string, bin: BinModel | null = null): void {
    let commands: any[] = [url];
    if(bin != null) commands.push(bin);
    this.router.navigate(commands);
  }
}
