import { Component, Input } from '@angular/core';
import { IResource } from '../../../../models/iresource';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss'
})
export class ResourceListComponent {
  @Input() resources: IResource[] = [];
}
