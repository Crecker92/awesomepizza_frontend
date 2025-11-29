import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { UserService } from '../../services/user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate based on role', () => {
    const loginSpy = spyOn(userService, 'login').and.stub();
    const navigateSpy = spyOn(router, 'navigate').and.stub();
    component.login('admin');
    expect(loginSpy).toHaveBeenCalledOnceWith('admin');
    expect(navigateSpy).toHaveBeenCalledOnceWith(['admin']);
  });
});
