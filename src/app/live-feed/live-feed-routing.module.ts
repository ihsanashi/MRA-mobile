import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveFeedPage } from './live-feed.page';

const routes: Routes = [
  {
    path: '',
    component: LiveFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveFeedPageRoutingModule {}
