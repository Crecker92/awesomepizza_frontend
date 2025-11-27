import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from "@angular/router";
import { UserService } from '../../services/user.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'ap-home',
  imports: [MatButton],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  login(role: UserRole) {
    this.userService.login(role);
    this.router.navigate([role]);
  }

}
