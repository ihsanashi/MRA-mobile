import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';


@Injectable()
export class RestProvider {
    getTaskList(arg0: number) {
      throw new Error('Method not implemented.');
    }

    appConfheaders: any = new HttpHeaders().set('Content-Type', 'application/json');
    token: any = 'sdf2f6c2h5g333431293813113126528162203526172114910252443223363773918181930INTERNAL';

    constructor(
        public http: HttpClient,
    ) {
    }

    appConf(app) {
        return new Promise((resolve, reject) => {
            let devplink = 'http://192.168.43.221:8181/hss-start-0.0.1-SNAPSHOT/app/config/r';
            // let devplink = 'https://www.myjiran.my/myjiran-oas-admin-0.0.1-SNAPSHOT/app/config/r'; 
            this.http.post(devplink, [app], {
                headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token)
            })
                .subscribe((res: any) => {
                    resolve(res);
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/project/v/320
    async getProjectList(orgId){
        try{
          let app = await this.appConf("PRJL");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/project/v/"+orgId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/det/v/{projId}
    async getProjectDetail(projId){
        try{
          let app = await this.appConf("PRJL");   //no need shortName
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/det/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }

    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/feed/v/{projId}
    async getProjectFeed(projId){
        try{
          let app = await this.appConf("PRJM");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/feed/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }


    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/feed/u
    async postProjectFeed(form,detail){
        try{
          let app = await this.appConf("PRJM");
        console.log(app);
        return new Promise((resolve, reject) => {
          console.log('form',form)
            let data = {
                projId:detail.projId,
                personId:75187,//personId,
                enabled:'Y',
                feedName:form.formName,
                createdDate: moment().format()
              };
              this.http.post('http://192.168.43.221:8181/hss-project-0.0.1-SNAPSHOT/proj/feed/u', JSON.stringify(data),{
                headers: new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token).set('api-key', app[0].apiKey)
              })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }
    //http://localhost:8181/hss-project-0.0.1-SNAPSHOT/proj/task/v/{projId}
    async getTasksList(projId){
        try{
          let app = await this.appConf("PRJM");   
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/proj/task/v/"+projId,{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }
      
      //http://localhost:8181/hss-organization-admin-0.0.1-SNAPSHOT/gallery/r
      async getLiveFeed(){
        try{
          let app = await this.appConf("GLMG");
        console.log(app);
        return new Promise((resolve, reject) => {
          this.http.get(app[0].host+app[0].contextPath+"/gallery/r/",{headers: new HttpHeaders().set('token', this.token)
          .set('api-key', app[0].apiKey)
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
        }catch(e){
          console.log(e);
        }
    
    }



}
 