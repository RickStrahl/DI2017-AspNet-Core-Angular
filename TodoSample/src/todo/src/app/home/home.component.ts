import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    name = '';
    time = new Date();

    constructor() {
        setInterval( ()=> this.time = new Date(), 1000);
    }


    ngOnInit() {
    }

}
