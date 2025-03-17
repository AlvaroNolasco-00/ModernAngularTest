import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  imports: [],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {

  public name = input<string>('')

  public computedAvatarImage = computed(() => {
    const name = this.name()
    return `https://ui-avatars.com/api/?name=${name}`
  })

}
