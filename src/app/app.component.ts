import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'redoxAPI';
  allPullData = [];
  //using this to coordinate all of the different repos being read through
  numRepos = 0;
  reposRead = 0;

  ngOnInit(): void{
    this.fetchRepos(1,[]);
  }

  //Fetch the names of all of the repos in ramda's github org
  public async fetchRepos(pageNumber,pullData){
        let url = "https://api.github.com/orgs/ramda/repos?per_page=100&page=" + pageNumber;
        console.log(url);
        fetch(url,{
          method: "GET",
          headers: {
            Authorization: "token KEY"//API KEY HERE
          }
        }).then(res => res.json())
          .then((data) => {
            if(data.length == 0 || pageNumber > 10){
              //Once out of new repos, move to next step
              this.fetchPullsFromRepos(1,[],pullData);
            }else{
              let newPullData = pullData.concat(data);
              pageNumber++;
              this.fetchRepos(pageNumber,newPullData);
            }
          })
        .catch(err => { throw err });
  }

  //loop through the repos and have them each kick off their own fetchPulls
  public async fetchPullsFromRepos(pageNumber,pullData,repos){
    console.log(repos);
    this.numRepos = repos.length;
    let allPulls = [];
    for(let i =0; i<repos.length; i++){
      console.log(repos[i].name);
      this.fetchPulls(pageNumber,pullData, repos[i],allPulls);
    }
  }

    //get all the pages of pull data per repo
    public async fetchPulls(pageNumber,pullData, repo, allPulls){
      let url = "https://api.github.com/repos/ramda/" + repo.name + "/pulls?per_page=100&page=" + pageNumber;
      console.log(url);
      fetch(url,{
        method: "GET",
        headers: {
          Authorization: "token KEY"//API KEY HERE
        }
      })
      .then(res => res.json())
        .then((data) => {
          if(data.length == 0 || pageNumber > 10){
            allPulls = allPulls.concat(pullData);
            this.allPullData = this.allPullData.concat(pullData);
            this.reposRead++;
            //once all repos have had their pull data read we have the complete data set to work with
            if(this.reposRead == this.numRepos){
              this.handleData();
            }
          }else{
            let newPullData = pullData.concat(data);
            pageNumber++;
            this.fetchPulls(pageNumber,newPullData,repo, allPulls);
          }
        })
      .catch(err => { throw err });
    }

  //Finally have all pull data ready to be worked with
  public async handleData(){
    this.setText(this.allPullData.length);
    console.log(this.allPullData);
  }

  //Sets the text on the web page, mostly just dabbling around
  public setText(text){
    const webParagraph = window.document.getElementById("test")!
    webParagraph.innerHTML = text;
  }


}