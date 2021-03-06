import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  private projectList;
  private navParam: any;
  private role: any;
  personId: any;
  filterTerm: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private storage: Storage,
  ) {

   }

  ngOnInit() {
    this.storage.get('defaultPersonId').then((val:any) => {
      this.personId = val
      this.displayBasedRole()
    })
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.action;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        console.log('navParam',this.navParam,this.role)
      }
    });
  }

  displayBasedRole() {
    if (this.navParam == 'join') {
      this.getListProjects();
    }
    else {
      if (this.role == 'staff') {
        this.getStaffInvolved(); //for staff flow
      }
      else {
        this.getVolunteerInvolved();
      }

    }
  }

  navNextPage(data) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data,
        action: this.navParam,
        role: this.role
      }
    };
    this.router.navigate(['project-detail'], navigationExtras);
  }



  getStaffInvolved() {
    this.loadingProvider.presentLoading();
    this.restProvider.getStaffProjectList(this.personId).then((result:any) => {
      this.projectList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }


  getListProjects() {
      this.loadingProvider.presentLoading();
      this.storage.get('personOrgs').then((val:any) => {
      this.restProvider.getProjectList(val).then((result:any) => {
        this.projectList = result;
        this.loadingProvider.closeLoading();
      }, (err) => {
        this.loadingProvider.closeLoading();
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    })
  }

  getVolunteerInvolved() {
    this.loadingProvider.presentLoading();
    this.restProvider.getProjectInvolvedList(this.personId).then((result:any) => {
      this.projectList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }


}
