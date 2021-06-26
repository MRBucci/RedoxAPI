import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'redoxAPI';

  ngOnInit(): void{
    this.fetchPulls(1,[]);
  }

  //starting on page 1 with an empty set of pull data and recursively going through all of the pages and adding them together
  public async fetchPulls(pageNumber,pullData){
    let url = "https://api.github.com/repos/ramda/ramda/pulls?per_page=10&page=" + pageNumber;
    console.log(url);
    fetch(url)
    .then(res => res.json())
      .then((data) => {
        if(data.length == 0){
          this.setText(pullData.length);
          this.handleData(pullData);
          return pullData;
        }else{
          let newPullData = pullData.concat(data);
          pageNumber++;
          this.fetchPulls(pageNumber,newPullData);
        }
      })
    .catch(err => { throw err });
  }

  //Sets the text on the web page, mostly just dabbling around
  public setText(text){
    const webParagraph = window.document.getElementById("test")!
    webParagraph.innerHTML = text;
  }

  //Where we'll work with the data in the pairing session
  public async handleData(pullData){
    console.log(pullData);
  }

}