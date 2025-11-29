import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComponent } from './page.component';
import { By } from '@angular/platform-browser';
import { MatProgressBar } from '@angular/material/progress-bar';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;

  const title = 'Test title';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComponent, MatProgressBar]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    component.title = title;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const elements = fixture.debugElement.queryAll(By.css('h1'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toEqual(title);
  });

  it('should not show the progress bar', () => {
    component.showProgressBar = false;
    const elements = fixture.debugElement.queryAll(By.directive(MatProgressBar));
    expect(elements.length).toBe(0);
  });

  it('should show the progress bar', () => {
    component.showProgressBar = true;
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.directive(MatProgressBar));
    expect(elements.length).toBe(1);
  });
});
