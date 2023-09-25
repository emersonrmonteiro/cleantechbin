import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BinService } from '../../../core/services/bin.service';

@Component({
  templateUrl: './bin-new.component.html',
  styleUrls: ['./bin-new.component.css'],
})
export class BinNewComponent implements OnDestroy {
  code: string | null = null;
  name: string | null = null;
  binHeight: number | null = null;
  description: string | null = null;
  subscriber: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private binService: BinService,
    private router: Router
  ) {
  }

ngOnDestroy(): void {
  this.subscriber.unsubscribe();
}

  addBin() {
    if(this.code == null || this.name == null) return;
    this.subscriber = this.binService.getUserBin(this.code).valueChanges().subscribe(userBin =>{
      if(userBin.length == 0) {
        this.binService.addUserBins(this.code!,{
          name: this.name!,
          binHeight: this.binHeight,
          description: this.description,
        })?.then(_ => {
          this.router.navigate(['./dashboard']);
        });
      }else{
        this.binService.getBin(this.code!).valueChanges().subscribe(bin =>{
        if(bin.length == 0){
          this.binService.addBin(this.code!)?.then(_ => {
            this.router.navigate(['./dashboard']);
          });
        }
      });
      }
    });
  }
}
