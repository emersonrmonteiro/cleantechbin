import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BinService } from 'src/app/core/services/bin.service';

@Component({
  templateUrl: './bin-details.component.html',
  styleUrls: ['./bin-details.component.css'],
})
export class BinDetailsComponent {
  key: string | null = null;
  code: string | null = null;
  name: string | null = null;
  binHeight: number | null = null;
  description: string | null = null;
  uid: string | null | undefined = null;
  constructor(
    private route: ActivatedRoute,
    public auth: AngularFireAuth,
    private binService: BinService,
    private router: Router) {
    this.key = this.route.snapshot.params['key'];
    this.code = this.route.snapshot.params['code'];
    this.name = this.route.snapshot.params['name'];
    this.binHeight = this.route.snapshot.params['binHeight'];
    this.description = this.route.snapshot.params['description'];
    this.auth.authState.subscribe((user) => {
      this.uid = user?.uid;
    })
  }

  save() {
    if(this.code != null && this.name != null && this.uid != null)
    this.binService.updateUserBin(this.key!, this.code, {
      name: this.name,
      binHeight: this.binHeight,
      description: this.description,
    })?.then(_ => {

      this.router.navigate(['./dashboard']);
    });
  }
}
