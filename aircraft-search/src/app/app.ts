import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '@features/search/search.component';

@Component({
  imports: [RouterModule, SearchComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'aircraft-search';
}
