import { Component, OnInit } from '@angular/core';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ImageProvider } from 'src/providers/image.provider';

@Component({
  selector: 'app-volunteer-list',
  templateUrl: './volunteer-list.page.html',
  styleUrls: ['./volunteer-list.page.scss'],
})
export class VolunteerListPage implements OnInit {
  private volunteerList=[];
  navParam: any;
  allVolunteerList=[];
  role: any;

  constructor(
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
    private imageProvider: ImageProvider,
  ) { 
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        console.log('navParam',this.navParam,this.role)
        // this.getVolunteerList();
      }
    });
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {      //get data from previous page
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.navParam = this.router.getCurrentNavigation().extras.state.user;
    //     this.role = this.router.getCurrentNavigation().extras.state.role;
    //     console.log('navParam',this.navParam,this.role)
    //     this.getVolunteerList();
    //   }
    // });

  }

  ionViewWillEnter() {
    if (this.navParam.projId) {
      this.getVolunteerList();
    }

  }

  getVolunteerList() {
    this.loadingProvider.presentLoading();
    this.restProvider.getVolunteerList(this.navParam.projId).then((result:any) => {
      console.log('getVolunteerList',result);
      let p = result.filter(x => x.joinStatus != 'D')
      this.volunteerList = p;
      this.loadingProvider.closeLoading();
    }, (err) => {
     this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  navAddVolunteer() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.navParam,
        from: 'volunteer-list',
        data: null
      }
    };
    console.log('navigationExtras',navigationExtras)
    this.router.navigate(['add-volunteer'], navigationExtras);
  }



}
