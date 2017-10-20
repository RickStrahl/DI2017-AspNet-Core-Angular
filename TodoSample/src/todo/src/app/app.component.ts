import { Component } from '@angular/core';

declare var toastr:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dev Intersection';

  constructor() {
      toastr.options.closeButton = true;
      toastr.options.positionClass = "toast-bottom-right";
  }

}
