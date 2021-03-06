import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, Platform, ToastController, NavController } from '@ionic/angular';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { AlertProvider } from 'src/providers/alert-provider';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { LoadingProvider } from 'src/providers/loading-provider';
//As we are mixing TypeScript and vanilla Javascript
//we will get an error “Cannot find name google”
//Typescript doesn’t know how to interpret object google.
declare var google;

@Component({
  selector: 'app-sos-sender',
  templateUrl: './sos-sender.page.html',
  styleUrls: ['./sos-sender.page.scss'],
})
export class SosSenderPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  lat: any;
  lng: any;
  personid: any;
  contactList:any;
  personName: any;
  profilePictUrl: any;
  oaid: any;
  pushList: any = [];
  andList: any = [];
  iosList: any = [];
  timeoutHandler: any;
  app: any;
  sos_type: any;
  adrs: any;

  // lat: number = 51.678418;
  //   lng: number = 7.809007;
  //   zoom: number = 18;
  //   mapReady(map: any) {
  //     map.panBy(0, 150);
  //   }

  constructor(
    public alertCtrl: AlertController,
    public  restProvider: RestProvider,
    private storage: Storage,
    private toastCtrl: ToastController,
    public modalController: ModalController,
    public platform: Platform,
    private navCtrl: NavController,
    private router: Router,
    private alertProvider: AlertProvider,
    private callNumberProvider: CallNumberProvider,
    private loadingProvider: LoadingProvider
    ) {
      this.sos_type = this.router.getCurrentNavigation().extras.state.sos_type;
      this.lat = this.router.getCurrentNavigation().extras.state.lat;
      this.lng = this.router.getCurrentNavigation().extras.state.lng;
      this.adrs = this.router.getCurrentNavigation().extras.state.adrs;
     }

    ionViewWillEnter(){ //used ionViewWillEnter to load map earlier
    this.platform.backButton.subscribe(() => {
      console.log('hardware back button');
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      console.log('activeView', activeView);
      if(activeView.id === "SosSender"){
        this.forceStop();
      }else{
        nav.pop();
      }
    });

    this.storage.get('defaultPersonId').then((val:any) => {
      console.log(val);
      this.personid = val;
      this.getContact();
    });
    this.storage.get('defaultProfile').then((val:any) => {
      console.log(val);
      this.personName = val.name;
    });
    this.storage.get('profilePictUrl').then((val:any) => {
      this.profilePictUrl = val;
      console.log(this.profilePictUrl );
    });
    this.storage.get('oaid').then((val:any) => {
      this.oaid = val;
    });
    this.initMap();
  }

  ngOnInit() {

  }

  async forceStop() {
    console.log('forceStop enter')
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alert!',
      subHeader: 'Are you sure you want to stop this SOS emergency?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: data => {
            clearInterval(this.timeoutHandler);
            this.timeoutHandler = null;
            this.stop();
          }
        }
      ]
    });
    await alert.present();
  }

  getContact(){
    this.restProvider.getEmergencyList(this.personid).then((result:any) => {
      console.log(result);
      this.contactList = result;
    }, (err) => {
      console.log(err);
    });
  }

  async showCheckbox() {
    console.log('showCheckbox enter')
    const alert = await this.alertCtrl.create({
      header: 'Emergency Call',
      message: 'Beware! You are about to call your emergency number',
      inputs:[
        {
          type:'checkbox',
          label: 'Yes, Im above 18 years old',
          value: 'true',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',

        }
        , {
          text: 'CALL',
          handler: async data => {
            console.log('Checkbox data:', data);
            if(data[0] == 'true'){
              this.callEmergency();
            }else{
              let toast = this.toastCtrl.create({
                message: 'You are not above 18 years old',
                duration: 2000,
                position: 'top'
              });

              (await toast).present();
            }
          }
        }
      ]
    });
    alert.present();
  }

  callEmergency(){
    let phoneNumber = '911';
    this.callNumberProvider.dialingFx(phoneNumber)
  }

  timerCountdown(){
    console.log("timerCountdown enter");
    let sec = 0;
    let min = 0;
    this.timeoutHandler = setInterval(() => {
      //call a function every 1 second
      sec++;
      if(sec == 60){
        min++;
        sec = 0;
        if(min == 5){
          sec = 0;
          clearInterval(this.timeoutHandler);
          this.timeoutHandler = null;
          this.showCheckbox();
        }
      }
      let minString = this.zeroPad(min, 2);
      let secString = this.zeroPad(sec, 2);
      document.getElementById("timer").innerHTML = minString + " : " + secString;
     }, 1000);
  }

  zeroPad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }


  initMap() {
    console.log(this.lat);     // Create a map after the view is ready and the native platform is ready.
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // gestureHandling: 'cooperative', //Sets the gestureHandling property to cooperative to prevent one-finger movements
      zoomControl: false,  //Sets the zoomControl property to false to remove the Zoom control buttons on the map.
      fullscreenControl: false,
      // disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.panBy(0, 150);     //start panning
    let markerIcon = {      //Load the markers
        url: "https://res.cloudinary.com/myjiran/image/upload/v1538464327/mobile_asset/My-location.svg",
        scaledSize: new google.maps.Size(60, 60),
        origin: new google.maps.Point(0, 0), // used if icon is a part of sprite, indicates image position in sprite
        anchor: new google.maps.Point(20,40) // lets offset the marker image
      }
    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: markerIcon,
        position: latLng
    });
    let infoWindow = new google.maps.InfoWindow({
        content: "Help Me!"
    });
    google.maps.event.addListener(marker, 'click',() => {
        infoWindow.open(this.map, marker);
    });
    this.timerCountdown();
  }

  showTrusted(){
    let navigationExtras: NavigationExtras = {
      state: {
        // sos_type: "none"
      }
    };
    this.router.navigate(['sos'], navigationExtras);  //navigate ke page lain
  }

  stop(){
    //this.loadingProvider.setupLoading();
    this.restProvider.getEmergencyToken(this.personid).then((res:any) =>{
      console.log(res);
      this.andList = res.android;
      this.iosList = res.ios;
      this.sendPush();
    }).catch(error => {
      console.log(error);
      this.alertProvider.errorAlert()
      //this.loadingProvider.closeLoading();
    })
  }

  sendPush(){
    this.pushList = [];
    let time = new Date().getTime();
    if(this.andList.length > 0){
      let pushData = {
        registration_ids : this.andList,
        notification: {
          notId: null, // notId on Android needed to be an int and not a string
          title: "Emergency Call",
          body: "This user has ended the emergency call session.",
          soundname: "default",
          // android_channel_id: "emergency",
          type: "Stop",
          avatar: this.profilePictUrl,
          who: this.personName,
          created: time
        }
      }
      this.pushList.push(pushData);

    }else if(this.iosList.length > 0){
      let pushData = {
        registration_ids : this.iosList,
        notification:{
          title: "Emergency Call",
          body: "This user has ended the emergency call session.",
          sound: "default",
        },
        data: {
          notId: null, // notId on Android needed to be an int and not a string
          title: "Emergency Call",
          body: "This user has ended the emergency call session.",
          type: "Stop",
          avatar: this.profilePictUrl,
          who: this.personName,
          created: time
        }
      }
      this.pushList.push(pushData);
    }
    this.loadingProvider.closeLoading();
    this.restProvider.sendPush(this.pushList,this.personid).subscribe((result:any) => {
      console.log('Stop SOS Notification Sent');
      console.log(result);
      this.loadingProvider.closeLoading();
      this.navCtrl.back();
    });
  }

  // closemodal(){
  //   this.modalController.dismiss();
  // }

}
